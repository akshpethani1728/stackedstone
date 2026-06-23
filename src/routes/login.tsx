import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import { config } from "@/config";
import { getSupabaseClient } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Stacked Stone" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await AuthService.signInWithEmail(email, password);
      navigate({ to: config.auth.redirectAfterLogin });
    } catch (err: any) {
      setError(err.message ?? "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    } catch (err: any) {
      setError(err.message ?? "Failed to sign in with Google");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 py-32">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-serif text-[1.35rem] tracking-tight text-center block mb-16">
          Stacked<span className="italic"> Stone</span>
        </Link>

        <h1 className="font-serif text-4xl text-center">Sign in</h1>
        <p className="text-center text-muted-foreground mt-3 text-sm">To your library.</p>

        <form onSubmit={handleEmailLogin} className="mt-12 space-y-6">
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
              className="mt-2 w-full bg-transparent border-b border-border focus:border-foreground outline-none font-serif text-xl py-3 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button onClick={handleGoogleLogin} disabled={loading} className="btn-ghost w-full">
            Continue with Google
          </button>
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link to="/signup" className="text-foreground underline underline-offset-4 hover:no-underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
