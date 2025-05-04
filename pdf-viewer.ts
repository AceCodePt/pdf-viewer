import type { PDFDocumentProxy } from "pdfjs-dist";

if (!window.pdfjsLib) {
  // @ts-ignore
  await import("https://cdn.jsdelivr.net/npm/pdfjs-dist/+esm");
}

// Helper function to create a promise with resolve and reject functions
function withResolvers<T>(): PromiseWithResolvers<T> {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: any) => void;
  const promise = new Promise<T>((res, rej) => {
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

class PDFViewer extends HTMLElement {
  static elementName = "pdf-viewer";
  static observedAttributes = ["url", "page"];
  private readonly _canvas: HTMLCanvasElement;
  private _pdfDocument: PromiseWithResolvers<PDFDocumentProxy>;
  private rendering: boolean = false;

  constructor() {
    super();
    // Assuming pdfjsLib is globally available
    // You might need to declare it in a global.d.ts if TypeScript complains
    // For now, we'll assume it's there.
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${window.pdfjsLib.version}/build/pdf.worker.min.mjs`;

    this._pdfDocument = withResolvers<PDFDocumentProxy>();
    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this._canvas = this.initializeCanvas(shadowRoot);
  }

  private initializeCanvas(shadowRoot: ShadowRoot): HTMLCanvasElement {
    const _canvas = shadowRoot.querySelector<HTMLCanvasElement>("canvas");
    if (!_canvas) {
      throw new Error(`Couldn't find the canvas on the template`);
    }
    return _canvas;
  }

  get url(): string {
    const _url = this.getAttribute("url");
    if (!_url) {
      throw new Error(`url doesn't exist on the component`);
    }
    return _url;
  }

  set url(_url: string) {
    this.setAttribute("url", _url);
  }

  get page(): number {
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

  set page(_page: number) {
    const pageNumber = +_page;
    if (isNaN(pageNumber) || pageNumber <= 0) {
      throw new Error(`Page isn't a valid number`);
    }
    this.setAttribute("page", pageNumber.toString());
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue) {
      return;
    }
    if (name === "url" && newValue) {
      this._pdfDocument = withResolvers<PDFDocumentProxy>();
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

  private async renderPage() {
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
