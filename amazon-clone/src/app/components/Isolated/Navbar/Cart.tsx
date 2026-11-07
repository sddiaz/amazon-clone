"use client";

import Link from "next/link";
import "../../../styles/globals.css";
import { ShoppingCart } from "lucide-react";

const Cart = (props: { size: number }) => {
  //#region Variables

  //#endregion

  //#region Methods & Helper Functions

  //#endregion

  //#region Hooks

  //#endregion

  return (
    <Link href={"/cart"} className="h-[90%]">
      <span className="w-[60px] h-full flex flex-col p-[10px] text-[12px] hover-border text-white items-center justify-center cursor-pointer font-emberThin font-bold">
        <div className="flex justify-center items-center">
          <ShoppingCart />
          <span className="text-[var(--amazonOrange)]">
            {props?.size != 0 ? (props?.size > 99 ? "99+" : props?.size) : ""}
          </span>
        </div>
        <div className="text-[14px] font-ember">Cart</div>
      </span>
    </Link>
  );
};

export default Cart;
