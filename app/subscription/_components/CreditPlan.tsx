"use client";
import { CreditIcon } from '@/app/_shared/icons/icons';
import { CreditPlansType, SubPlansType } from '@/app/utils/constants/typess';
import { Button, CheckboxIcon } from '@nextui-org/react';
import React from 'react'
import { PaystackButton } from 'react-paystack';

function CreditPlan({
  plan,
  setSelectedPlanIndex,
  index,
  selectedPlanIndex,
  activeIndex,
}: {
  plan: CreditPlansType;
  setSelectedPlanIndex: (index: number) => void;
  index: number;
  selectedPlanIndex: number;
  activeIndex: number;
}) {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string;
  const handleSuccess = async (reference: any) => {
    console.log("Payment Success:", reference);

    // ✅ Verify with your backend
    await fetch(`/api/payments/verify/${reference.reference}`, {
      method: "GET",
    });

    // optionally, update subscription status in your app
  };

  const handleClose = () => {
    console.log("Payment closed");
  };
  const paystackProps = {
    email: "user@example.com", // replace with logged-in user email
    amount: plan.price * 100, // convert to kobo
    publicKey,
    text: "Buy Credits",
    onSuccess: handleSuccess,
    onClose: handleClose,
    metadata: {
      custom_fields: [
        {
          display_name: "Plan Type",
          variable_name: "plan_type",
          value: plan.type,
        },
      ],
    },
  };

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
        <div className="flex items-center justify-center">
          <span className="text-3xl font-semibold">$</span>
          <p className="flex items-end gap-1">
            <span className="text-6xl font-bold leading-none">
              {plan.price}
            </span>
          </p>
        </div>
      </div>
      <p className="w-full text-center text-xs mt-2 "></p>
      <div className="flex items-center gap-3 mb-8 bg-[#1E293B] rounded-lg p-4 mt-5">
        <CreditIcon className="w-6 h-6 text-[#34D399] flex-shrink-0" />
        <div>
          <p className="text-slate-400 text-xs">Credits</p>
          <p className="text-lg font-semibold text-white">{plan.credits} credits</p>
        </div>
      </div>
      {index === activeIndex ? (
        <Button className="bg-[#475467] text-[#FCFCFD] w-full mt-6 rounded-xl">
          Buy Credits
        </Button>
      ) : (
        <PaystackButton
          {...paystackProps}
          className={` w-full mt-6 rounded-xl h-[40px] transition-colors duration-300 ease-in-out ${
            selectedPlanIndex === index
              ? "bg-[#05834B]"
              : "bg-[#FCFCFD] text-[#05834B]"
          }`}
        />
      )}
    </div>
  );
}


export default CreditPlan