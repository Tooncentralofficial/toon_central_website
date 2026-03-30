"use client";

import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ItelPopup from "@/public/static/images/events/itel/tooncent_itel_popup.png";

interface OtakuModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export default function OtakuModal({
  isOpen,
  onClose,
  children,
  maxWidth = "34rem",
}: OtakuModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Prevent backdrop click from closing if clicking inside modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#000000]/55 backdrop-blur-sm z-[9998]"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-[95vw] sm:max-w-[90vw] pointer-events-auto my-auto"
              style={{ maxWidth: `min(${maxWidth}, 95vw)`, height: "auto" }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Modal Content with Background */}
              <div
                className="relative min-h-[60vh] sm:min-h-[64vh] md:min-h-[min(74vh,820px)] lg:min-h-[min(78vh,900px)] xl:min-h-[min(80vh,980px)] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl  flex flex-col bg-no-repeat bg-top bg-contain lg:bg-cover"
                style={{
                  backgroundImage: `url(${ItelPopup.src})`,
                }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#000000]/10 via-[#000000]/15 to-[#000000]/25" />

                {/* Modal Content */}
                <div className="relative z-10 flex flex-1 flex-col">
                  {children}
                </div>
              </div>

              {/* Bottom-centered Close Button */}
              <button
                onClick={onClose}
                className="absolute left-1/2 -translate-x-1/2 -bottom-10 z-50 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 backdrop-blur-sm border border-white/35 shadow-md "
                aria-label="Close modal"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
