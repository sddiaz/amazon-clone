"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface NavButtonProps {
  children: ReactNode;
  disabled?: boolean;
  link?: string;
}

const contentClassName =
  "w-full select-none h-[90%] flex whitespace-nowrap p-[10px] gap-3 text-[14px] text-white items-center justify-center font-emberThin transition-transform overflow-hidden";

export default function NavButton({ children, disabled = false, link = "" }: NavButtonProps) {
  // Nothing to navigate to: render inert content instead of a link, so it
  // can't reopen the current page.
  if (disabled || !link) {
    return (
      <span className="shrink-0 opacity-50 pointer-events-none">
        <span className={contentClassName}>{children}</span>
      </span>
    );
  }

  return (
    <Link
      href={link}
      {...(link.startsWith("/")
        ? {}
        : { target: "_blank", rel: "noopener noreferrer" })}
      className="shrink-0 cursor-pointer hover:scale-105"
    >
      <span className={contentClassName}>{children}</span>
    </Link>
  );
}
