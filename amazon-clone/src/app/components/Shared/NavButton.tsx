"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface NavButtonProps {
  children: ReactNode;
  disabled?: boolean;
  link?: string;
}

export default function NavButton({ children, disabled = false, link = ""}: NavButtonProps) {
  return (
    <Link
      href={link}
      {...(link.startsWith("/")
        ? {}
        : { target: "_blank", rel: "noopener noreferrer" })}
      className={`shrink-0 ${
      disabled 
        ? 'opacity-50 pointer-events-none' 
        : 'cursor-pointer hover:scale-105'
    }`}>
    <span 
      className={`w-full select-none h-[90%] flex whitespace-nowrap p-[10px] gap-3 text-[14px] text-white items-center justify-center font-emberThin transition-transform overflow-hidden`}>
      {children}
    </span>
    </Link>

  );
}