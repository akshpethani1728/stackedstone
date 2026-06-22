import { createFileRoute } from "@tanstack/react-router";
import { AccountShell } from "@/components/studio/AccountShell";

export const Route = createFileRoute("/account/profile")({
  head: () => ({ meta: [{ title: "Profile — Stacked Stone" }, { name: "robots", content: "noindex" }] }),
  component: ProfilePage,
});

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-3">{label}</span>
      <input
        defaultValue={value}
        className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground outline-none py-3 font-serif text-xl"
      />
    </label>
  );
}

function ProfilePage() {
  return (
    <AccountShell>
      <section className="container-edit pt-20 md:pt-28 pb-32">
        <p className="eyebrow">Profile</p>
        <h1 className="display mt-6 text-5xl md:text-7xl">You, <span className="italic">briefly.</span></h1>

        <div className="mt-20 grid md:grid-cols-12 gap-16">
          <div className="md:col-span-7 space-y-10">
            <Field label="Name" value="Aanya Raman" />
            <Field label="Email" value="aanya@studio.com" />
            <Field label="Phone" value="+91 98200 00001" />
            <button className="btn-primary mt-6">Save changes</button>
          </div>

          <aside className="md:col-span-4 md:col-start-9 space-y-12">
            <div>
              <p className="eyebrow mb-6">Saved addresses</p>
              {[
                { label: "Home", body: "14 Carter Road, Bandra West\nMumbai 400050, India" },
                { label: "Studio", body: "Floor 3, Kala Ghoda\nMumbai 400001, India" },
              ].map((a) => (
                <div key={a.label} className="border-t border-border py-6">
                  <p className="eyebrow">{a.label}</p>
                  <p className="font-serif text-lg mt-3 whitespace-pre-line">{a.body}</p>
                </div>
              ))}
              <button className="btn-ghost mt-6">+ Add address</button>
            </div>
          </aside>
        </div>
      </section>
    </AccountShell>
  );
}
