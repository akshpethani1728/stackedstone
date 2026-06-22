import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/legal/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping — Stacked Stone" },
      { name: "description", content: "Shipping across India, timelines and packaging for Stacked Stone editions." },
    ],
  }),
  component: () => (
    <LegalLayout eyebrow="Shipping" title="From Jaipur," italic="to your door." updated="June 2026">
      <p className="lead">
        Each volume is printed in Jaipur, bound by hand, then sent out wrapped in cotton
        cloth and a recycled board sleeve. We ship across India.
      </p>

      <h2>Timelines</h2>
      <p>Books are produced in 2–3 weeks. Shipping then takes 3–7 working days, depending on your city.</p>

      <h2>Where we ship</h2>
      <p>We ship to every city and town across India via insured, carbon-neutral courier. All duties included; no surprises at your door.</p>

      <h2>Packaging</h2>
      <p>Every book travels inside its linen slipcase, inside a recycled corrugate sleeve, inside a rigid outer box. Three quiet layers.</p>

      <h2>Tracking</h2>
      <p>You'll receive an editorial timeline as your book moves through printing, binding, packing and dispatch — not a generic tracker.</p>
    </LegalLayout>
  ),
});
