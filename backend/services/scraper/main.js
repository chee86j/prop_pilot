import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { setupLogger } from "./utils/logger.js";
import {
  ScraperException,
  DatabaseException,
  NetworkException,
} from "./utils/exceptions.js";
import { parsePage } from "./scraper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = setupLogger("main", "logs/scraper.log");

// Define county URLs and IDs
const COUNTY_URLS = {
  Morris: {
    id: 9,
    url: "https://salesweb.civilview.com/Sales/SalesSearch?countyId=9",
  },
  Bergen: {
    id: 7,
    url: "https://salesweb.civilview.com/Sales/SalesSearch?countyId=7",
  },
  Essex: {
    id: 2,
    url: "https://salesweb.civilview.com/Sales/SalesSearch?countyId=2",
  },
  Union: {
    id: 15,
    url: "https://salesweb.civilview.com/Sales/SalesSearch?countyId=15",
  },
  Hudson: {
    id: 10,
    url: "https://salesweb.civilview.com/Sales/SalesSearch?countyId=10",
  },
};

function formatZillowUrl(address) {
  try {
    // Remove any unwanted characters and format the address
    let formattedAddress = address
      .trim()
      .replace(/\s+/g, "-")
      .replace(/,/g, "")
      .replace(/\./g, "")
      .replace(/--/g, "-")
      .toLowerCase();

    return `https://www.zillow.com/homes/${formattedAddress}_rb/`;
  } catch (error) {
    logger.error(`Error formatting Zillow URL for ${address}: ${error}`);
    return null;
  }
}

function formatForFrontend(data) {
  const formatted = {
    propertyName: data.address || "",
    address: data.address || "",
    city: "", // Would need to parse from address
    state: "", // Would need to parse from address
    zipCode: "", // Would need to parse from address
    county: "", // Would need to parse from address
    purchaseCost: data.price || 0,
    arvSalePrice: data.arv || 0, // If available from Zillow
    propertyType: data.property_type || "",
    bedroomsDescription: data.bed_bath_sqft
      ? data.bed_bath_sqft.split("bd")[0].trim()
      : "",
    bathroomsDescription: data.bed_bath_sqft
      ? data.bed_bath_sqft.split("ba")[0].split("bd")[1].trim()
      : "",
    yearlyPropertyTaxes: data.tax_history
      ? data.tax_history
          .slice(0, 1)
          .reduce(
            (sum, item) =>
              sum +
              parseFloat(item.property_taxes.replace("$", "").replace(",", "")),
            0
          )
      : 0,
  };

  // Add Zillow data if available
  if (data.zillow_details) {
    const zestimate = data.zillow_details.zestimate
      ?.replace("$", "")
      .replace(",", "");
    if (zestimate && !isNaN(parseFloat(zestimate))) {
      formatted.zestimate = parseFloat(zestimate);
    }
  }

  return formatted;
}

function exportFormattedData(formattedData, outputFile) {
  try {
    fs.writeFileSync(outputFile, JSON.stringify(formattedData, null, 2));
    logger.info(`Frontend-formatted data exported to ${outputFile}`);
  } catch (error) {
    logger.error(`Error exporting frontend data: ${error}`);
  }
}

async function main(county = "Morris") {
  try {
    // Ensure county is valid
    if (!COUNTY_URLS[county]) {
      logger.error(`❌ Invalid county: ${county}`);
      return false;
    }

    // Get county URL
    const { url, id: countyId } = COUNTY_URLS[county];

    // Ensure downloads folder exists
    const downloadsFolder = path.join(__dirname, "downloads");
    fs.mkdirSync(downloadsFolder, { recursive: true });

    // Step 1: Scrape auction data
    logger.info(`🔄 Starting page scrape for ${county} County: ${url}`);
    const data = await parsePage(url);

    if (!data || !data.length) {
      throw new ScraperException(
        `No data returned from scraping ${county} County`
      );
    }

    // Add county information to each record
    data.forEach((item) => (item.county = county));

    // Step 2: Load existing data from merged_data.csv if it exists
    const outputFile = path.join(downloadsFolder, "merged_data.csv");
    let existingData = [];

    if (fs.existsSync(outputFile)) {
      try {
        const csvContent = fs.readFileSync(outputFile, "utf-8");
        existingData = parse(csvContent, { columns: true });
      } catch (error) {
        logger.warning(`⚠️ Could not read existing merged_data.csv: ${error}`);
      }
    }

    // Step 3: Update existing data with new data
    // Create a dictionary of existing data keyed by address for quick lookup
    const existingDataDict = Object.fromEntries(
      existingData.map((item) => [item.address, item])
    );

    // Update or add new data
    data.forEach((item) => {
      if (existingDataDict[item.address]) {
        // Update existing entry
        Object.assign(existingDataDict[item.address], item);
      } else {
        // Add new entry
        existingDataDict[item.address] = item;
      }
    });

    // Convert back to array
    const mergedData = Object.values(existingDataDict);

    // Step 4: Generate Zillow URLs for new entries
    logger.info("🏠 Generating Zillow URLs");
    mergedData.forEach((item) => {
      if (!item["Zillow URL"]) {
        try {
          item["Zillow URL"] = formatZillowUrl(item.address);
        } catch (error) {
          logger.warning(
            `⚠️ Failed to generate Zillow URL for address ${item.address}: ${error}`
          );
        }
      }
    });

    // Step 5: Save merged data
    logger.info("💾 Saving merged data");
    const csvOutput = stringify(mergedData, { header: true });
    fs.writeFileSync(outputFile, csvOutput);
    logger.info(`✅ Data saved successfully to ${outputFile}`);

    return true;
  } catch (error) {
    logger.error(`❌ Error in main scraper function: ${error}`);
    console.error(error);
    return false;
  }
}

// Command line interface
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = yargs(hideBin(process.argv))
    .option("county", {
      type: "string",
      default: "Morris",
      choices: Object.keys(COUNTY_URLS),
      description: "County to scrape data from",
    })
    .help().argv;

  main(argv.county).then((success) => {
    if (success) {
      logger.info(`✅ Script completed successfully for ${argv.county} County`);
      process.exit(0);
    } else {
      logger.error(`❌ Script failed to complete for ${argv.county} County`);
      process.exit(1);
    }
  });
}

export { main, formatZillowUrl, formatForFrontend, exportFormattedData };
