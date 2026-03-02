"use client";

import { useRouter } from "next/navigation";

export function ComicLink({
  uuid,
  children,
  className = "",
  ...rest
}: {
  uuid: string | undefined;
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();

  const handleClick = () => {
    if (uuid) router.push(`/comics/${uuid}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && uuid) {
      e.preventDefault();
      router.push(`/comics/${uuid}`);
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`cursor-pointer ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
