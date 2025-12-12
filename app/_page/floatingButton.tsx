"use client";

import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import OtakuModal from "./otakuModal";
import Image from "next/image";
import OtakuLogo from "@/public/static/images/events/otakulogo.png";
import ToonsLogo from "@/public/static/images/events/tooncentral.png";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import {
  getSessionTrackingData,
  getActiveSession,
} from "@/lib/utils/sessionTracker";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import copy from "copy-to-clipboard";
import OtakuButton from "@/public/static/images/events/otakuload.png";

export default function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const { user } = useSelector(selectAuthState);
  const userId = user?.id || user?.userId || undefined;

  const [minutesRemaining, setMinutesRemaining] = useState(60);
  const [progress, setProgress] = useState(0);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const TOTAL_MINUTES = 60;
  const TOTAL_MS = TOTAL_MINUTES * 60 * 1000; // 60 minutes in milliseconds

  const isProgressCompleted = progress >= 100;

  // Calculate session duration and update timer/progress
  useEffect(() => {
    if (!isOpen) return;

    const updateTimerAndProgress = () => {
      // Get total session duration
      const trackingData = getSessionTrackingData(userId);
      const activeSession = getActiveSession(userId);

      // Calculate current total duration
      let totalDuration = trackingData.totalDuration;

      // Add current active session duration if exists
      if (activeSession) {
        const currentTime = Date.now();
        // Calculate how long the active session has been running
        const activeSessionElapsed = currentTime - activeSession.startTime;
        // The totalDuration already includes activeSession.duration, so we need to replace it
        // with the current elapsed time
        totalDuration =
          totalDuration - activeSession.duration + activeSessionElapsed;
      }

      // Calculate progress percentage (max 100% at 60 minutes)
      const progressPercent = Math.min((totalDuration / TOTAL_MS) * 100, 100);
      setProgress(progressPercent);

      // Calculate remaining minutes
      const elapsedMinutes = totalDuration / (60 * 1000);
      const remaining = Math.max(0, Math.ceil(TOTAL_MINUTES - elapsedMinutes));
      setMinutesRemaining(remaining);
    };

    // Update immediately
    updateTimerAndProgress();

    // Update every second
    const interval = setInterval(updateTimerAndProgress, 1000);

    return () => clearInterval(interval);
  }, [isOpen, userId]);

  // Generate coupon mutation
  const generateCoupon = useMutation({
    mutationKey: ["generate-coupon"],
    mutationFn: async () => {
      const response = await fetch("/api/coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate coupon");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      // Extract coupon code from response
      // The response structure may vary, adjust based on actual API response
      const coupon =
        data.coupon?.coupon ||
        data.coupon?.code ||
        data.coupon ||
        data.data?.coupon;
      if (coupon) {
        setCouponCode(coupon);
        toast("Coupon generated successfully!", {
          toastId: "coupon-success",
          type: "success",
        });
      } else {
        toast("Coupon generated but format is unexpected", {
          toastId: "coupon-warning",
          type: "warning",
        });
      }
    },
    onError: (error: any) => {
      toast(error.message || "Failed to generate coupon. Please try again.", {
        toastId: "coupon-error",
        type: "error",
      });
    },
  });

  const handleClaimCoupon = () => {
    if (isProgressCompleted && !couponCode) {
      generateCoupon.mutate();
    }
  };

  const handleCopyCoupon = () => {
    if (couponCode) {
      const copied = copy(couponCode);
      if (copied) {
        toast("Coupon code copied to clipboard!", {
          toastId: "copy-success",
          type: "success",
        });
      } else {
        toast("Failed to copy coupon code", {
          toastId: "copy-error",
          type: "error",
        });
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50"
        onClick={onOpen}
        aria-label="Open Otaku Modal"
      >
       <Image src={OtakuButton} alt="Otaku Button" width={100} height={100} className="w-24 h-24 animate-pulse hover:scale-110 transition-all duration-300" style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))", objectFit: "contain", objectPosition: "center" }} />
      </motion.div>

      <OtakuModal isOpen={isOpen} onClose={onClose} maxWidth="50rem">
        <div className="w-full mx-auto p-4 md:p-8 text-white">
          {/* Header with Logos */}
          <div className="flex justify-between items-center mb-6 md:mb-8 relative px-4">
            {/* TOON CENTRAL Logo - Left */}
            <div className="flex flex-col items-start z-10">
              <Image
                src={ToonsLogo}
                alt="Toons Logo"
                width={200}
                height={200}
                className="w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 object-contain"
              />
            </div>

            {/* Stylized X Separator - Center */}
            <div className="flex flex-col items-center absolute left-1/2 transform -translate-x-1/2 z-20">
              <span
                className="text-6xl md:text-8xl lg:text-9xl font-bold text-[#4A9EFF] leading-none"
                style={{
                  textShadow:
                    "0 0 15px rgba(74, 158, 255, 0.7), 0 0 30px rgba(74, 158, 255, 0.4)",
                  filter: "drop-shadow(0 0 10px rgba(74, 158, 255, 0.8))",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                ✕
              </span>
              <span
                className="text-3xl md:text-4xl mt-2"
                style={{
                  filter: "drop-shadow(0 0 5px rgba(255, 165, 0, 0.8))",
                }}
              >
                🔥
              </span>
            </div>

            {/* OTAKU CONNECT MATSURI Logo - Right */}
            <div className="flex flex-col items-end z-10">
              <Image
                src={OtakuLogo}
                alt="Otaku Connect Matsuri Logo"
                width={200}
                height={200}
                className="w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 object-contain"
                style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))" }}
              />
            </div>
          </div>

          {/* Main Heading */}
          <h2
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-white uppercase mb-4 md:mb-6 text-center tracking-wider"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.1)",
              fontFamily: "var(--font-satoshi-bold, sans-serif)",
            }}
          >
            READ MORE, SAVE MORE!
          </h2>

          {/* Description Text */}
          <p className="text-base md:text-lg text-white mb-6 md:mb-8 text-center leading-relaxed">
            Otaku Connect is giving Toon Central top readers an exclusive{" "}
            <span className="text-[#05834B] font-bold text-xl md:text-2xl">
              10% OFF
            </span>{" "}
            their Lagos & Abuja event tickets! Keep reading, climb the leader
            board, and unlock your discount code!
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full h-5 md:h-7 bg-[#475467] rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#05834B] via-[#06A855] to-[#4A9EFF] transition-all duration-500 ease-out rounded-full shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Time Remaining */}
          <p className="text-sm md:text-base text-white text-center mb-6 md:mb-8">
            {minutesRemaining} {minutesRemaining === 1 ? "minute" : "minutes"}{" "}
            remaining
          </p>

          {/* Coupon Display or Action Buttons */}
          {couponCode ? (
            <div className="flex flex-col gap-4 items-center">
              <div className="bg-[#05834B]/20 border-2 border-[#05834B] rounded-lg p-6 w-full max-w-md">
                <p className="text-white text-sm md:text-base mb-2 text-center">
                  Your Discount Code:
                </p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-2xl md:text-3xl font-bold text-[#05834B] bg-white/10 px-4 py-2 rounded">
                    {couponCode}
                  </code>
                  <button
                    onClick={handleCopyCoupon}
                    className="bg-[#05834B] text-white px-4 py-2 rounded-lg hover:bg-[#047a42] transition-colors text-sm font-semibold"
                    aria-label="Copy coupon code"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-[#475467] text-white font-bold text-base md:text-lg px-10 py-7 rounded-lg hover:bg-[#3a4554] transition-all duration-200 shadow-lg hover:shadow-xl min-w-[180px] cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                disabled={!isProgressCompleted || generateCoupon.isPending}
                onClick={handleClaimCoupon}
                className="bg-[#05834B] text-white font-bold text-base md:text-lg px-10 py-7 rounded-lg hover:bg-[#047a42] transition-all duration-200 shadow-lg hover:shadow-xl min-w-[180px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generateCoupon.isPending ? "Generating..." : "Claim Coupon"}
              </button>
              <button
                onClick={onClose}
                className="bg-[#475467] text-white font-bold text-base md:text-lg px-10 py-7 rounded-lg hover:bg-[#3a4554] transition-all duration-200 shadow-lg hover:shadow-xl min-w-[180px] cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </OtakuModal>
    </>
  );
}
