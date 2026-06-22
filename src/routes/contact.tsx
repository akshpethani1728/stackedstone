import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Stacked Stone" },
      { name: "description", content: "Write to the Stacked Stone studio in Mumbai." },
      { property: "og:title", content: "Contact — Stacked Stone" },
      { property: "og:description", content: "Write to the studio." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="container-edit pt-40 md:pt-48 pb-16">
        <p className="eyebrow reveal">Contact</p>
        <h1 className="display mt-6 text-6xl md:text-8xl max-w-4xl reveal delay-1">
          Write to<br /><span className="italic">the studio.</span>
        </h1>
      </section>

      <section className="container-edit pb-32 md:pb-48 grid md:grid-cols-12 gap-16">
        <aside className="md:col-span-4 space-y-12">
          <div>
            <p className="eyebrow">Studio</p>
            <p className="mt-4 font-serif text-2xl leading-snug">
              4th floor, Khotachiwadi<br />Girgaon, Mumbai 400004
            </p>
          </div>
          <div>
            <p className="eyebrow">Hours</p>
            <p className="mt-4 font-serif text-2xl leading-snug">
              Tue – Sat<br />10.00 — 18.30
            </p>
          </div>
          <div>
            <p className="eyebrow">Direct</p>
            <p className="mt-4 font-serif text-2xl leading-snug">
              <a href="mailto:studio@stackedstone.co" className="hover:italic transition-all">studio@stackedstone.co</a><br />
              <a href="tel:+912200000000" className="hover:italic transition-all">+91 22 0000 0000</a>
            </p>
          </div>
        </aside>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="md:col-span-7 md:col-start-6 space-y-10"
        >
          {sent ? (
            <div className="border-t border-border pt-16">
              <p className="eyebrow">Sent</p>
              <h2 className="display mt-6 text-4xl md:text-5xl">
                Thank you. We read every letter,<br /><span className="italic">and reply slowly.</span>
              </h2>
            </div>
          ) : (
            <>
              <Field label="Your name" name="name" />
              <Field label="Email" name="email" type="email" />
              <Field label="Subject" name="subject" />
              <div>
                <label className="eyebrow">Message</label>
                <textarea
                  rows={5}
                  className="mt-4 w-full bg-transparent border-b border-border focus:border-foreground outline-none font-serif text-2xl py-3 transition-colors resize-none"
                />
              </div>
              <button type="submit" className="btn-primary">Send letter</button>
            </>
          )}
        </form>
      </section>

      <Footer />
    </main>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        className="mt-4 w-full bg-transparent border-b border-border focus:border-foreground outline-none font-serif text-2xl py-3 transition-colors"
      />
    </div>
  );
}
