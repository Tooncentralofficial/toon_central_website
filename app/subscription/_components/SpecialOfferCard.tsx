"use client";
import { Button } from "@nextui-org/react";
import { CheckIcon } from "@nextui-org/shared-icons";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { postRequestProtected } from "@/app/utils/queries/requests";
import { useSelector } from "react-redux";
import {
  selectAuthState,
  selectHasSubscription,
  selectSubscriptionName,
} from "@/lib/slices/auth-slice";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import CancelSubscriptionButton from "./CancelSubscriptionButton";

export type SpecialOffer = {
  id: number | string;
  name: string;
  amount: number;
  period: string;
  subtitle: string;
  ctaLabel: string;
  infoText: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  isRecurring?: boolean;

};

export default function SpecialOfferCard({
  offer,
  onSelect,
  isCancelled
}: {
  offer: SpecialOffer;
  isCancelled:boolean
  onSelect?: (offer: SpecialOffer) => void;
}) {
  const { token } = useSelector(selectAuthState);
  const hasSubscription = useSelector(selectHasSubscription);
  const subscriptionName = useSelector(selectSubscriptionName);
  const isActive =
    hasSubscription &&
    !!subscriptionName &&
    subscriptionName.trim().toLowerCase() ===
      String(offer?.name ?? "").trim().toLowerCase();
  const pathname = usePathname();
  // Same purchase flow as SubPlan: recurring plans hit the subscribe endpoint,
  // one-off passes go through checkout; both redirect to the Paystack URL.
  const url = offer.isRecurring
    ? "recurring-subscription/subscribe"
    : "checkout/subscription/proceed";
  const { mutate, isPending } = useMutation({
    mutationKey: ["subscribe-special"],
    mutationFn: (data: { subscriptionPlanId: number }) =>
      postRequestProtected(data, url, token || "", pathname, "json"),
    onSuccess: (data) => {
      
      const checkoutUrl =
        data?.data?.check_out_url ||
        data?.data?.checkout_url ||
        data?.data?.authorization_url ||
        data?.data?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast(data?.message || "Could not start checkout. Please try again.", {
          toastId: "special-offer-subscribe",
          type: "error",
        });
      }
    },
    onError: (error) => {
      console.log("@@special-offer subscribe error", error);
      toast("Something went wrong. Please try again.", {
        toastId: "special-offer-subscribe",
        type: "error",
      });
    },
  });

  const handleSubscribe = () => {
    if (!token) {
      toast("Please log in to subscribe.", {
        toastId: "special-offer-subscribe",
        type: "info",
      });
      return;
    }
    onSelect?.(offer);
    mutate({ subscriptionPlanId: Number(offer.id) });
  };

  const isHighlighted = !!offer.highlighted;
  const accent = isHighlighted ? "#F2BB30" : "#3B4554";
  const accentSoft = isHighlighted ? "#F2BB30" : "#6d7889";
  const amountColor = isHighlighted ? "text-[#F2BB30]" : "text-[#FCFCFD]";
  const subtitleColor = isHighlighted ? "text-[#7f8ca0]" : "text-[#7f8ca0]";

  return (
    <div
      className={`relative border-[1.5px] w-full px-4 pt-6 pb-6 rounded-[14px] transition-colors duration-300 ease-in-out ${
        isHighlighted ? "bg-[#1A1505]" : "bg-[#0F1622]"
      }`}
      style={{ borderColor: accent }}
    >
      {offer.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="px-4 py-1 rounded-full text-[11px] font-bold tracking-wide text-[#1A1505]"
            style={{ backgroundColor: accent }}
          >
            {offer.badge}
          </span>
        </div>
      )}

      <div
        className="border-[1.5px] rounded-[10px] p-5 transition-colors duration-300 ease-in-out"
        style={{ borderColor: accent }}
      >
        <p className="text-[1.3rem] font-bold text-[#FCFCFD]">{offer.name}</p>
        <div className="flex items-end mt-4">
          <span className="text-lg font-semibold line-through text-[#7f8ca0] mr-1">
            ₦
          </span>
          <aside className="flex items-end gap-1 min-w-0">
            <span
              className={`text-3xl sm:text-4xl font-bold leading-none ${amountColor}`}
            >
              {Number(offer.amount).toLocaleString()}
            </span>
            <aside className="text-xs leading-tight ml-1 text-[#7f8ca0]">
              NGN/
              <br />
              <span>{offer.period}</span>
            </aside>
          </aside>
        </div>
      </div>

      <p className={`text-sm mt-5 text-center ${subtitleColor}`}>
        {offer.subtitle}
      </p>

      {isActive ? (
        <CancelSubscriptionButton
          planName={offer.name}
          isCancelled={isCancelled}
          className="w-full mt-5 rounded-xl h-[44px] font-semibold bg-[#E11D48] text-[#FCFCFD]"
        />
      ) : (
        <Button
          className={`w-full mt-5 rounded-xl h-[44px] font-semibold transition-colors duration-300 ease-in-out ${
            isHighlighted
              ? "bg-[#F2BB30] text-[#1A1505]"
              : "bg-transparent border-[  1.5px] text-[#F2BB30]"
          }`}
          onPress={handleSubscribe}
          isLoading={isPending}
          style={isHighlighted ? undefined : { borderColor: "#F2BB30" }}
        >
          {offer.ctaLabel}
        </Button>
      )}

      <div
        className="mt-5 px-4 py-3 rounded-[10px] border-[1.5px]"
        style={{ borderColor: accentSoft }}
      >
        <p
          className="text-xs text-center leading-relaxed"
          style={{ color: isHighlighted ? "#F2BB30" : "#7f8ca0" }}
        >
          {offer.infoText}
        </p>
      </div>

      <div className="pl-2 flex flex-col gap-4 mt-6">
        {offer.features.map((item, i) => (
          <span key={i} className="text-[0.87rem] flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0"
              style={{ borderColor: accent }}
            >
              <CheckIcon
                className="w-3 h-3"
                style={{ color: accent }}
              />
            </span>
            <p className="text-[#cdd6e2]">{item}</p>
          </span>
        ))}
      </div>
    </div>
  );
}
