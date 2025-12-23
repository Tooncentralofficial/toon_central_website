"use client";
import React from "react";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";

import { CheckIcon } from "@nextui-org/shared-icons";
import { CreditPlans, SubPlans } from "../utils/constants/constants";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { usePathname } from "next/navigation";
import { getRequestProtected } from "../utils/queries/requests";
import { useQueries, useQuery } from "@tanstack/react-query";

const CreditPlan = dynamic(() => import("./_components/CreditPlan"), {
  ssr: false,
});
const SubPlan = dynamic(() => import("./_components/SubPlan"), { ssr: false });
const SubPlanSkeleton = dynamic(() => import("./_components/SubPlanSkeleton"), {
  ssr: false,
});
const CreditPlanSkeleton = dynamic(
  () => import("./_components/CreditPlanSkeleton"),
  { ssr: false }
);
function Page() {
  const { token } = useSelector(selectAuthState);
  const [activePlan, setActivePlan] = React.useState(0);
  const [selectedPlanIndex, setSelectedPlanIndex] = React.useState(0);
  const [activeCreditPlan, setActiveCreditPlan] = React.useState(0);
  const pathname = usePathname();
  const [selectedCreditPlanIndex, setSelectedCreditPlanIndex] =
    React.useState(0);

  const results = useQueries({
    queries: [
      {
        queryKey: ["subscription_plans"],
        queryFn: () =>
          getRequestProtected("selectables/plans", token, pathname),
        enabled: !!token,
      },
      {
        queryKey: ["subscription_coin"],
        queryFn: () =>
          getRequestProtected("selectables/comic-coin", token, pathname),
        enabled: !!token,
      },
    ],
  });
  const subscriptionPlans = results[0].data;
  const subscriptionCoin = results[1].data;
  const isLoadingPlans = results[0].isLoading;
  const isLoadingCoins = results[1].isLoading;

  console.log("@@subscriptionCoin", subscriptionCoin);
  const plans = subscriptionPlans?.data;
  const coin = subscriptionCoin?.data;
  console.log("@@plans", plans);
  console.log("@@coin", coin);

  if(isLoadingPlans || isLoadingCoins) return (
    <div className="parent-wrap py-10">
      <div className="child-wrap h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <SubPlanSkeleton key={i} />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <CreditPlanSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap h-full">
        <H2SectionTitle title="Subscription" />
        <div className="bg-[var(--bg-secondary)] p-6 md:p-9 rounded-[8px] h-full mb-7">
          <div className="flex flex-col gap-4 items-center ">
            <H2SectionTitle
              title="
            UPGRADE YOUR PLAN"
            />
            <aside className="">
              {" "}
              <p className="border-[2px] inline-flex border-[#05834B] px-5 py-1 rounded-[8px] ">
                Explore and Enjoy
              </p>
            </aside>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
              {isLoadingPlans
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SubPlanSkeleton key={i} />
                  ))
                : plans?.map((plan: any, i: number) => (
                    <SubPlan
                      id={plan.id}
                      key={i}
                      plan={plan}
                      setSelectedPlanIndex={setSelectedPlanIndex}
                      selectedPlanIndex={selectedPlanIndex}
                      index={i}
                      activeIndex={activePlan}
                    />
                  ))}
            </div>
            <div className="w-full flex items-center flex-col ">
              <h3>By Credits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 items-stretch w-full">
                {isLoadingCoins
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <CreditPlanSkeleton key={i} />
                    ))
                  : coin?.map((plan: any, i: number) => (
                      <CreditPlan
                        id={plan.id}
                        key={i}
                        plan={plan}
                        setSelectedPlanIndex={setSelectedCreditPlanIndex}
                        selectedPlanIndex={selectedCreditPlanIndex}
                        index={i}
                        activeIndex={activeCreditPlan}
                      />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
