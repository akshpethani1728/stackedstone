import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AuthService } from "@/services/auth.service";
import type { User } from "@supabase/supabase-js";

export function AuthGuard({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const [user, setUser] = useState<User | null | "loading">("loading");
  const navigate = useNavigate();

  useEffect(() => {
    AuthService.getUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (user === null && !fallback) {
      navigate({ to: "/login" });
    }
  }, [user, navigate, fallback]);

  if (user === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground italic">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
