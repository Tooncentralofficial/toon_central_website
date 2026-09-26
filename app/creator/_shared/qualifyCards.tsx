"use client";

interface QualifyCardsProps {
  title: string;
  items: { id: string; text: string }[];
}

/** Numbered requirement cards shared by the Reader Ads and Reward Ads sections. */
const QualifyCards = ({ title, items }: QualifyCardsProps) => {
  return (
    <>
      <h3 className="text-xl md:text-[28px] font-bold leading-tight">{title}</h3>

      {/* the numbered badge sits half above each card, so rows need extra
          vertical gap when the cards stack on mobile */}
      <div className="mt-14 md:mt-16 flex w-full flex-col items-center gap-14 md:flex-row md:justify-center md:gap-12">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="relative flex min-h-[148px] w-full max-w-[380px] items-center justify-center rounded-xl bg-gradient-to-br from-[#1B2330] to-[#141A24] px-8 pb-8 pt-12"
          >
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-0 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#4ADD80] text-2xl font-bold text-[#0D111D]"
            >
              {index + 1}
            </span>
            <p className="max-w-[250px] text-sm leading-[1.9] text-[#FCFCFD]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default QualifyCards;
