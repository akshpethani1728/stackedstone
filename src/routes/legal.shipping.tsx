import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/legal/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping — Stacked Stone" },
      { name: "description", content: "Worldwide shipping, timelines and packaging for Stacked Stone editions." },
    ],
  }),
  component: () => (
    <LegalLayout eyebrow="Shipping" title="From Florence," italic="to your door." updated="June 2026">
      <p className="lead">
        Each volume is printed in Tuscany, bound by hand, then sent out wrapped in cotton
        cloth and a recycled board sleeve. We ship worldwide.
      </p>

      <h2>Timelines</h2>
      <p>Books are produced in 4–6 weeks. Shipping then takes 5–10 working days, depending on country.</p>

      <h2>Where we ship</h2>
      <p>We ship to 80+ countries via insured, carbon-neutral courier. Duties are pre-paid for most regions; checkout confirms the final figure for your address.</p>

      <h2>Packaging</h2>
      <p>Every book travels inside its linen slipcase, inside a recycled corrugate sleeve, inside a rigid outer box. Three quiet layers.</p>

      <h2>Tracking</h2>
      <p>You'll receive an editorial timeline as your book moves through printing, binding, packing and dispatch — not a generic tracker.</p>
    </LegalLayout>
  ),
});
