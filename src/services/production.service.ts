import { getSupabaseClient } from "@/lib/supabase";
import { fromSupabaseError, NotFoundError } from "@/lib/errors";
import { OrderService } from "@/services/order.service";
import { JobService } from "@/services/job.service";
import { AssetService } from "@/services/asset.service";
import { PreviewService } from "@/services/preview.service";
import { UploadService } from "@/services/upload.service";
import { PrintEngine } from "@/services/print-engine";
import { PDFService } from "@/services/pdf.service";
import { NotificationEventService } from "@/services/notification-event.service";
import type { Order } from "@/types/checkout";
import type { ProductionStatus } from "@/types/production";

const PRODUCTION_FLOW: ProductionStatus[] = [
  "pending",
  "preparing_files",
  "print_ready",
  "printing",
  "quality_check",
  "packaged",
  "ready_to_ship",
  "shipped",
  "delivered",
];

export const ProductionService = {
  async startProduction(orderId: string): Promise<void> {
    const order = await OrderService.getById(orderId);
    await ProductionService.advanceStatus(order.id, "confirmed");
    await ProductionService.advanceStatus(order.id, "preparing_files");

    const bookId = order.items?.[0]?.book_id;
    if (!bookId) throw new Error("Order has no book");

    const preview = await PreviewService.getPreview(bookId);
    if (!preview) throw new Error("Preview not generated for book");

    await JobService.create("generate_pdf", { bookId, orderId, editionSlug: "journey" });
    await JobService.create("generate_cover", { bookId, orderId });
    await JobService.create("generate_thumbnail", { bookId, orderId });
    await JobService.create("prepare_print_files", { bookId, orderId });

    await NotificationEventService.createEvent({
      userId: order.user_id,
      orderId: order.id,
      eventType: "order_paid",
      subject: "Order confirmed",
      body: "Your order has been confirmed and production is starting.",
    });
  },

  async processPdfJob(jobPayload: Record<string, unknown>): Promise<void> {
    const bookId = jobPayload.bookId as string;
    const orderId = jobPayload.orderId as string;
    const editionSlug = (jobPayload.editionSlug as string) ?? "journey";

    const preview = await PreviewService.getPreview(bookId);
    if (!preview) throw new Error("Preview not found");

    const photos = await UploadService.listPhotos(bookId);
    const book = await getSupabaseClient()
      .from("books")
      .select("*, edition:edition_id(*)")
      .eq("id", bookId)
      .single()
      .then((r) => r.data);

    const document = PrintEngine.build({
      bookId,
      editionSlug: book?.edition?.slug ?? editionSlug,
      preview,
      photos: photos.map((p: any) => ({
        id: p.id,
        storage_url: p.storage_url,
        width: p.width,
        height: p.height,
      })),
    });

    const pdfBytes = await PDFService.generatePrintPdf(document);
    const pdfUrl = await PDFService.storePdf(bookId, pdfBytes, "print_pdf");

    await AssetService.record({
      book_id: bookId,
      order_id: orderId,
      asset_type: "print_pdf",
      file_path: pdfUrl,
      mime_type: "application/pdf",
      metadata: { pages: document.pages.length, edition: editionSlug },
    });

    await NotificationEventService.createEvent({
      userId: book?.user_id,
      orderId,
      eventType: "pdf_ready",
      subject: "Print PDF ready",
      body: "The print-ready PDF has been generated.",
    });
  },

  async advanceStatus(orderId: string, status: ProductionStatus): Promise<void> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.rpc("advance_production_status", {
      p_order_id: orderId,
      p_status: status,
      p_production_step: status,
    });

    if (error) throw fromSupabaseError(error);
    if (!data) throw new NotFoundError("Order", orderId);

    const eventTypeMap: Record<string, string> = {
      printing_started: "printing_started",
      packaged: "packed",
      ready_to_ship: "ready_to_ship_update",
      shipped: "shipped_update",
      delivered: "delivered_update",
    };

    const eventType = eventTypeMap[status];
    if (eventType) {
      await NotificationEventService.createEvent({
        userId: data.user_id,
        orderId,
        eventType,
        subject: `Order ${status}`,
        body: `Your order status has been updated to ${status}.`,
      });
    }
  },

  async processQueue(): Promise<void> {
    const jobs = await JobService.listPending();
    for (const job of jobs) {
      try {
        await JobService.start(job.id);

        switch (job.type) {
          case "generate_pdf":
            await ProductionService.processPdfJob(job.payload);
            break;
          case "generate_cover":
            await ProductionService.processPdfJob({ ...job.payload, isCover: true });
            break;
          case "generate_thumbnail":
            break;
          case "prepare_print_files":
            break;
        }

        await JobService.complete(job.id, { processed: true });
      } catch (err: any) {
        await JobService.fail(job.id, err.message);
      }
    }
  },

  canTransition(from: ProductionStatus, to: ProductionStatus): boolean {
    const fromIdx = PRODUCTION_FLOW.indexOf(from);
    const toIdx = PRODUCTION_FLOW.indexOf(to);
    return fromIdx >= 0 && toIdx >= 0 && toIdx === fromIdx + 1;
  },
};
