"use client";

import { useEffect, useState } from "react";
import { useToast, type Toast } from "@/context/toast-context";

const VARIANTS: Record<
  string,
  { bg: string; icon: string; border: string }
> = {
  success: {
    bg: "bg-green-50 text-green-800",
    icon: "✓",
    border: "border-green-200",
  },
  error: {
    bg: "bg-red-50 text-red-800",
    icon: "✕",
    border: "border-red-200",
  },
  warning: {
    bg: "bg-yellow-50 text-yellow-800",
    icon: "!",
    border: "border-yellow-200",
  },
  info: {
    bg: "bg-blue-50 text-blue-800",
    icon: "i",
    border: "border-blue-200",
  },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const variant = VARIANTS[toast.variant] ?? VARIANTS.info;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  return (
    <div
      role="alert"
      className={`
        flex items-center gap-2 px-4 py-3 rounded-lg border shadow-md
        transition-all duration-300 ease-in-out
        ${variant.bg} ${variant.border}
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <span
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold shrink-0"
        style={{ backgroundColor: "currentColor", color: variant.bg.match(/bg-(\w+)-50/)?.[0] ?? "white" }}
      >
        <span className="text-[10px] text-white">{variant.icon}</span>
      </span>
      <span className="text-sm flex-1">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="text-current opacity-60 hover:opacity-100 text-sm leading-none"
        aria-label="Tutup"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-9999 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
}
