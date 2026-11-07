"use client";

import AmazonCarousel from "./components/Isolated/Carousel/AmazonCarousel";
import ProductDisplay from "./components/Shared/ProductDisplay";

export default function Home() {
  
  //#region Variables

  //#endregion

  //#region Methods

  //#endregion

  //#region Hooks

  //#endregion

  //#region Component

  return (
    <div className="w-full bg-[var(--amazonGrey)] overflow-hidden min-h-screen">
      <div className="max-w-[1500px] mx-auto relative">
        {/* Carousel */}
        <AmazonCarousel />
        {/* Products */}
        <ProductDisplay type="category" />
      </div>
    </div>
  );

  //#endregion
}
