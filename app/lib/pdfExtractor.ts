import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  // @ts-ignore
  loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
    lib.GlobalWorkerOptions.workerSrc = workerSrc;
    pdfjsLib = lib;
    return lib;
  });

  return loadPromise;
}

/**
 * Extract raw text from all pages of a PDF file.
 * No canvas, no images — just text content for AI analysis.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  const lib = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await lib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    pageTexts.push(pageText);
  }

  return pageTexts.join("\n\n");
}
