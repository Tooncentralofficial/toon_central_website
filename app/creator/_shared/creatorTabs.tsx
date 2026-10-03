"use client";

export interface CreatorTab {
  id: string;
  label: string;
}

export const creatorTabs: CreatorTab[] = [
  { id: "introduction", label: "Introduction" },
  { id: "uploading", label: "Uploading" },
  { id: "mafiki", label: "Mafiki" },
  { id: "making-money", label: "Making Money" },
];

interface CreatorTabsProps {
  activeTab: string;
  onChange: (id: string) => void;
}

const CreatorTabs = ({ activeTab, onChange }: CreatorTabsProps) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div
        role="tablist"
        aria-label="Creator 101 sections"
        className="flex items-center gap-6 md:gap-8 w-max"
      >
        {creatorTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`relative whitespace-nowrap uppercase text-sm md:text-base tracking-wide pb-2 transition-colors ${
                isActive ? "text-[#FCFCFD]" : "text-gray hover:text-[#FCFCFD]"
              }`}
            >
              {tab.label}
              <span
                className={`absolute left-0 bottom-0 h-[2px] w-full rounded-full transition-opacity ${
                  isActive ? "bg-[var(--green100)] opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CreatorTabs;
