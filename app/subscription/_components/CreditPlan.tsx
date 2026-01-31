"use client";
import { CreditIcon } from "@/app/_shared/icons/icons";
import { CreditPlansType, SubPlansType } from "@/app/utils/constants/typess";
import { Button, CheckboxIcon } from "@nextui-org/react";
import React, { useState } from "react";
import { usePaystack } from "@/app/utils/hooks/usePaystack";
import PaymentModal from "@/app/_shared/modals/PaymentModal";
import { useMutation } from "@tanstack/react-query";
import { postRequestProtected } from "@/app/utils/queries/requests";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { usePathname } from "next/navigation";

function CreditPlan({
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
  const pathname = usePathname();
 const { mutate } = useMutation({
   mutationKey: ["buy-credits"],
   mutationFn: (data: { creditPointId: number }) => {
     const res = postRequestProtected(
       data,
       `checkout/coin-purchase/proceed`,
       token || "",
       pathname,
       "json"
     );
     return res;
   },
   onSuccess: (data) => {
     const paystackUrl = data.data.check_out_url;
     if (paystackUrl) {
       window.location.href = paystackUrl;
     }
   },
   onError: (error) => {
     console.log("@@error", error);
   },
 });

  
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
        <div className="flex items-center justify-center min-w-0 overflow-hidden">
          <span className="text-xl font-semibold flex-shrink-0">₦</span>
          <p className="flex items-end gap-1 min-w-0">
            <span className="text-2xl sm:text-3xl font-bold leading-none truncate">
              {plan?.amount != null ? Number(plan.amount).toLocaleString() : ""}
            </span>
          </p>
        </div>
      </div>
      <p className="w-full text-center text-xs mt-2 "></p>
      <div className="flex items-center gap-3 mb-8 bg-[#1E293B] rounded-lg p-4 mt-5">
        <CreditIcon className="w-6 h-6 text-[#34D399] flex-shrink-0" />
        <div>
          <p className="text-slate-400 text-xs">Credits</p>
          <p className="text-lg font-semibold text-white">
            {plan?.unit} credits
          </p>
        </div>
      </div>
      {index === activeIndex ? (
        <Button className="bg-[#475467] text-[#FCFCFD] w-full mt-6 rounded-xl">
          Buy Credits
        </Button>
      ) : (
        <Button
          onPress={() => mutate({ creditPointId: id })}
          isLoading={false}
          className={` w-full mt-6 rounded-xl h-[40px] transition-colors duration-300 ease-in-out ${
            selectedPlanIndex === index
              ? "bg-[#05834B] text-[#FCFCFD]"
              : "bg-[#FCFCFD] text-[#05834B]"
          }`}
        >
          Buy Credits
        </Button>
      )}
    </div>
  );
}

export default CreditPlan;
