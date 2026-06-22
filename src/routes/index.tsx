import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/site/Navigation";
import { Hero } from "@/components/site/Hero";
import { FeaturedCollection } from "@/components/site/FeaturedCollection";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Craft } from "@/components/site/Craft";
import { ShelfInspiration } from "@/components/site/ShelfInspiration";
import { Testimonials } from "@/components/site/Testimonials";
import { Faq } from "@/components/site/Faq";
import { Cta } from "@/components/site/Cta";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stacked Stone — Travel, bound between covers." },
      { name: "description", content: "Premium travel coffee-table books made from your photographs. Handcrafted, archival, designed for the shelf." },
      { property: "og:title", content: "Stacked Stone — Travel, bound between covers." },
      { property: "og:description", content: "Premium travel coffee-table books made from your photographs." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <FeaturedCollection />
      <HowItWorks />
      <Craft />
      <ShelfInspiration />
      <Testimonials />
      <Faq />
      <Cta />
      <Footer />
    </main>
  );
}
