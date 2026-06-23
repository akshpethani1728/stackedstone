import { PDFDocument } from "pdf-lib";
import type { PrintDocument, PrintElement } from "@/types/production";
import { StorageService } from "@/services/storage.service";
import { config } from "@/config";

export const PDFService = {
  async generatePrintPdf(document: PrintDocument): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();

    for (const page of document.pages) {
      const { pageWidthPoints, pageHeightPoints } = document.edition;
      const pdfPage = pdfDoc.addPage([pageWidthPoints, pageHeightPoints]);

      for (const el of page.elements) {
        if (el.kind === "image" && el.imageUrl) {
          try {
            const response = await fetch(el.imageUrl);
            const imageBytes = new Uint8Array(await response.arrayBuffer());

            const mime = el.imageUrl.match(/\.(png|jpe?g|webp)/i)?.[1]?.toLowerCase();
            let image;

            if (mime === "png") {
              image = await pdfDoc.embedPng(imageBytes);
            } else if (mime === "webp") {
              try {
                image = await pdfDoc.embedPng(imageBytes);
              } catch {
                image = await pdfDoc.embedJpg(imageBytes);
              }
            } else {
              image = await pdfDoc.embedJpg(imageBytes);
            }

            const { width, height } = image.scaleToFit(el.width, el.height);
            const cx = el.x + (el.width - width) / 2;
            const cy = pageHeightPoints - el.y - el.height + (el.height - height) / 2;

            pdfPage.drawImage(image, {
              x: cx,
              y: cy,
              width,
              height,
              opacity: el.opacity ?? 1,
            });
          } catch {
            const response = await fetch(el.imageUrl);
            const blob = await response.blob();
            const buffer = await blob.arrayBuffer();
            const imageBytes = new Uint8Array(buffer);

            try {
              const image = await pdfDoc.embedJpg(imageBytes);
              const { width, height } = image.scaleToFit(el.width, el.height);
              const cx = el.x + (el.width - width) / 2;
              const cy = pageHeightPoints - el.y - el.height + (el.height - height) / 2;
              pdfPage.drawImage(image, { x: cx, y: cy, width, height });
            } catch {
              pdfPage.drawRectangle({
                x: el.x,
                y: pageHeightPoints - el.y - el.height,
                width: el.width,
                height: el.height,
                borderColor: undefined,
                borderWidth: 1,
              });
            }
          }
        }
      }
    }

    return pdfDoc.save();
  },

  async storePdf(bookId: string, pdfBytes: Uint8Array, assetType: "print_pdf" | "cover_pdf"): Promise<string> {
    const bucket = config.storage.buckets.printPdfs;
    const path = `${bookId}/${assetType}.pdf`;
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const file = new File([blob], `${assetType}.pdf`, { type: "application/pdf" });

    await StorageService.upload(bucket, path, file);
    return StorageService.getPublicUrl(bucket, path);
  },
};
