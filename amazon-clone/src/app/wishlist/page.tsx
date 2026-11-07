"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SignInPrompt from "../components/Shared/SignInPrompt";
import WishlistDisplay from "../components/Shared/WishlistDisplay";
import { StoreService } from "../services/StoreService";
import { Product, RootState } from "../types";

export default function Wishlist() {
  //#region Variables

  const { authInfo, isReady } = useSelector((state: RootState) => state.auth);
  const wishlist = useSelector(
    (state: RootState) => state.user.userData?.wishlist
  );
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState("");

  //#endregion

  //#region Hooks

  // The user document is live, so adds and removes elsewhere refresh this too.
  useEffect(() => {
    if (!wishlist) return;
    StoreService.getWishlistProducts(wishlist)
      .then((result: { productData: Product }[]) =>
        setProducts(result.map((item) => item.productData))
      )
      .catch((fetchError: unknown) => {
        console.error("Error loading wishlist:", fetchError);
        setError("We couldn't load your Wish List. Please try again.");
      });
  }, [wishlist]);

  //#endregion

  if (!isReady) return null;
  if (!authInfo) {
    return <SignInPrompt message="Sign in to see your Wish List." />;
  }

  return (
    <div className="font-ember min-h-screen w-full bg-[var(--amazonGrey)] flex justify-center p-4">
      <div className="w-full max-w-[1500px] mt-2 bg-white shadow-md p-4 h-fit">
        <h1 className="text-2xl font-emberThin font-bold mb-3">Your Wish List</h1>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {products && (
          <WishlistDisplay wishlistData={products} />
        )}
        {products && products.length === 0 && (
          <div className="text-center text-sm">
            <Link href="/" className="text-[var(--amazonLink)] hover:underline">
              Keep shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
