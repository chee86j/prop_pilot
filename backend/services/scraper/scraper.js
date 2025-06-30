import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { setupLogger } from "./utils/logger.js";
import { ScraperException, NetworkException } from "./utils/exceptions.js";

const logger = setupLogger("scraper", "scraper.log");

async function parsePage(url) {
  let browser = null;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Navigate to page
    logger.info(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: "networkidle0" });

    // Wait for the table to load
    await page.waitForSelector("table", { timeout: 10000 });

    // Get page content
    const content = await page.content();
    const $ = cheerio.load(content);

    const properties = [];

    // Parse table rows
    $("table tr").each((index, element) => {
      if (index === 0) return; // Skip header row

      const $row = $(element);
      const $cells = $row.find("td");

      if ($cells.length < 6) return; // Skip invalid rows

      const property = {
        address: $cells.eq(1).text().trim(),
        defendant: $cells.eq(2).text().trim(),
        plaintiff: $cells.eq(3).text().trim(),
        attorney: $cells.eq(4).text().trim(),
        price: parsePrice($cells.eq(5).text().trim()),
        status: $cells.eq(6).text().trim(),
        sale_date: $cells.eq(0).text().trim(),
      };

      // Add details link if available
      const detailsLink = $cells.eq(7).find("a").attr("href");
      if (detailsLink) {
        property.details_url = new URL(detailsLink, url).href;
      }

      properties.push(property);
    });

    logger.info(`Found ${properties.length} properties`);
    return properties;
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new NetworkException(
        `Timeout while loading page: ${error.message}`
      );
    }
    throw new ScraperException(`Error parsing page: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function parsePrice(priceStr) {
  try {
    // Remove currency symbol and commas, then convert to float
    return parseFloat(priceStr.replace(/[$,]/g, ""));
  } catch (error) {
    logger.warn(`Failed to parse price: ${priceStr}`);
    return 0;
  }
}

async function getPropertyDetails(url) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    // Wait for details to load
    await page.waitForSelector(".property-details", { timeout: 10000 });

    const content = await page.content();
    const $ = cheerio.load(content);

    const details = {
      description: $(".property-description").text().trim(),
      lot_size: $(".lot-size").text().trim(),
      year_built: $(".year-built").text().trim(),
      tax_info: $(".tax-info").text().trim(),
    };

    return details;
  } catch (error) {
    logger.error(`Error fetching property details: ${error}`);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export { parsePage, getPropertyDetails };
