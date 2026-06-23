import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { config } from "@/config";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Redirecting — Stacked Stone" }] }),
  component: CallbackPage,
});

function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate({ to: config.auth.redirectAfterLogin });
      } else {
        navigate({ to: "/login" });
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground italic">Completing sign in…</p>
      </div>
    </div>
  );
}
