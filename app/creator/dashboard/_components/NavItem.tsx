"use client";

import NavIcon from "./NavIcon";

type NavItemProps = {
  icon: "home" | "chart" | "wallet";
  label: string;
  badge?: string;
  active?: boolean;
  collapsed?: boolean;
};

const NavItem = ({
  icon,
  label,
  badge,
  active = false,
  collapsed = false,
}: NavItemProps) => (
  <div
    className={`grid items-center gap-3 px-3 py-3 rounded-[12px] transition-colors ${
      collapsed ? "grid-cols-[22px]" : "grid-cols-[22px_1fr_auto]"
    } ${
      active
        ? "bg-[#082816] text-[#f5f7fb]"
        : "text-[#a7b4c7] hover:bg-[#0f1b28]"
    }`}
    title={collapsed ? label : undefined}
  >
    <NavIcon type={icon} />
    {!collapsed && <span>{label}</span>}
    {!collapsed && badge && (
      <span className="bg-[#1ec069] text-[#04100b] rounded-full px-2.5 py-1 text-[12px] font-semibold">
        {badge}
      </span>
    )}
  </div>
);

export default NavItem;
