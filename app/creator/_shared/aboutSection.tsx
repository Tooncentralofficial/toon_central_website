"use client";

const iconProps = {
  width: 40,
  height: 40,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const PublishIcon = () => (
  <svg {...iconProps} aria-hidden="true">
    <path d="M6.5 18.5a4.5 4.5 0 0 1-.6-8.96 6 6 0 0 1 11.64-1.4A4.25 4.25 0 0 1 18 18.5" />
    <path d="M12 21v-8" />
    <path d="m9 15.5 3-3 3 3" />
  </svg>
);

const StyleIcon = () => (
  <svg {...iconProps} aria-hidden="true">
    <path d="M12 3a9 9 0 0 0 0 18c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.5-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6h1.9A4.8 4.8 0 0 0 21 10.8C21 6.5 16.9 3 12 3Z" />
    <circle cx="7.5" cy="11" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="10.5" cy="7" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const EarnIcon = () => (
  <svg {...iconProps} aria-hidden="true">
    <circle cx="9.5" cy="9.5" r="6.5" />
    <path d="M8.5 7.6 9.8 7v5" />
    <path d="M15.2 5.3a6.5 6.5 0 0 1 0 12.2" />
    <path d="M17.4 3.6a8.6 8.6 0 0 1 0 15.6" />
  </svg>
);

const highlights = [
  {
    id: "publish",
    icon: <PublishIcon />,
    title: "Publish Seamlessly",
    description:
      "Upload chapters in a few clicks with tools that make publishing quick and stress-free.",
  },
  {
    id: "style",
    icon: <StyleIcon />,
    title: "Show Your Style",
    description:
      "Share your art or explore our Mafiki style, digital or traditional, your work gets the spotlight.",
  },
  {
    id: "earn",
    icon: <EarnIcon />,
    title: "Grow & Earn",
    description:
      "Build fans, grow your readership, and monetize your passion.",
  },
];

const AboutSection = () => {
  return (
    <div className="parent-wrap py-10 md:py-14">
      <div className="child-wrap flex w-full flex-col">
        <h2 className="text-2xl md:text-[28px]">What Tooncentral Is All About</h2>
        <p className="mt-4 capitalize leading-[1.8] text-[#FCFCFD]">
          Toon Central is your ultimate gateway into the vibrant world of
          Mafiki. Whether you&apos;re here to dive into captivating stories,
          connect with passionate creators, or share your own work with the
          world, we&apos;ve built a space where every panel comes alive. From
          epic adventures and heartwarming romances to thrilling mysteries and
          laugh-out-loud comedies, there&apos;s something for every Mafiki lover
          here
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {highlights.map((item) => (
            <div
              key={item.id}
              className="flex flex-col rounded-xl bg-gradient-to-br from-[#182233] to-[#0F1624] p-6 min-h-[210px]"
            >
              <span className="text-[#4ADD80]">{item.icon}</span>
              <h3 className="mt-auto pt-10 text-lg">{item.title}</h3>
              <p className="mt-3 text-sm text-gray leading-[1.7]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
