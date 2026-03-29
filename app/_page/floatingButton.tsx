"use client";

import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import OtakuModal from "./otakuModal";
import Image from "next/image";
import OtakuLogo from "@/public/static/images/events/otakulogo.png";
import ToonsLogo from "@/public/static/images/events/tooncentral.png";
import { MouseEvent, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { toast } from "react-toastify";
import ItelLogo from "@/public/static/images/events/itel/Itel_logo.png";
import OtakuButton from "@/public/static/images/events/otakuload.png";

/** Replace with final reward destination URL when ready */
const PROMO_REWARD_LINK =
  "https://www.jumia.com.ng/itel-city-200-7.45mm-12844gb-unibody-metallic-deco-6.78-120hz-ip65-5200mah-android-purple-419283461.html";

export default function FloatingButton() {
  const [isOpen, setIsOpen] = useState(true);
  const { user, token } = useSelector(selectAuthState);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const isLoggedIn = Boolean(token && user);

  const handleClaimReward = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast("loggin to claim rewards", {
        type: "info",
        toastId: "login-claim-reward",
      });
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
        aria-label="Open Itel Modal"
      >
        <Image
          src={ItelLogo}
          alt="Itel Logo"
          width={100}
          height={100}
          className="w-24 h-24 animate-pulse hover:scale-110 transition-all duration-300"
          style={{
            filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </motion.div>

      <OtakuModal isOpen={isOpen} onClose={onClose} maxWidth="50rem">
        <div className="w-full mx-auto p-4 md:p-8 text-white">
          {/* Header with Logos */}
          <div className="flex justify-between items-center mb-6 md:mb-8 relative px-0 sm:px-4">
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
                className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-[#ffffff] leading-none"
                style={{
                  textShadow:
                    "0 0 15px rgba(255, 255, 255, 0.7), 0 0 30px rgba(74, 255, 255, 0.4)",
                  filter: "drop-shadow(0 0 10px rgba(74, 158, 255, 0.8))",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                ✕
              </span>
              <span
                className="text-3xl hidden md:block md:text-4xl mt-2"
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
                src={ItelLogo}
                alt="Itel Logo"
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
            Toon Central and itel are giving readers an exclusive chance to
            earn rewards. Explore more stories, tap the link below, and claim
            your reward today.
          </p>

          <div className="mb-6 md:mb-8 rounded-xl border border-white/20 bg-black/35 p-4 md:p-5 backdrop-blur-sm text-center">
            <p className="text-sm md:text-base text-white/95 mb-3 font-medium">
              Click link to earn reward
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <a
                href={PROMO_REWARD_LINK}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={handleClaimReward}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-[#E31B23] px-6 py-3 md:px-8 md:py-3.5 text-white font-bold text-sm md:text-base hover:bg-[#c5161d] transition-colors duration-200 shadow-lg hover:shadow-xl min-w-[180px]"
              >
                Claim Reward
              </a>
              <button
                onClick={onClose}
                className="w-full sm:w-auto bg-[#475467] text-white font-bold text-sm md:text-base px-6 py-3 md:px-8 md:py-3.5 rounded-lg hover:bg-[#3a4554] transition-all duration-200 shadow-lg hover:shadow-xl min-w-[180px] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </OtakuModal>
    </>
  );
}
