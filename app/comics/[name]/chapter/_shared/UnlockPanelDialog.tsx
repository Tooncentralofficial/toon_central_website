"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditIcon } from "@/app/_shared/icons/icons";
import { Button } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRequestProtected } from "@/app/utils/queries/requests";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/app/utils/imageUtils";

interface UnlockOption {
  id: number;
  name: string;
  tag: string;
  amount: number;
  is_exempted: number;
}

interface UnlockPanelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  options: UnlockOption[];
  selectedOption: number;
  onOptionSelect: (index: number) => void;
  episodeId?: string;
  panelId?: number | null;
  uid: string;
  onUnlockSuccess?: () => void;
  previewImage?: string;
}

export default function UnlockPanelDialog({
  isOpen,
  onClose,
  options,
  selectedOption,
  onOptionSelect,
  episodeId,
  panelId,
  uid,
  onUnlockSuccess,
  previewImage,
}: UnlockPanelDialogProps) {
  const { token } = useSelector(selectAuthState);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
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

  const { mutate: unlockPanel, isPending: isUnlocking } = useMutation({
    mutationKey: ["unlock-panel", panelId || episodeId],
    mutationFn: (data: { unlockTaskId: number; panelId: number }) => {
      return postRequestProtected(
        data,
        `/unlock-task/proceed`,
        token || "",
        pathname,
        "json"
      );
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast(data?.message || "Panel unlocked successfully!", {
          toastId: "unlock-panel-success",
          type: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["credits"] });
        onClose();
        if (onUnlockSuccess) {
          onUnlockSuccess();
        }
      } else {
        toast(data?.message || "Failed to unlock panel", {
          toastId: "unlock-panel-error",
          type: "error",
        });
      }
    },
    onError: (error: any) => {
      toast(
        error?.response?.data?.message ||
          "An error occurred. Please try again.",
        {
          toastId: "unlock-panel-error",
          type: "error",
        }
      );
    },
  });

  const handleUnlock = () => {
    if (options[selectedOption] && panelId) {
      const selected = options[selectedOption];
      unlockPanel({
        unlockTaskId: selected.id,
        panelId: panelId,
      });
    }
  };

  const formatAmount = (option: UnlockOption) => {
    if (option.tag === "PAY_WITH_AIRTIME") {
      return `N${option.amount}`;
    } else {
      return `${option.amount} Pts`;
    }
  };

  const getSubtitle = (option: UnlockOption) => {
    if (option.tag === "UNLOCK_FULL_CHAPTER") {
      return "Full access";
    }
    return "1 day access";
  };

  const getIcon = (tag: string) => {
    switch (tag) {
      case "PAY_WITH_AIRTIME":
        return (
          <div className="w-12 h-12 bg-[#1d2a3c] rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        );
      case "UNLOCK_WITH_POINT":
        return (
          <div className="w-12 h-12 bg-[#1d2a3c] rounded-lg flex items-center justify-center">
            <CreditIcon className="w-6 h-6 text-white" />
          </div>
        );
      case "UNLOCK_FULL_CHAPTER":
        return (
          <div className="w-12 h-12 bg-[#1d2a3c] rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        );
      default:
        return null;
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
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-lg pointer-events-auto my-auto bg-[#1d2a3c] rounded-xl shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors duration-200"
                aria-label="Close modal"
              >
                <span className="text-xl font-bold">✕</span>
              </button>

              {/* Modal Content */}
              <div className="p-6">
                {/* Title */}
                <h2
                  id="modal-title"
                  className="text-2xl font-bold text-white mb-2 pr-8"
                >
                  Unlock Panel to Read
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-6">
                  This panel is currently locked. Unlock it to view and read the
                  content.
                </p>

                {/* Preview Image */}
                <div className="w-full h-48 bg-[#0f1724] rounded-lg mb-6 overflow-hidden flex items-center justify-center">
                  {previewImage ? (
                    <Image
                      src={optimizeCloudinaryUrl(previewImage)}
                      alt="Panel preview"
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 text-sm">Preview Image</div>
                  )}
                </div>

                {/* Unlock Options */}
                <div className="space-y-3 mb-6">
                  {options.map((option, index) => (
                    <div
                      key={option.id}
                      onClick={() => onOptionSelect(index)}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedOption === index
                          ? "border-[#05834B] bg-[#05834B]/10"
                          : "border-[#1d2a3c] bg-[#0f1724] hover:border-[#05834B]/50"
                      }`}
                    >
                      {/* Icon */}
                      {getIcon(option.tag)}

                      {/* Option Details */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-white font-semibold">
                            {option.name}
                          </h3>
                          <span className="text-white font-bold">
                            {formatAmount(option)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {getSubtitle(option)}
                        </p>
                      </div>

                      {/* Radio Button */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedOption === index
                              ? "border-[#05834B] bg-[#05834B]"
                              : "border-gray-400"
                          }`}
                        >
                          {selectedOption === index && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onPress={handleUnlock}
                    isLoading={isUnlocking}
                    isDisabled={!panelId || options.length === 0}
                    className="flex-1 bg-[#05834B] text-white font-semibold rounded-lg"
                  >
                    Unlock Panel
                  </Button>
                  <Button
                    onPress={onClose}
                    className="flex-1 bg-transparent border-2 border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
