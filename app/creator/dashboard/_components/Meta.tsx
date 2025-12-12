"use client";

import MetaIcon from "./MetaIcon";

const Meta = ({
  icon,
  children,
}: {
  icon: "eye" | "heart" | "comment" | "time";
  children: string;
}) => (
  <span className="inline-flex items-center gap-2 text-sm">
    <MetaIcon type={icon} />
    {children}
  </span>
);

export default Meta;
