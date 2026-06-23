import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import { config } from "@/config";

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({ meta: [{ title: "Create account — Stacked Stone" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await AuthService.signUp(email, password, name);
      navigate({ to: redirect ?? config.auth.redirectAfterLogin });
    } catch (err: any) {
      setError(err.message ?? "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 py-32">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-serif text-[1.35rem] tracking-tight text-center block mb-16">
          Stacked<span className="italic"> Stone</span>
        </Link>

        <h1 className="font-serif text-4xl text-center">Create account</h1>
        <p className="text-center text-muted-foreground mt-3 text-sm">To begin your first volume.</p>

        <form onSubmit={handleSignup} className="mt-12 space-y-6">
          <div>
            <label className="eyebrow">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-border focus:border-foreground outline-none font-serif text-xl py-3 transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="eyebrow">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full bg-transparent border-b border-border focus:border-foreground outline-none font-serif text-xl py-3 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="eyebrow">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-2 w-full bg-transparent border-b border-border focus:border-foreground outline-none font-serif text-xl py-3 transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4 hover:no-underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
