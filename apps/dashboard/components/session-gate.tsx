"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import type { AuthSession } from "@vexus/shared";

import { apiRequest, ApiClientError } from "../lib/api";
import { queryKeys } from "../lib/query-keys";
import { useSessionStore } from "../lib/session-store";

export function SessionGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const session = useSessionStore((state) => state.session);
  const setSession = useSessionStore((state) => state.setSession);

  const query = useQuery({
    queryFn: () => apiRequest<AuthSession>("/auth/me"),
    queryKey: queryKeys.authSession,
    retry: false
  });

  useEffect(() => {
    if (query.data) {
      setSession(query.data);
    }
  }, [query.data, setSession]);

  useEffect(() => {
    if (query.error instanceof ApiClientError && query.error.status === 401) {
      setSession(null);
      router.replace("/login");
    }
  }, [query.error, router, setSession]);

  if (query.isLoading && !session) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-8 py-6 text-sm text-slate-300 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl">
          Validating operator session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
