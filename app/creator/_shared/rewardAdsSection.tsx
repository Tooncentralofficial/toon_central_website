"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import QualifyCards from "./qualifyCards";

const introCopy = [
  "Reward ads are 15–30 second video ads that viewers can watch to unlock locked episodes of your series.",
  "Because these ads are highly engaging, they can earn 3–5× more than regular static ads, depending on the advertiser and how your audience interacts with the ad.",
  "Once you're part of the Toon Central Ad Revenue Program, you'll qualify for reward ads when your series reaches 100,000+ global monthly page views.",
  "If approved, you can lock up to three episodes behind reward ads at any given time.",
];

const qualifications = [
  { id: "reader-ads", text: "Already be eligible for Reader Ads." },
  { id: "views", text: "Reach 100,000 monthly global page views or more." },
];

/** `bullet` lines get a centred "•" — a real <ul> can't centre its markers. */
const revenueCopy: { text: string; bullet?: boolean }[] = [
  {
    text: "At Toon Central, reward ads let you earn extra income when readers choose to watch a 15–30 second video ad in exchange for unlocking a locked episode.",
  },
  {
    text: "Unlike regular page views, revenue is based on ad impressions, not just how many people read your series.",
  },
  { text: "Page views = how many times your series is read.", bullet: true },
  { text: "Ad impressions = how many times an ad is actually shown to a reader.", bullet: true },
  {
    text: "The more viewers who watch the ad completely, the more you earn! On average, video ads can be worth 3–5× more than static ads, depending on advertiser demand and engagement.",
  },
  { text: "Your monthly earnings will vary depending on:" },
  { text: "The number of completed ad views on your episodes.", bullet: true },
  { text: "Advertiser spending and the overall global ad market.", bullet: true },
  { text: "For details, check the Ad Revenue Sharing tab, our program terms, and FAQ." },
];

const RewardAdsSection = () => {
  const { token } = useSelector(selectAuthState);
  const tokenState = token === undefined;

  return (
    <div className="parent-wrap pb-14 md:pb-20">
      <div className="child-wrap flex w-full flex-col items-center text-center">
        <h2 className="text-2xl md:text-[34px] font-bold leading-tight">
          Reward Ads
        </h2>
        <div className="mt-6 flex max-w-[1060px] flex-col capitalize text-sm md:text-lg leading-[1.95] text-[#FCFCFD]">
          {introCopy.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>
            <span aria-hidden="true">{"⚠︎"}</span> Note: every episode
            using reward ads will be reviewed and must be approved before it goes
            live
          </p>
        </div>

        <div className="mt-16 md:mt-24 flex w-full flex-col items-center">
          <QualifyCards title="To Qualify For Reward Ads:" items={qualifications} />
        </div>

        <h2 className="mt-20 md:mt-28 text-2xl md:text-[34px] font-bold leading-tight">
          How Reward Ads Generate Revenue
        </h2>
        <div className="mt-8 md:mt-12 flex max-w-[1040px] flex-col capitalize text-sm md:text-lg leading-[1.95] text-[#FCFCFD]">
          {revenueCopy.map((line) => (
            <p key={line.text}>
              {line.bullet && (
                <span aria-hidden="true" className="mr-2">
                  •
                </span>
              )}
              {line.text}
            </p>
          ))}
        </div>

        <Button
          as={Link}
          href={tokenState ? "/auth/signup" : "/creator/new"}
          radius="sm"
          className="mt-16 md:mt-24 h-14 px-12 text-base font-bold text-[#FCFCFD] bg-[linear-gradient(90deg,#4AA05E_0%,#6CC47F_100%)]"
        >
          Start sharing your story
        </Button>
      </div>
    </div>
  );
};

export default RewardAdsSection;
