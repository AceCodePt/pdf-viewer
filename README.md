# <pdf-viewer> Web Component (@ace-code/pdf-viewer)

A simple, standards-based web component for rendering individual pages from PDF documents directly in the browser. It leverages Mozilla's `pdf.js` library and is easily embeddable using just HTML.

This component is available directly via CDN for quick integration.

## Quick Start

Get started immediately by adding the component directly to your HTML file using a CDN link.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>PDF Viewer Quick Start</title>
    <meta charset="UTF-8" />
    <style>
      /* Give the viewer some dimensions */
      pdf-viewer {
        display: block; /* Ensure it behaves like a block element */
        width: 90%;
        max-width: 600px;
        height: 800px;
        border: 1px solid #ccc;
        margin: 20px auto; /* Center it */
      }
    </style>

    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@ace-code/pdf-viewer/+esm"
    ></script>
  </head>
  <body>
    <h1>My PDF Document</h1>

    <pdf-viewer
      url="https://cdn.jsdelivr.net/gh/mozilla/pdf.js/test/pdfs/tracemonkey.pdf"
      page="1"
    >
    </pdf-viewer>
  </body>
</html>
```

**To run this example:**

1. Save the code above as an HTML file (e.g., `viewer.html`).
2. Open the file in your web browser. _Note: For loading local PDFs, run this through a local web server to avoid potential CORS issues._

You can also run it using npm/pnpm/yarn:

```sh
npm install @ace-code/pdf-viewer
```

```sh
pnpm install @ace-code/pdf-viewer
```

```sh
yarn install @ace-code/pdf-viewer
```

and than add it as an standalone import:

```html
<script>
  import "@ace-code/pdf-viewer";
</script>
```

## Features

- **Zero Build Setup:** Usable directly from CDN.
- **Simple Usage:** Embed PDFs with just the `<pdf-viewer>` HTML tag.
- **Configurable:** Specify the PDF `url` and `page` number via attributes.
- **Standards-Based:** Built using native Web Components APIs (Custom Elements, Shadow DOM).
- **Encapsulated:** Uses Shadow DOM (`closed` mode) for style and DOM isolation.
- **Dependency Management:** Automatically loads the necessary `pdf.js` library and its worker from CDN (`cdn.jsdelivr.net`).
- **Responsive:** Renders the PDF page onto a `<canvas>` that scales with the component's container size.
- **High-Resolution:** Accounts for `devicePixelRatio` for sharp rendering.
- **Framework Agnostic:** Works seamlessly with vanilla JavaScript and integrates easily into frameworks like React, Vue, and Svelte.

## Installation / Setup

The primary way to use `<pdf-viewer>` is via the jsDelivr CDN.

1.  **Include the Module Script:** Add the following script tag to your HTML file, preferably in the `<head>` or at the end of the `<body>`:

    ```html
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@ace-code/pdf-viewer/+esm"
    ></script>
    ```

2.  **Pinning Versions (Optional but Recommended):** For production stability, you can pin the component to a specific version:

    ```html
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@ace-code/pdf-viewer@1.2.3/+esm"
    ></script>
    ```

    _(Replace `1.2.3` with the actual desired version number)_

This single script import defines the `<pdf-viewer>` custom element and handles loading its dependency, `pdfjs-dist`, also from the CDN.

## Basic Usage (Vanilla JS)

After including the module script (as shown in Installation), you can use the `<pdf-viewer>` tag anywhere in your HTML. Remember to provide the required `url` and `page` attributes.

**Example 1: Static HTML (Same as Quick Start)**

```html
<pdf-viewer
  url="https://cdn.jsdelivr.net/gh/mozilla/pdf.js/test/pdfs/compressed.tracemonkey-pldi-09.pdf"
  page="2"
>
</pdf-viewer>

<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@ace-code/pdf-viewer/+esm"
></script>
```

**Example 2: Dynamic Control with JavaScript**

You can easily manipulate the `url` and `page` attributes using JavaScript.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Dynamic PDF Viewer (CDN)</title>
    <style>
      pdf-viewer .controls {
        margin-bottom: 10px;
      }
    </style>
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@ace-code/pdf-viewer/+esm"
    ></script>
  </head>
  <body>
    <h1>Dynamic PDF Control</h1>
    <div class="controls">
      <label for="pageNum">Page:</label>
      <input type="number" id="pageNum" value="1" min="1" />
      <button id="prevBtn">Prev</button>
      <button id="nextBtn">Next</button>
    </div>
    <pdf-viewer
      id="myViewer"
      url="https://cdn.jsdelivr.net/gh/mozilla/pdf.js/test/pdfs/tracemonkey.pdf"
      page="1"
    >
    </pdf-viewer>

    <script type="module">
      const viewer = document.getElementById("myViewer");
      const pageInput = document.getElementById("pageNum");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");

      function updatePage(newPage) {
        const pageNum = parseInt(newPage, 10);
        if (!isNaN(pageNum) && pageNum > 0) {
          viewer.setAttribute("page", pageNum.toString());
          pageInput.value = pageNum; // Sync input field
        }
      }

      prevBtn.addEventListener("click", () => {
        const currentPage = parseInt(viewer.getAttribute("page") || "1", 10);
        updatePage(Math.max(1, currentPage - 1));
      });

      nextBtn.addEventListener("click", () => {
        const currentPage = parseInt(viewer.getAttribute("page") || "1", 10);
        updatePage(currentPage + 1);
        // Note: We don't know the max page count here easily.
      });

      pageInput.addEventListener("change", () => {
        updatePage(pageInput.value);
      });

      // Initial setup reflection (if needed)
      // pageInput.value = viewer.getAttribute('page') || '1';
    </script>
  </body>
</html>
```

## Attributes API

- **`url`** (string, **required**)
  - The URL to the PDF file. Can be absolute or relative. Ensure CORS headers are set appropriately if loading from a different domain.
  - Changing this attribute reloads the component with the new PDF.
- **`page`** (number, **required**)
  - The 1-based index of the page number to render.
  - Must be a positive integer. Invalid values might cause errors or unexpected behavior.
  - Changing this attribute renders the specified page of the current PDF.
  - If the number exceeds the PDF's page count, the component renders the _last_ page.

## Framework Integration

Using `<pdf-viewer>` from the CDN works well within modern frameworks. The key is to ensure the component definition script is loaded and then use the tag in your templates.

---

### React

Load the component script (e.g., in `public/index.html` or via a side-effect import in your main JS/TS file) and use the tag directly.

```jsx
// src/PdfViewerComponent.jsx
import React, { useState, useEffect } from "react";

// Option 1: Ensure the script is loaded via <script> tag in index.html
// <script type="module" src="[https://cdn.jsdelivr.net/npm/@ace-code/pdf-viewer/+esm](https://cdn.jsdelivr.net/npm/@ace-code/pdf-viewer/+esm)"></script>

// Option 2: Import for side effects (might depend on build tool capabilities)
import "[https://cdn.jsdelivr.net/npm/@ace-code/pdf-viewer/+esm](https://cdn.jsdelivr.net/npm/@ace-code/pdf-viewer/+esm)";

function PdfViewerComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const pdfUrl =
    "https://cdn.jsdelivr.net/gh/mozilla/pdf.js/test/pdfs/tracemonkey.pdf";

  const goToNextPage = () => setCurrentPage((prev) => prev + 1);
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));

  return (
    <div>
      <h2>React PDF Viewer (CDN Import)</h2>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={goToPrevPage} disabled={currentPage <= 1}>
          Previous
        </button>
        <span> Page: {currentPage} </span>
        <button onClick={goToNextPage}>Next</button>
      </div>

      {/* Use the custom element tag */}
      <pdf-viewer
        url={pdfUrl}
        page={currentPage.toString()} // Pass attributes
        style={{
          display: "block",
          width: "600px",
          height: "800px",
          border: "1px solid blue",
        }}
      ></pdf-viewer>
    </div>
  );
}
export default PdfViewerComponent;
```

---

### Vue

Configure Vue to recognize the custom element (see previous README example for `vite.config.js` if needed) and ensure the CDN script is loaded.

```vue
<template>
  <div>
    <h2>Vue PDF Viewer (CDN Import)</h2>
    <div class="controls">
       <button @click="goToPrevPage" :disabled="currentPage <= 1">Previous</button>
       <span> Page: {{ currentPage }} </span>
       <button @click="goToNextPage">Next</button>
    </div>
    <pdf-viewer
      :url="pdfUrl"
      :page="currentPage"
      class="viewer"
    ></pdf-viewer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Option 1: Ensure the script is loaded via <script> tag in index.html
// <script type="module" src="https://cdn.jsdelivr.net/npm/@ace-code/pdf-viewer/+esm"></script>

// Option 2: Import for side effects (ensure this runs before template compilation/mount)
// Note: Top-level imports might be better in main.js/ts
import 'https://cdn.jsdelivr.net/npm/@ace-code/pdf-viewer/+esm';

const currentPage = ref(1);
const pdfUrl = ref("https://cdn.jsdelivr.net/gh/mozilla/pdf.js/test/pdfs/tracemonkey.pdf");

const goToNextPage = () => currentPage.value++;
const goToPrevPage = () => { if (currentPage.value > 1) currentPage.value--; };

// Optional: If using Vite/Vue3 and need to suppress warnings
// Ensure compilerOptions.isCustomElement is configured in vite.config.js

</script>

<style scoped>
.viewer { display: block; width: 600px; height: 800px; border: 1px solid green; }
.controls { margin-bottom: 10px; }
</style>
```

---

### Svelte

Svelte handles custom elements well. Just make sure the CDN script is loaded.

```svelte
<script>
  // Option 1: Ensure the script is loaded via <script> tag in app.html
  // <script type="module" src="https://cdn.jsdelivr.net/npm/@ace-code/pdf-viewer/+esm"></script>

  // Option 2: Import for side effects (e.g., in +layout.svelte or main script)
  import 'https://cdn.jsdelivr.net/npm/@ace-code/pdf-viewer/+esm';

  let currentPage = 1;
  let pdfUrl = "https://cdn.jsdelivr.net/gh/mozilla/pdf.js/test/pdfs/tracemonkey.pdf";

  function goToNextPage() { currentPage += 1; }
  function goToPrevPage() { if (currentPage > 1) currentPage -= 1; }
</script>

<div>
  <h2>Svelte PDF Viewer (CDN Import)</h2>
  <div class="controls">
    <button on:click={goToPrevPage} disabled={currentPage <= 1}>Previous</button>
    <span> Page: {currentPage} </span>
    <button on:click={goToNextPage}>Next</button>
  </div>

  <pdf-viewer
    url={pdfUrl}
    page={currentPage}
    class="viewer"
  ></pdf-viewer>
</div>

<style>
  .viewer { display: block; width: 600px; height: 800px; border: 1px solid orange; }
  .controls { margin-bottom: 10px; }
</style>
```

## Dependencies

- **pdf.js (`pdfjs-dist`)**: The core PDF rendering library. The `<pdf-viewer>` component automatically loads the required parts of `pdfjs-dist` (including the worker) from `cdn.jsdelivr.net` when imported itself from the CDN. You don't need to include `pdfjs-dist` separately when using the CDN import for `@ace-code/pdf-viewer`.

## How It Works Internally

(This section remains largely the same as the previous README - it describes the component's internal mechanics using Custom Elements, Shadow DOM, Canvas, `pdf.js`, and attribute handling.)

1.  **Custom Element Registration:** Defines `pdf-viewer`.
2.  **Shadow DOM:** Creates an isolated `<canvas>` and `<style>`.
3.  **Attribute Observation:** Watches `url` and `page`.
4.  **`attributeChangedCallback`:** Fetches PDF on `url` change, triggers re-render on `url` or `page` change.
5.  **`renderPage`:** Gets the PDF page, sets canvas size (considering devicePixelRatio), and renders the page onto the canvas using `pdf.js`.

## Limitations & Potential Improvements

- Single Page display only.
- No built-in UI controls (zoom, pagination, etc.).
- Basic error handling.
- Relies on CDN for itself and `pdf.js`. (Consider implications for offline use or stricter environments).
- Performance depends on PDF complexity.
- Accessibility limited by canvas rendering (no direct text access).
- `closed` Shadow DOM limits external access.
- Does not expose PDF metadata like total page count.
