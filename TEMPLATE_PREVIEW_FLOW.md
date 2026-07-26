# Template Preview Implementation Architecture

This document outlines the architecture and data flow for the Dynamic Template Preview system in PortfolioAI. This system allows users to preview static HTML templates in the browser, either with fallback dummy data or injected dynamically with their actual backend site data.

## 1. Directory Structure
All templates are stored in the frontend repository under:
`src/resumetemplateCollection/[TEMPLATE_ID]/`

Each template folder must contain:
- `index.html` (containing Handlebars syntax `{{variable}}`)
- `style.css` (template specific styling)
- `script.js` (template specific interactions)
- `data.json` (fallback dummy data for standard previews)

## 2. API Routes (Backend/Next.js)

### `GET /api/templates`
- **Purpose**: Dynamically scans the `src/resumetemplateCollection` directory.
- **Action**: Returns a list of available templates mapped to user-friendly titles and thumbnail images (located in the `public` directory).
- **Usage**: Used by `/dashboard/templates` to generate the template selection grid.

### `POST /api/templates/preview`
- **Purpose**: Compiles a selected template with data and returns a portable HTML string.
- **Parameters**: `templateId`, `siteId` (optional), `token`.
- **Flow**:
  1. Locates the template files based on `templateId`.
  2. Reads `index.html` and inlines the contents of `style.css` and `script.js` into `<style>` and `<script>` tags respectively.
  3. Determines the Data Source:
     - **If `siteId` is provided**: Makes an authenticated `fetch` call to the Node/Express backend (`http://localhost:4000/api/sites?siteId=...`) to retrieve the user's `parsedData` from the `SiteDetail` table.
     - **If `siteId` is omitted**: Reads the local `data.json` file from the template's folder to use as dummy data.
  4. Compiles the HTML using the **Handlebars** (`handlebars`) library, replacing all `{{...}}` tags with the corresponding data.
  5. Returns the finalized HTML string in a JSON response.

## 3. Frontend Architecture

### `/dashboard/templates` (Selection Page)
Displays all available templates using the `GET /api/templates` endpoint.
- **Preview Button**: Opens the template using dummy data (`/dashboard/preview?template=TEMPLATE_ID`).
- **Preview with Data Button** (Bottom Action Bar): Opens the template using the user's saved data (`/dashboard/preview?template=TEMPLATE_ID&siteId=ACTIVE_SITE_ID`).
- **Apply Template Button**: Makes a `PUT` request to update the active site's `templateKey` in the backend and redirects to `/dashboard/my-site`.

### `/dashboard/preview` (Preview Renderer)
A dedicated page to render the compiled templates safely.
- Displays a loading spinner while fetching the compiled HTML from `POST /api/templates/preview`.
- Once the HTML string is received, it is injected securely into a full-screen `<iframe>` using the `srcDoc={html}` attribute. 
- This ensures that the template's custom CSS and JS execute in isolation without polluting or breaking the React application's global styles and logic.

## 4. Handlebars Data Binding
To make a standard HTML template compatible with this system, hardcoded text must be replaced with Handlebars variables. The data structure aligns with the backend's `parsedData` object.

**Example Bindings:**
- `{{name}}` (Hero Name)
- `{{summary}}` (About Me/Summary)
- `{{#each skills}} {{this}} {{/each}}` (Skills Array)
- `{{#each experience}} {{role}} at {{company}} {{/each}}` (Experience Array)
- `{{#each projects}} {{title}} {{/each}}` (Projects Array)

## Summary
By keeping templates as plain HTML/CSS/JS and compiling them on the server side with Handlebars, PortfolioAI achieves a highly scalable theme system where new templates can be added by simply dropping a new folder into the collection, without requiring any complex React component refactoring.
