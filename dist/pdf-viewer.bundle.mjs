// Helper function to create a promise with resolve and reject functions
function withResolvers() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}
const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  </style>
  <canvas />
`;
(async () => {
    if (!window.pdfjsLib) {
        // @ts-ignore
        await import('https://cdn.jsdelivr.net/npm/pdfjs-dist/+esm');
    }
    class PDFViewer extends HTMLElement {
        static elementName = "pdf-viewer";
        static observedAttributes = ["url", "page"];
        _canvas;
        _pdfDocument;
        rendering = false;
        constructor() {
            super();
            // Assuming pdfjsLib is globally available
            // You might need to declare it in a global.d.ts if TypeScript complains
            // For now, we'll assume it's there.
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${window.pdfjsLib.version}/build/pdf.worker.min.mjs`;
            this._pdfDocument = withResolvers();
            const shadowRoot = this.attachShadow({ mode: "closed" });
            shadowRoot.appendChild(template.content.cloneNode(true));
            this._canvas = this.initializeCanvas(shadowRoot);
        }
        initializeCanvas(shadowRoot) {
            const _canvas = shadowRoot.querySelector("canvas");
            if (!_canvas) {
                throw new Error(`Couldn't find the canvas on the template`);
            }
            return _canvas;
        }
        get url() {
            const _url = this.getAttribute("url");
            if (!_url) {
                throw new Error(`url doesn't exist on the component`);
            }
            return _url;
        }
        set url(_url) {
            this.setAttribute("url", _url);
        }
        get page() {
            const _page = this.getAttribute("page");
            if (!_page) {
                throw new Error(`page doesn't exist on the component`);
            }
            const pageNumber = +_page;
            if (isNaN(pageNumber) || pageNumber <= 0) {
                throw new Error(`Page isn't a valid number`);
            }
            return pageNumber;
        }
        set page(_page) {
            const pageNumber = +_page;
            if (isNaN(pageNumber) || pageNumber <= 0) {
                throw new Error(`Page isn't a valid number`);
            }
            this.setAttribute("page", pageNumber.toString());
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) {
                return;
            }
            if (name === "url" && newValue) {
                this._pdfDocument = withResolvers();
                // @ts-ignore
                pdfjsLib
                    .getDocument(newValue)
                    .promise.then(this._pdfDocument.resolve)
                    .catch(this._pdfDocument.reject);
            }
            if (!this.rendering) {
                this.rendering = true;
                requestAnimationFrame(() => {
                    this.renderPage().then(() => {
                        this.rendering = false;
                    });
                });
            }
        }
        async renderPage() {
            const pdfDocument = await this._pdfDocument.promise;
            if (pdfDocument.numPages < this.page) {
                this.page = pdfDocument.numPages;
            }
            const page = await pdfDocument.getPage(this.page);
            pdfDocument.numPages;
            const canvasContext = this._canvas.getContext("2d");
            if (!canvasContext) {
                throw new Error(`Couldn't find the canvas context`);
            }
            const viewport = page.getViewport({ scale: 1 });
            const outputScale = window.devicePixelRatio || 1;
            this._canvas.width = Math.floor(viewport.width * outputScale);
            this._canvas.height = Math.floor(viewport.height * outputScale);
            const transform = [outputScale, 0, 0, outputScale, 0, 0];
            const renderContext = {
                canvasContext,
                transform: transform,
                viewport: viewport,
            };
            page.render(renderContext);
        }
    }
    customElements.define(PDFViewer.elementName, PDFViewer);
})();
