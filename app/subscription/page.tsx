"use client";
import React from "react";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";

import { CheckIcon } from "@nextui-org/shared-icons";
import { CreditPlans, SubPlans } from "../utils/constants/constants";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { selectAuthState, selectHasSubscription, selectSubscriptionName } from "@/lib/slices/auth-slice";
import { usePathname } from "next/navigation";
import { getRequest, getRequestProtected } from "../utils/queries/requests";
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
const SpecialOfferCard = dynamic(
  () => import("./_components/SpecialOfferCard"),
  { ssr: false }
);

// Short period label shown next to the price (e.g. "NGN/week").
const periodLabel = (plan: any) =>
  plan?.duration?.slug ?? plan?.duration?.name ?? plan?.interval ?? "";

// Build the renewal/info line from the plan's billing data.
const buildInfoText = (plan: any) => {
  const every =
    plan?.duration?.description ?? plan?.interval ?? plan?.duration?.name ?? "";
  return plan?.isRecurring
    ? `Auto-renews ${every} until you cancel. Manage or cancel anytime.`
    : `One-time payment for ${every || "the period"} of full access.`;
};

// Derive the feature checklist from the plan's benefit flags.
const buildFeatures = (plan: any): string[] => {
  const features: string[] = [];
  if (plan?.accessToTooncentral) {
    features.push("Access to all locked panels & chapters");
    features.push("All comics & series included");
  }
  if (plan?.hideAds) features.push("Ad-free reading");
  if (plan?.offlineDownload) features.push("Offline downloads");
  if (plan?.membership) features.push("Membership perks");
  if (plan?.creditPoint)
    features.push(`${Number(plan.creditPoint).toLocaleString()} credits included`);
  if (plan?.bonusCreditPoint)
    features.push(
      `${Number(plan.bonusCreditPoint).toLocaleString()} bonus credits`
    );
  return features;
};

function Page() {
  const { token } = useSelector(selectAuthState);
  const subscriptionName = useSelector(selectSubscriptionName);
  const hasSubscription = useSelector(selectHasSubscription)
  const [activePlan, setActivePlan] = React.useState(0);
  const [selectedPlanIndex, setSelectedPlanIndex] = React.useState(0);
  const [activeCreditPlan, setActiveCreditPlan] = React.useState(0);
  const pathname = usePathname();
  const [selectedCreditPlanIndex, setSelectedCreditPlanIndex] =
    React.useState(0);



  const {data:subStatusData} = useQuery({
    queryKey: ["subscription_status"],
    queryFn: () =>
      getRequestProtected("subscription/status", token, pathname),
    enabled: !!token,
  });
  const subStatus = subStatusData?.data;

  const results = useQueries({
    queries: [
      {
        queryKey: ["subscription_plans"],
        queryFn: () =>
          getRequest("selectables/plans"),
      },
      {
        queryKey: ["subscription_coin"],
        queryFn: () =>
          getRequest("selectables/comic-coin"),
        
      },
      {
        queryKey: ["subscription_special_plans"],
        queryFn: () =>
          getRequest("selectables/special-plans"),
        
      },
    ],
  });
  const subscriptionPlans = results[0].data;
  const subscriptionCoin = results[1].data;
  const subscriptionSpecialPlans = results[2].data;
  const isLoadingPlans = results[0].isLoading;
  const isLoadingCoins = results[1].isLoading;
  const isLoadingSpecialPlans = results[2].isLoading;
  const plans = subscriptionPlans?.data;
  const coin = subscriptionCoin?.data;
  const specialPlans = subscriptionSpecialPlans?.data;


  // When linked from the home banner (/subscription#special-offers), smoothly
  // scroll to the special offers section once the page content has loaded.
  // The element id intentionally differs from the hash so the browser does NOT
  // perform an instant native jump — the smooth scroll below handles it.
  React.useEffect(() => {
    if (isLoadingPlans || isLoadingCoins) return;
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#special-offers") return;
    const id = setTimeout(() => {
      const el = document.getElementById("special-offers-section");
      if (el) {
        window.requestAnimationFrame(() =>
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        );
      }
    }, 150);
    return () => clearTimeout(id);
  }, [isLoadingPlans, isLoadingCoins]);

  // Show the free (cheapest) plan first, same ordering as the special offers.
  const sortedPlans = [...(plans ?? [])].sort(
    (a: any, b: any) => (a?.amount ?? 0) - (b?.amount ?? 0)
  );

  // Show the daily (cheapest) plan first so it carries the BEST VALUE badge.
  const sortedSpecialPlans = [...(specialPlans ?? [])].sort(
    (a: any, b: any) => (a?.amount ?? 0) - (b?.amount ?? 0)
  );

  // Build each special-offer card entirely from the API plan data.
  const specialOffers = sortedSpecialPlans.map((plan: any, i: number) => ({
    id: plan?.id,
    name: plan?.name,
    amount: plan?.amount,
    period: periodLabel(plan),
    subtitle: plan?.description ?? "",
    ctaLabel: `Get ${plan?.name ?? "Plan"}`,
    infoText: buildInfoText(plan),
    features: buildFeatures(plan),
    isRecurring: plan?.isRecurring ?? false,
    highlighted: i === 0,
    badge: i === 0 ? "BEST VALUE" : undefined,
  }));

  if(isLoadingPlans || isLoadingCoins) return (
    <div className="parent-wrap py-10">
      <div className="child-wrap h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_: unknown, i: number) => (
            <SubPlanSkeleton key={i} />
          ))}
          {Array.from({ length: 4 }).map((_: unknown, i: number) => (
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 ">
              {isLoadingPlans
                ? Array.from({ length: 4 }).map((_: unknown, i: number) => (
                    <SubPlanSkeleton key={i} />
                  ))
                : sortedPlans?.map((plan: any, i: number) => (
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
            <div className="w-full flex items-center flex-col pt-10">
              <h3>By Credits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 items-stretch w-full">
                {isLoadingCoins
                  ? Array.from({ length: 4 }).map((_: unknown, i: number) => (
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

            <div
              id="special-offers-section"
              className="w-full flex items-center flex-col pt-12 scroll-mt-24"
            >
              <h3>Special Offers</h3>
              <p className="text-xs text-[#7f8ca0] mt-1">
                Limited-time passes to unlock everything
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 items-stretch w-full max-w-[820px]">
                {isLoadingSpecialPlans
                  ? Array.from({ length: 2 }).map((_: unknown, i: number) => (
                      <SubPlanSkeleton key={i} />
                    ))
                  : specialOffers.map((offer: any) => (
                      <SpecialOfferCard key={offer.id} offer={offer} />
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
