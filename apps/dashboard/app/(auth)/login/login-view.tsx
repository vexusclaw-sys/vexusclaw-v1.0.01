"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { AuthSession } from "@vexus/shared";
import { SurfaceCard } from "@vexus/ui";

import { ApiClientError, apiPost } from "../../../lib/api";
import { queryKeys } from "../../../lib/query-keys";
import { useSessionStore } from "../../../lib/session-store";

export function LoginView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSession = useSessionStore((state) => state.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: () =>
      apiPost<AuthSession>("/auth/login", {
        email,
        password
      }),
    onSuccess: async (session) => {
      setErrorMessage(null);
      setSession(session);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.authSession
      });
      toast.success("Sessao iniciada no Mission Control.");
      router.replace(session.workspace.onboardingStatus === "completed" ? "/overview" : "/setup");
    },
    onError: (error) => {
      const message =
        error instanceof ApiClientError ? error.message : "Nao foi possivel autenticar agora.";
      setErrorMessage(message);
    }
  });

  return (
    <div className="grid min-h-screen grid-cols-1 bg-transparent lg:grid-cols-[1.2fr_0.8fr]">
      <section className="flex flex-col justify-between px-8 py-10 lg:px-14 lg:py-16">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.34em] text-mission-300/80">VEXUSCLAW</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white lg:text-6xl">
            Central de comando WhatsApp-first para operacoes com agentes self-hosted.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-300 lg:text-lg">
            Opere canais, providers, onboarding, memoria e saude da infraestrutura a partir de uma
            unica superficie operacional criada para times que rodam sua propria stack.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["WhatsApp-first", "O ciclo principal do canal comeca com QR, pareamento e controle de reconexao."],
            ["Auth operacional", "Sessao JWT, refresh rotativo e rotas protegidas para o Mission Control."],
            ["Setup persistente", "Retome onboarding, provider e readiness sem perder o contexto da instalacao."]
          ].map(([title, description]) => (
            <SurfaceCard key={title}>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
            </SurfaceCard>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-8 py-10 lg:px-14 lg:py-16">
        <SurfaceCard className="w-full max-w-md">
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              loginMutation.mutate();
            }}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Acesso seguro do operador</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Entrar no Mission Control</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Use a conta owner criada no setup inicial para acessar a operacao da VEXUSCLAW.
              </p>
            </div>

            <div className="space-y-4">
              <input
                autoComplete="email"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-mission-300/50"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Admin email"
                type="email"
                value={email}
              />
              <input
                autoComplete="current-password"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-mission-300/50"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type="password"
                value={password}
              />
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {errorMessage}
              </div>
            ) : null}

            <div className="space-y-3">
              <button
                className="flex w-full items-center justify-center rounded-full bg-mission-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-mission-300 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loginMutation.isPending || !email || !password}
                type="submit"
              >
                {loginMutation.isPending ? "Autenticando..." : "Entrar"}
              </button>
              <Link
                className="flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:border-mission-300/30 hover:bg-white/[0.04]"
                href="/setup"
              >
                Continuar configuracao
              </Link>
            </div>
          </form>
        </SurfaceCard>
      </section>
    </div>
  );
}
