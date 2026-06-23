import { useState } from "react";
import type { AddressInput } from "@/types/checkout";

type Props = {
  initial?: AddressInput;
  onSubmit: (data: AddressInput) => Promise<void>;
  onCancel?: () => void;
};

export function AddressForm({ initial, onSubmit, onCancel }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AddressInput>(
    initial ?? {
      name: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      is_default: false,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  const update = (k: keyof AddressInput, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <label className="block">
          <span className="eyebrow block mb-2">Full name</span>
          <input required value={form.name} onChange={(e) => update("name", e.target.value)}
            className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground outline-none py-2.5 font-serif text-lg placeholder:text-muted-foreground/60" />
        </label>
        <label className="block">
          <span className="eyebrow block mb-2">Phone</span>
          <input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
            className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground outline-none py-2.5 font-serif text-lg placeholder:text-muted-foreground/60" />
        </label>
      </div>
      <label className="block">
        <span className="eyebrow block mb-2">Address line 1</span>
        <input required value={form.line1} onChange={(e) => update("line1", e.target.value)}
          className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground outline-none py-2.5 font-serif text-lg placeholder:text-muted-foreground/60" />
      </label>
      <label className="block">
        <span className="eyebrow block mb-2">Address line 2 <span className="text-muted-foreground/60 font-normal">(optional)</span></span>
        <input value={form.line2 ?? ""} onChange={(e) => update("line2", e.target.value)}
          className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground outline-none py-2.5 font-serif text-lg placeholder:text-muted-foreground/60" />
      </label>
      <div className="grid md:grid-cols-3 gap-6">
        <label className="block">
          <span className="eyebrow block mb-2">City</span>
          <input required value={form.city} onChange={(e) => update("city", e.target.value)}
            className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground outline-none py-2.5 font-serif text-lg placeholder:text-muted-foreground/60" />
        </label>
        <label className="block">
          <span className="eyebrow block mb-2">State</span>
          <input value={form.state ?? ""} onChange={(e) => update("state", e.target.value)}
            className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground outline-none py-2.5 font-serif text-lg placeholder:text-muted-foreground/60" />
        </label>
        <label className="block">
          <span className="eyebrow block mb-2">PIN code</span>
          <input required value={form.postal_code} onChange={(e) => update("postal_code", e.target.value)}
            className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground outline-none py-2.5 font-serif text-lg placeholder:text-muted-foreground/60" />
        </label>
      </div>
      <label className="flex items-center gap-3 cursor-pointer mt-2">
        <input type="checkbox" checked={form.is_default} onChange={(e) => update("is_default", e.target.checked)}
          className="w-4 h-4 accent-ink" />
        <span className="text-sm">Set as default address</span>
      </label>
      <div className="flex items-center gap-4 pt-2">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving…" : initial ? "Update address" : "Save address"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        )}
      </div>
    </form>
  );
}
