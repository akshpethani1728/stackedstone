import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Stacked Stone" },
      { name: "description", content: "How Stacked Stone handles your photographs, account details and order information." },
    ],
  }),
  component: () => (
    <LegalLayout eyebrow="Privacy" title="What we keep," italic="and what we don't." updated="June 2026">
      <p className="lead">
        We treat your photographs the way we treat our own — quietly, carefully, and with the
        smallest number of hands touching them.
      </p>

      <h2>What we collect</h2>
      <p>Account details (name, email, shipping address) and the images you upload to build a book. We collect nothing else without asking.</p>

      <h2>How we use it</h2>
      <p>To create, print and ship your book; to send order updates; and to improve the studio experience. We do not sell, rent or trade your information.</p>

      <h2>Photographs</h2>
      <p>Your images remain yours. They are stored on encrypted servers, used solely to produce your book, and deleted from print files thirty days after delivery.</p>

      <h2>Cookies</h2>
      <p>We use a small number of cookies to keep you signed in and to understand which pages people read. No advertising trackers.</p>

      <h2>Your rights</h2>
      <p>You can request a copy of your data, ask us to forget you, or correct anything at any time. Write to <a href="mailto:privacy@stackedstone.co">privacy@stackedstone.co</a>.</p>
    </LegalLayout>
  ),
});
