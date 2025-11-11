"use client";
import React from 'react'
import H2SectionTitle from '../_shared/layout/h2SectionTitle';

import { CheckIcon} from "@nextui-org/shared-icons"
import { CreditPlans, SubPlans } from '../utils/constants/constants';
import dynamic from 'next/dynamic';

const CreditPlan = dynamic(() => import("./_components/CreditPlan"), { ssr: false });
const SubPlan = dynamic(() => import("./_components/SubPlan"), { ssr: false });
function Page() {
  const [activePlan, setActivePlan] = React.useState(0);
  const [selectedPlanIndex, setSelectedPlanIndex] = React.useState(0);

  const [activeCreditPlan, setActiveCreditPlan] = React.useState(0);
  const [selectedCreditPlanIndex, setSelectedCreditPlanIndex] =
    React.useState(0);
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
              {SubPlans.map((plan, i) => (
                <SubPlan
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
                {CreditPlans.map((plan, i) => (
                  <CreditPlan
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

export default Page