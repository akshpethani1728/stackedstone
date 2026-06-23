import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export interface RouterContext {
  queryClient: QueryClient;
  user?: import("@supabase/supabase-js").User | null;
  session?: import("@supabase/supabase-js").Session | null;
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient } satisfies RouterContext,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
