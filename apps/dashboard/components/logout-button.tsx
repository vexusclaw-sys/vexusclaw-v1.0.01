"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiPost } from "../lib/api";
import { queryKeys } from "../lib/query-keys";
import { useSessionStore } from "../lib/session-store";

export function LogoutButton() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setSession = useSessionStore((state) => state.setSession);

  const logoutMutation = useMutation({
    mutationFn: () => apiPost<{ success: boolean }>("/auth/logout"),
    onSuccess: async () => {
      setSession(null);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.authSession
      });
      router.replace("/login");
    }
  });

  return (
    <button
      className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-200 transition hover:border-mission-300/40 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
      disabled={logoutMutation.isPending}
      onClick={() => logoutMutation.mutate()}
      type="button"
    >
      {logoutMutation.isPending ? "Encerrando..." : "Logout"}
    </button>
  );
}
