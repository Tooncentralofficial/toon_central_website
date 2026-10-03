"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface JoinStep {
  id: string;
  /** rendered on the first line — takes a node so a step can carry a link */
  title: ReactNode;
  description: string;
}

const steps: JoinStep[] = [
  {
    id: "likes",
    title: "Earn From Each 200 Likes On Your Series",
    description:
      "Once your series hits a total of 1000 Likes, it becomes eligible for earnings.",
  },
  {
    id: "guidelines",
    title: (
      <>
        Follow{" "}
        <Link
          href="/policies"
          className="text-[#4A7DFF] underline underline-offset-2 hover:text-[#6E97FF]"
        >
          Toon Central&apos;s Creator Guidelines
        </Link>
      </>
    ),
    description:
      "Keep your content in line with our community and uploading rules to ensure a safe and creative space.",
  },
  {
    id: "age",
    title: "Be 18 Or Older",
    description:
      "Creators must be at least 18 years old (or the legal age in your country) to participate.",
  },
  {
    id: "apply",
    title: "Apply For The Creator Rewards Program",
    description:
      "Sign up through your dashboard and submit your application.",
  },
  {
    id: "activate",
    title: "Activate Earnings On Your Series",
    description:
      "Once approved, turn on the earnings feature and start receiving rewards from your fans.",
  },
];

const JoinStepsSection = () => {
  return (
    <div className="parent-wrap py-14 md:py-20">
      <div className="child-wrap flex w-full flex-col items-center">
        <h2 className="text-center text-2xl md:text-[32px] font-bold leading-tight">
          Follow These Steps To Join!
        </h2>

        {/* flex-wrap rather than a 3-col grid so the trailing two cards centre
            on their own row instead of hugging the left edge */}
        <div className="mt-10 md:mt-14 flex w-full flex-wrap justify-center gap-5">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex w-full flex-col rounded-xl bg-gradient-to-br from-[#182233] to-[#0F1624] p-6 md:w-[calc((100%-2.5rem)/3)] md:min-h-[240px]"
            >
              {/* gradient-filled numeral. Inline styles on purpose: the tailwind
                  config replaces the colour palette, so `text-transparent` emits
                  nothing, and there's no autoprefixer to add the -webkit- clip
                  Safari needs */}
              <span
                aria-hidden="true"
                className="w-max text-[44px] md:text-[56px] font-bold leading-none"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #B4BAC2 0%, #858C97 55%, #555C68 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {index + 1}
              </span>
              <h3 className="mt-auto pt-8 text-sm md:text-base font-semibold leading-[1.6]">
                {step.title}
              </h3>
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

export default JoinStepsSection;
