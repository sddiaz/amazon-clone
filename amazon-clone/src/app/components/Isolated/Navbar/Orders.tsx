"use client";

import Link from "next/link";
import "../../../styles/globals.css";

const Orders = () => {
  
  return (
    <Link href="/orders">
      <span className="select-none h-[90%] flex flex-col p-[10px] text-[12px] hover-border text-white items-start justify-start cursor-pointer font-emberThin">
        Returns
        <div className="leading-[1] whitespace-nowrap heading font-bold font-emberThin">
          & Orders
        </div>
      </span>
    </Link>
  );
};

export default Orders;
