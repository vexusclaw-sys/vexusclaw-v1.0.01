"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ChatGptOAuthCallbackPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") === "success" ? "success" : "error";
  const message =
    searchParams.get("message") ??
    (status === "success" ? "Conexao concluida com sucesso." : "A conexao nao foi concluida.");
  const attemptId = searchParams.get("attemptId");
  const providerConnectionId = searchParams.get("providerConnectionId");
  const returnTo = searchParams.get("returnTo") ?? "/settings";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(
        {
          attemptId,
          message,
          providerConnectionId,
          status,
          type: "vexusclaw:chatgpt-oauth"
        },
        window.location.origin
      );

      const timer = window.setTimeout(() => {
        window.close();
      }, 800);

      return () => window.clearTimeout(timer);
    }
  }, [attemptId, message, providerConnectionId, status]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-slate-950/40">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">VEXUSCLAW OAuth callback</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">
          {status === "success" ? "Conexao concluida" : "Conexao nao concluida"}
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">{message}</p>
        {attemptId ? (
          <p className="mt-4 break-all text-xs text-slate-500">Attempt ID: {attemptId}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            className="rounded-full bg-mission-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-mission-300"
            href={returnTo}
          >
            Voltar para o painel
          </a>
          <button
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-mission-300/30 hover:bg-white/[0.04]"
            onClick={() => window.close()}
            type="button"
          >
            Fechar janela
          </button>
        </div>
      </div>
    </main>
  );
}
