export enum BookStatus {
  Draft = "draft",
  Uploading = "uploading",
  Generating = "generating",
  PreviewReady = "preview_ready",
  Ordered = "ordered",
  Printing = "printing",
  QualityCheck = "quality_check",
  Packed = "packed",
  Shipped = "shipped",
  Delivered = "delivered",
  Archived = "archived",
}

export enum JobType {
  UploadImages = "upload_images",
  GeneratePreview = "generate_preview",
  GeneratePdf = "generate_pdf",
  SendEmail = "send_email",
  GenerateThumbnail = "generate_thumbnail",
  SyncOrder = "sync_order",
}

export enum JobStatus {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Failed = "failed",
  Cancelled = "cancelled",
}

export enum OrderStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
  Refunded = "refunded",
}

export enum NotificationChannel {
  Email = "email",
  InApp = "in_app",
}

export enum NotificationType {
  OrderConfirmation = "order_confirmation",
  ShippingUpdate = "shipping_update",
  DeliveryConfirmation = "delivery_confirmation",
  Promotional = "promotional",
  JobFailed = "job_failed",
}

export enum DiscountType {
  Percentage = "percentage",
  FixedAmount = "fixed_amount",
}

export enum UserRole {
  Customer = "customer",
  Admin = "admin",
  SuperAdmin = "super_admin",
}

export enum AddressType {
  Shipping = "shipping",
  Billing = "billing",
}

export enum DestinationCategory {
  Coastline = "Coastline",
  Mountains = "Mountains",
  Cities = "Cities",
  Deserts = "Deserts",
  Backwaters = "Backwaters",
  Atlantic = "Atlantic",
}
