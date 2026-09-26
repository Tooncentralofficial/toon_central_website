"use client";

/** Placeholder until each Creator 101 section is built out. */
const ComingSoonSection = ({ title }: { title: string }) => {
  return (
    <div className="parent-wrap py-20">
      <div className="child-wrap flex w-full flex-col items-center text-center gap-3">
        <h2 className="text-2xl">{title}</h2>
        <p className="text-gray max-w-[420px]">
          This section is coming soon.
        </p>
      </div>
    </div>
  );
};

export default ComingSoonSection;
