"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle } from "lucide-react";

let toastFn: ((msg: string, type: "success" | "error" | "loading") => void) | null = null;

export function showCustomToast(message: string, type: "success" | "error" | "loading" = "success") {
  if (toastFn) toastFn(message, type);
}

export function ToasterWrapper() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    toastFn = (message, type) => {
      setToast({ message, type });
      setVisible(true);
      setTimeout(() => setVisible(false), 3500);
    };
    return () => {
      toastFn = null;
    };
  }, []);

  if (!toast || !visible) return null;

  const bgColor = toast.type === "success"
    ? "bg-green-100 border-green-400 text-green-800"
    : toast.type === "error"
    ? "bg-red-100 border-red-400 text-red-800"
    : "bg-indigo-100 border-indigo-400 text-indigo-800";

  const icon = toast.type === "success" ? (
    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
  ): (
    <XCircle className="w-5 h-5 mr-2 text-red-500" />
  );

  return createPortal(
    <div className="fixed top-5 right-5 z-50">
      <div className={`flex items-center border px-4 py-3 rounded-lg shadow-md ${bgColor} transition-all duration-300`}>
        {icon}
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>,
    document.body
  );
}