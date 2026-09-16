"use client";

import React from "react";
import { useUI } from "@/context/UIContext";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Toast: React.FC = () => {
  const { toast, hideToast } = useUI();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-6 right-6 z-50 max-w-sm pointer-events-auto"
        >
          <div className="bg-[#1C1713] text-[#F9F6F0] px-5 py-4 rounded-none shadow-2xl border border-[#C5A880]/30 flex items-center gap-3 backdrop-blur-md">
            <div className="w-6 h-6 rounded-full bg-[#C5A880]/20 flex items-center justify-center shrink-0 border border-[#C5A880]/40 text-[#C5A880]">
              <Check className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs tracking-wide font-sans-clean font-medium leading-relaxed flex-1">
              {toast.message}
            </p>
            <button
              onClick={hideToast}
              aria-label="Close notification"
              className="text-[#C5B9AC] hover:text-[#FFFFFF] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
