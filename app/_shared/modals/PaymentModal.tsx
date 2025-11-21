"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { toast } from "react-toastify";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string | null;
  planType: string;
  amount: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  reference,
  planType,
  amount,
}: PaymentModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyReference = () => {
    if (reference) {
      navigator.clipboard.writeText(reference);
      setCopied(true);
      toast.success("Reference copied to clipboard!", { toastId: "copy-ref" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" backdrop="blur">
      <ModalContent className="bg-[#1e1e1e]">
        <ModalBody className="py-8 flex flex-col items-center gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#05834B]/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#05834B]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#FCFCFD] mb-2">
              Payment Successful!
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Your subscription to{" "}
              <span className="font-semibold text-[#05834B]">{planType}</span>{" "}
              plan is being processed.
            </p>
          </div>

          <div className="w-full bg-[#0f1724] rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Amount Paid:</span>
              <span className="text-[#FCFCFD] font-semibold">
                ${amount.toFixed(2)} USD
              </span>
            </div>
            <div className="border-t border-slate-700 pt-3">
              <span className="text-slate-400 text-sm block mb-2">
                Payment Reference:
              </span>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-[#1e1e1e] rounded px-3 py-2 text-[#05834B] text-xs font-mono break-all">
                  {reference}
                </code>
                <button
                  onClick={handleCopyReference}
                  className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                    copied
                      ? "bg-[#05834B] text-[#FCFCFD]"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 max-w-xs">
            Your payment reference has been saved. You can use it to track your
            transaction.
          </p>
        </ModalBody>
        <ModalFooter className="justify-center pt-0">
          <Button
            onPress={onClose}
            className="bg-[#05834B] text-[#FCFCFD] font-semibold rounded-lg px-8"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
