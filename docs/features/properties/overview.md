# Properties and research

## Property list and records

The property list at `/propertylist` retrieves properties and provides access to individual records. Users can add a property at `/addproperty`, open its details at `/property/:propertyId`, edit information, and delete records. Property details bring together the property summary, map, fields, financial analysis, and project tracking. The API provides list, create, retrieve, update, and delete operations under `/api/properties`.

## Research and listings

Property forms include a research dropdown backed by county website links. The property list also includes controls that call the scraper and retrieve scraped properties. The backend scraper service contains county and Zillow scraping, formatting, storage, and CSV utilities. Availability depends on the external sites and local scraper setup; see the scraper section of the project README.

**Source:** `frontend/src/components/PropertyList.jsx`, `AddProperty.jsx`, `PropertyDetails.jsx`, `ResearchDropdown.jsx`, `frontend/src/utils/property.js`, `backend/routes/property.py`, and `backend/services/scraper/`.

## Typical workflow

1. Sign in and open the property list. The list endpoint identifies the user from the JWT and returns records owned by that user.
2. Open Add Property and enter the property name, address, city, state, and ZIP code. These are required by the create endpoint. Other fields can provide financial, contact, and descriptive context.
3. Open a property to review and edit its information, map, analysis, phases, and draws. The detail endpoint checks that the property belongs to the authenticated user.
4. Delete a property from the list when it is no longer needed. Deletion can fail if related records or database constraints prevent it; the API reports the error.

## Information stored on a property

The property model groups a large number of fields around a single property ID:

- **Identity and location:** property name, address, city, state, ZIP code, county, and descriptions of rooms and amenities.
- **Foreclosure research:** detail link, external property identifier, sheriff number, status date, plaintiff, defendant, and Zillow URL.
- **Departments and utilities:** municipal and department contacts, heating and cooling, utility companies, and account numbers.
- **Purchase and operation:** purchase and refinance costs, rehabilitation and construction costs, taxes, insurance, utilities, mortgage payments, rent, vacancy, management, maintenance, and equity.
- **Sale and financing:** estimated sale value, sale expenses, loan balance, cash to close, projected profit, cash flow, ROI, financing amount, interest rate, loan term, and lender contacts.
- **People:** buyer and seller representatives, attorneys, escrow and title contacts, property management, and other service providers.

The model validates a supplied state as two letters, ZIP code length as five characters, and selected cost fields as nonnegative. The create and update routes additionally parse numeric fields. The list response contains a smaller summary than the detailed property response.

## API and research behavior

| Method and path | Purpose |
| --- | --- |
| `GET /api/properties` | List the signed-in user's properties. |
| `POST /api/properties` | Create a property for that user. |
| `GET /api/properties/:id` | Retrieve the user's property details. |
| `PUT /api/properties/:id` | Update the user's property fields. |
| `DELETE /api/properties/:id` | Delete the user's property. |
| `POST /api/run-scraper` | Run the scraper for the supplied county; the route defaults to Morris if omitted. |
| `GET /api/scraped-properties?county=...` | Read merged scraper CSV results and optionally filter by county. |

Scraped listings are read from `backend/services/scraper/downloads/merged_data.csv`; the endpoint returns 404 when the file or matching records are unavailable. Research links and scraped results are external data sources and can change independently of the app. A scraped listing and a saved property are distinct data sources.

## Property list interaction specification

The list fetches `GET /api/properties` on mount using the bearer token in local storage, and separately fetches the profile. Its grid supports three independent min/max ranges: purchase cost, total rehab cost, and ARV sale price. A row must pass all three ranges. Bounds are inclusive; an omitted bound does not restrict that side. Apply clears the grid's existing filter model and refreshes its external filter; Reset also clears all six values. The component determines mobile layout from `window.innerWidth <= 768`.

Selecting Details navigates to the property route. Delete first opens a browser confirmation; a successful response removes the row locally and shows a success toast, while a failed response shows an error toast. Add Property navigates to `/addproperty`.

The scraper county selector offers Morris, Bergen, Essex, Union, and Hudson, initially Morris. Changing county clears the displayed scraped listings and selection. Running the scraper posts the selected county, shows loading state, then requests the matching scraped records after success. Rows are identified by `property_id`, falling back to address. Users can select rows individually or select all; Import Selected transfers the selected records through router state to the add-property page. An empty selection produces an informational toast. This transfer opens the creation workflow; selecting a listing does not itself persist a property.

## Detail editing interaction specification

On mount, the detail page independently requests the property and its phases. It shows loading and error states for the property request; phase failures are logged. The initial section is basic information, with financial, utility, and contact sections initially collapsed. The page supports swipe navigation between sections and exposes grouped fields for foreclosure, location, departments, outlay, sale projection, utilities, key players, lender, and sales and marketing. Outlay and sale projection groups start expanded. It also provides print actions for details and financial information.

The page keeps an editable copy of the fetched property. Changes can be saved manually and are also sent through a 1,000 ms debounced save while editing. Consequently, canceling the visible edit state should not be assumed to undo changes already sent to the server. The progress indicator counts truthy, nonblank values in the editable object divided by its total number of keys, rounded to a whole percent; zero is counted as unfilled. The page refreshes its data through the retry action after an error.

See [data model reference](../../reference/data-model.md) for every declared property field and column type.
