import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms — Stacked Stone" },
      { name: "description", content: "Terms of service for the Stacked Stone studio and shop." },
    ],
  }),
  component: () => (
    <LegalLayout eyebrow="Terms" title="A short" italic="agreement." updated="June 2026">
      <p className="lead">
        Plain language. No surprises. By using Stacked Stone you agree to the following.
      </p>

      <h2>Your account</h2>
      <p>Keep your password to yourself. You are responsible for anything done through your account.</p>

      <h2>Your photographs</h2>
      <p>You confirm you own the rights to images you upload, and you grant us a limited licence to print and ship them as a book — nothing more.</p>

      <h2>Our work</h2>
      <p>Layouts, typography, illustrations and the Stacked Stone name remain our property. Please don't republish them as your own.</p>

      <h2>Pricing & taxes</h2>
      <p>Prices are shown including studio costs. Taxes and duties are calculated at checkout based on your shipping address.</p>

      <h2>Disputes</h2>
      <p>If something goes sideways, write to us first. We resolve almost everything by email within a week.</p>

      <h2>Changes</h2>
      <p>We may update these terms occasionally. Material changes are emailed to active customers.</p>
    </LegalLayout>
  ),
});
