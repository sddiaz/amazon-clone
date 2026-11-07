"use client";

import {
  Car,
  Cpu,
  Gamepad2,
  Gem,
  Gift,
  Menu,
  Scroll,
  Shirt,
  ShoppingBag,
  Video,
} from "lucide-react";
import NavButton from "../../Shared/NavButton";

const BottomBar = () => {
  return (
    <div className="bg-[var(--amazonBlue)] text-white flex items-center font-emberThin overflow-x-auto [scrollbar-width:none] py-1 md:justify-between">
      <NavButton disabled>
        <Menu />
        All
      </NavButton>
      <NavButton link="/orders">
        <ShoppingBag />
        Orders
      </NavButton>
      <NavButton link="https://www.linkedin.com/in/santiagoddiaz/">
        <Video />
        Prime Video
      </NavButton>
      <NavButton disabled>
        <Cpu />
        Electronics
      </NavButton>
      <NavButton disabled>
        <Gem />
        Jewelry
      </NavButton>
      <NavButton disabled>
        <Shirt />
        Clothing
      </NavButton>
      <NavButton disabled>
        <Gift />
        Gift Cards
      </NavButton>
      <NavButton disabled>
        <Scroll />
        Coupons
      </NavButton>
      <NavButton disabled>
        <Car />
        Automotive
      </NavButton>
      <NavButton disabled>
        <Gamepad2 />
        Gaming
      </NavButton>
    </div>
  );
};

export default BottomBar;
