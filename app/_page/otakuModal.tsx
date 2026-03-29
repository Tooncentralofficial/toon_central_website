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
  maxWidth = "40rem",
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
                className="relative min-h-[68vh] sm:min-h-[72vh] md:min-h-[min(86vh,920px)] lg:min-h-[min(90vh,1000px)] xl:min-h-[min(92vh,1080px)] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
                style={{
                  backgroundImage: `url(${ItelPopup.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#000000]/25 via-[#000000]/15 to-[#000000]/55" />

                {/* Close Button */}
                {/* <button
                  onClick={onClose}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors duration-200 backdrop-blur-sm border border-white/30"
                  aria-label="Close modal"
                >
                  <span className="text-lg sm:text-xl font-bold">✕</span>
                </button> */}

                {/* Modal Content */}
                <div className="relative z-10 flex flex-1 flex-col">{children}</div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
