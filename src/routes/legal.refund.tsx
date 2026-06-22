import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/legal/refund")({
  head: () => ({
    meta: [
      { title: "Refunds — Stacked Stone" },
      { name: "description", content: "Refunds, replacements and our approach to bespoke printed objects." },
    ],
  }),
  component: () => (
    <LegalLayout eyebrow="Refund" title="If something" italic="isn't right." updated="June 2026">
      <p className="lead">
        Each book is made for one person. We can't restock a custom volume — but we will do
        what's right when a book arrives less than perfect.
      </p>

      <h2>Before printing</h2>
      <p>You may cancel any draft up to the moment you approve the final proof. A full refund is issued within seven working days.</p>

      <h2>After approval</h2>
      <p>Once printing begins we are unable to refund the volume itself, as it has been made specifically for you.</p>

      <h2>Damaged on arrival</h2>
      <p>If your book arrives damaged, photograph the parcel and write to us within fourteen days. We will reprint and reship at no cost.</p>

      <h2>Print quality</h2>
      <p>If any spread does not meet our standard, we will reprint the book. Quietly, and without question.</p>
    </LegalLayout>
  ),
});
