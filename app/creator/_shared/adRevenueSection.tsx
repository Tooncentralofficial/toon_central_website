"use client";

interface AdRevenueStep {
  id: string;
  title: string;
  description: string;
}

const steps: AdRevenueStep[] = [
  {
    id: "signup",
    title: "Sign Up As A Creator",
    description:
      "Join the Ad Revenue Sharing Program from your Toon Central Creator Dashboard.",
  },
  {
    id: "views",
    title: "Meet The Minimum View Requirements",
    description:
      "Hit the monthly global page view goal for Reader Ads or Reward Ads.",
  },
  {
    id: "review",
    title: "Apply For Review",
    description:
      "Our team will check your eligibility and approve your account.",
  },
];

const AdRevenueSection = () => {
  return (
    <div className="parent-wrap pb-14 md:pb-20">
      <div className="child-wrap flex w-full flex-col items-center">
        <h2 className="text-center text-2xl md:text-[32px] font-bold leading-tight">
          Ad Revenue Sharing Program
        </h2>
        <p className="mt-5 max-w-[620px] text-center text-sm md:text-base leading-[1.9] text-[#FCFCFD]">
          Earn 50% From Ads Shown On Your Manga Series!
          <br className="hidden md:block" /> Turn Your Views Into Income While
          Keeping Your Stories Free For Fans.
        </p>

        <h3 className="mt-14 md:mt-20 max-w-[620px] text-center text-xl md:text-[26px] font-bold leading-[1.5]">
          Follow These Steps To Join The Ad Revenue Sharing Program:
        </h3>

        <div className="mt-10 md:mt-14 grid w-full grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col rounded-xl bg-gradient-to-br from-[#182233] to-[#0F1624] p-6 md:min-h-[220px]"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4ADD80] text-base font-bold text-[#0D111D]"
              >
                {index + 1}
              </span>
              <h4 className="mt-auto pt-8 text-sm md:text-base font-semibold leading-[1.6]">
                {step.title}
              </h4>
              <p className="mt-3 text-sm text-gray leading-[1.8]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdRevenueSection;
