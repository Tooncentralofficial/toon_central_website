"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { CheckIcon  } from "@nextui-org/shared-icons";
import { SubPlansType } from "@/app/utils/constants/typess";
export default function SubPlan({plan,setSelectedPlanIndex,index, selectedPlanIndex,activeIndex}: { plan: SubPlansType,setSelectedPlanIndex: (index: number) => void, index: number, selectedPlanIndex: number ,activeIndex: number  }) {
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
        <p className="text-[1.3rem]">{plan.type}</p>
        <div className="flex ">
          <span className="text-3xl font-semibold">$</span>
          <p className="flex items-end gap-1">
            <span className="text-6xl font-bold leading-none">
              {plan.price}
            </span>
            <aside className="text-xs leading-tight ml-1">
              USD/
              <br />
              <span>month</span>
            </aside>
          </p>
        </div>
      </div>
      <p className="w-full text-center text-xs mt-2 ">{plan.title}</p>

      <Button
        className={`text-[#FCFCFD] w-full mt-6 transition-colors duration-300 ease-in-out ${
          index === activeIndex
            ? "bg-[#475467]"
            : selectedPlanIndex === index
            ? "bg-[#05834B]"
            : "bg-[#FCFCFD] text-[#05834B]"
        } `}
      >
        {index === activeIndex ? "Active" : "Subscribe"}
      </Button>
      <div className="pl-2 flex flex-col gap-7 mt-8">
        {plan.content.map((item, i) => (
          <span key={i} className="text-[0.87rem] flex ">
            {" "}
            <CheckIcon className="text-[#05834B]" /> <p>{item}</p>{" "}
          </span>
        ))}
      </div>
    </div>
  );
}
