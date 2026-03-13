"use client";

import { create } from "zustand";

import type { AuthSession } from "@vexus/shared";

interface SessionStoreState {
  session: AuthSession | null;
  setSession(session: AuthSession | null): void;
}

export const useSessionStore = create<SessionStoreState>((set) => ({
  session: null,
  setSession: (session) => set({ session })
}));
