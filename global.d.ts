import type * as pdfjsLib from "pdfjs-dist";

declare global {
  interface Window {
    pdfjsLib: typeof pdfjsLib;
  }
}
