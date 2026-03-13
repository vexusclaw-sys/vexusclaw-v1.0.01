"use client";

import { useState } from "react";
import { toast } from "sonner";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

async function copyText(value: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard API unavailable.");
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function CopyButton({
  value,
  label = "Copiar URL",
  className = "rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-mission-300/30 hover:bg-white/[0.04]"
}: CopyButtonProps) {
  const [isCopying, setIsCopying] = useState(false);

  return (
    <button
      className={className}
      disabled={isCopying}
      onClick={async () => {
        try {
          setIsCopying(true);
          await copyText(value);
          toast.success("URL copiada para a area de transferencia.");
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Nao foi possivel copiar a URL.");
        } finally {
          setIsCopying(false);
        }
      }}
      type="button"
    >
      {isCopying ? "Copiando..." : label}
    </button>
  );
}
