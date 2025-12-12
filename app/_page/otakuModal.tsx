"use client";

import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import OtakuBanner from "@/public/static/images/events/otakubanner.jpg";

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
  maxWidth = "50rem",
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
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
              style={{ maxWidth: `min(${maxWidth}, 95vw)` }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Modal Content with Background */}
              <div
                className="relative rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  backgroundImage: `url(${OtakuBanner.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#000000]/10 to-[#000000]/90"></div>
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors duration-200 backdrop-blur-sm"
                  aria-label="Close modal"
                >
                  <span className="text-lg sm:text-xl font-bold">✕</span>
                </button>

                {/* Modal Content */}
                <div className="relative">{children}</div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
