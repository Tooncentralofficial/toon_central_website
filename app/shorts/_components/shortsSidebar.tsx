"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingIcon,
  HomeIcon,
  GenresIcon,
  OriginalIcon,
} from "../../_shared/icons/icons";

interface ShortsSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const sidebarItems = [
  { id: "trending", label: "Trending", icon: TrendingIcon },
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "genres", label: "Genres", icon: GenresIcon },
  { id: "originals", label: "Originals", icon: OriginalIcon },
];

export default function ShortsSidebar({
  collapsed,
  onToggle,
  activeCategory,
  onCategoryChange,
}: ShortsSidebarProps) {
  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-[var(--bg-menu-cont)] border-r border-[var(--border-color)] h-screen sticky top-0 overflow-hidden"
    >
      <div className="p-4">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="w-full flex justify-center items-center p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors mb-4"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              className={`w-4 h-4 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeCategory === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onCategoryChange(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--cursor-color)] text-white"
                    : "hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]"
                }`}
              >
                <IconComponent />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
}