"use client";

import Image from "next/image";

/**
 * These are referenced by public path, not imported: next.config.mjs runs
 * @svgr/webpack over every .svg imported from a .tsx, which hands back a React
 * component rather than a URL that next/image can use.
 */
interface Step {
  id: string;
  title: string;
  description: string;
  /** drop the real illustration in here — falls back to a placeholder block */
  src?: string;
}

const steps: Step[] = [
  {
    id: "sign-up",
    title: "Sign Up For Free",
    description: "Join Toon Central in minutes quick, easy, and no fees.",
    src: "/static/creator101/signup.svg"
  },
  {
    id: "profile",
    title: "Customize Your Profile",
    description:
      "Add your name, bio, and a profile pic so readers know who you are.",
      src: "/static/creator101/customize.svg"
  },
  {
    id: "tools",
    title: "Explore The Creator Tools",
    description:
      "Familiarize yourself with our upload dashboard, style guides, and resources.",
      src: "/static/creator101/explore.svg"
  },
  {
    id: "upload",
    title: "Upload Your First Chapter",
    description: "Drag, drop, and publish, no tech headaches.",
    src: "/static/creator101/upload.svg"
  },
  {
    id: "share",
    title: "Share Your Work",
    description:
      "Post your link on social media, invite friends, and reach new fans.",
    src: "/static/creator101/share.svg"
  },
  {
    id: "engage",
    title: "Engage & Grow",
    description:
      "Reply to comments, join challenges, and use monetization features to earn.",
      src: "/static/creator101/engage.svg"
  },
];

const StepsSection = () => {
  return (
    <div className="parent-wrap py-14 md:py-20">
      <div className="child-wrap flex w-full flex-col items-center">
        <h2 className="text-center text-[26px] md:text-[34px] font-bold leading-[1.6]">
          Start Your Story In 6
          <br />
          Easy{" "}
          <span className="bg-[#4ADD80] text-[#0D111D] px-3 py-1">Steps</span>
        </h2>

        <div className="mt-14 grid w-full grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className="relative flex h-[180px] w-full items-center justify-center">
                {step.src ? (
                  <Image
                    src={step.src}
                    alt={step.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 300px"
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <div className="flex h-full w-full max-w-[240px] items-center justify-center rounded-lg border border-dashed border-[#475467] bg-[var(--bg-secondary)]">
                    <span className="px-4 text-center text-xs uppercase tracking-wide text-[#475467]">
                      {step.title}
                    </span>
                  </div>
                )}
              </div>

              <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
              <p className="mt-4 max-w-[320px] text-sm text-gray leading-[1.8]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepsSection;
