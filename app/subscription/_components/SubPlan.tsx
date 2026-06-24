"use client";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { CheckIcon } from "@nextui-org/shared-icons";
import { SubPlansType } from "@/app/utils/constants/typess";

import PaymentModal from "@/app/_shared/modals/PaymentModal";
import { SubPlans } from "@/app/utils/constants/constants";
import { useMutation } from "@tanstack/react-query";
import { postRequestProtected } from "@/app/utils/queries/requests";
import { useSelector } from "react-redux";
import {
  selectAuthState,
  selectHasSubscription,
  selectSubscriptionName,
} from "@/lib/slices/auth-slice";
import { usePathname } from "next/navigation";
import CancelSubscriptionButton from "./CancelSubscriptionButton";

export default function SubPlan({
  id,
  plan,
  setSelectedPlanIndex,
  index,
  selectedPlanIndex,
  activeIndex,
}: {
  id:number;
  plan: any;
  setSelectedPlanIndex: (index: number) => void;
  index: number;
  selectedPlanIndex: number;
  activeIndex: number;
}) {
  const { token } = useSelector(selectAuthState);
  const hasSubscription = useSelector(selectHasSubscription);
  const subscriptionName = useSelector(selectSubscriptionName);
  console.log(subscriptionName, plan?.name)
  const isActive =
    hasSubscription &&
    !!subscriptionName &&
    subscriptionName.trim().toLowerCase() ===
      String(plan?.name ?? "").trim().toLowerCase();
  const pathname = usePathname();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  const isRecurring = plan?.isRecurring || false
  const url = isRecurring ?"recurring-subscription/subscribe": "checkout/subscription/proceed" 
  const handlePaymentSuccess = (reference: string) => {
    setPaymentReference(reference);
    setIsPaymentModalOpen(true);
  };
 
  const {mutate,  } = useMutation({
    mutationKey: ["subscribe"],
    mutationFn: (data: { subscriptionPlanId: number }) => {
      const res = postRequestProtected(
        data,
        "recurring-subscription/subscribe" ,
        token || "" ,
        pathname ,
        "json"
      );
      return res;
    },
    onSuccess: (data) => {
      console.log("@@data", data);
      const paystackUrl  = data.data.check_out_url;
      if(paystackUrl) {
        window.location.href = paystackUrl;
      }
    },
    onError: (error) => {
      console.log("@@error", error);
    },
  });
 const features = SubPlans.find((p) => p.type === plan.name)?.content;
  return (
    <div
      className={`border w-full px-4 pt-4 pb-8 rounded-[10px] cursor-pointer transition-colors duration-300 ease-in-out ${
        index === selectedPlanIndex
          ? "border-[#05834B] bg-[#05834B]/10"
          : "border-transparent"
      } `}
      onClick={() => setSelectedPlanIndex(index)}
    >
      <div
        className={`border-[3px] border-separate rounded-[10px] p-5 transition-colors duration-300 ease-in-out ${
          index === selectedPlanIndex
            ? "border-[#05834B]"
            : "border-transparent"
        } `}
      >
        <p className="text-[1.3rem]">{plan?.name}</p>
        <div className="flex min-w-0 overflow-hidden">
          <span className="text-xl font-semibold flex-shrink-0">₦</span>
          <aside className="flex items-end gap-1 min-w-0">
            <span className="text-2xl sm:text-3xl font-bold leading-none truncate">
              {plan?.amount != null ? Number(plan.amount).toLocaleString() : ""}
            </span>
            <aside className="text-xs leading-tight ml-1 flex-shrink-0">
              NGN/
              <br />
              <span>month</span>
            </aside>
          </aside>
        </div>
      </div>
      <p className="text-xs text-[#667085] mt-2 text-center">
        {plan?.description}
      </p>
      {/* <p className="w-full text-center text-xs mt-2 ">{plan.title}</p> */}

      {isActive ? (
        <CancelSubscriptionButton
          planName={plan?.name}
          className="bg-[#E11D48] text-[#FCFCFD] w-full mt-6 rounded-xl h-[40px] font-semibold"
        />
      ) : (
        <Button
          onPress={() => mutate({ subscriptionPlanId: id })}
          isLoading={false}
          className={` w-full mt-6 rounded-xl h-[40px] transition-colors duration-300 ease-in-out ${
            selectedPlanIndex === index
              ? "bg-[#05834B] text-[#FCFCFD]"
              : "bg-[#FCFCFD] text-[#05834B]"
          }`}
        >
          Subscribe
        </Button>
      )}

      <div className="pl-2 flex flex-col gap-7 mt-8">
        {features &&
          features?.map((item: any, i: number) => (
            <span key={i} className="text-[0.87rem] flex ">
              {" "}
              <CheckIcon className="text-[#05834B]" /> <p>{item}</p>{" "}
            </span>
          ))}
      </div>
    </div>
  );
}
