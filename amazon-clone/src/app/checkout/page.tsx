"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AmazonButton from "../components/Shared/AmazonButton";
import SignInPrompt from "../components/Shared/SignInPrompt";
import { PageSpinner, Spinner } from "../components/Shared/Spinner";
import FirebaseService from "../services/FirebaseService";
import { StoreService } from "../services/StoreService";
import { OrderItem, Product, RootState } from "../types";

type CartLine = { productData: Product; quantity: number };

export default function Checkout() {
  //#region Variables

  const router = useRouter();
  const { authInfo, isReady } = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.user.userData?.cart);
  const [lines, setLines] = useState<CartLine[] | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState("");

  const total =
    lines?.reduce((sum, line) => sum + line.productData.price * line.quantity, 0) ??
    0;

  //#endregion

  //#region Methods

  const placeOrder = async () => {
    if (!authInfo?.uid || !lines?.length) return;
    setIsPlacing(true);
    setError("");
    try {
      const items: OrderItem[] = lines.map((line) => ({
        productId: String(line.productData.id),
        title: line.productData.title,
        price: line.productData.price,
        quantity: line.quantity,
        thumbnail: line.productData.thumbnail,
      }));
      await FirebaseService.placeOrder({
        uid: authInfo.uid,
        items,
        total: Number(total.toFixed(2)),
      });
      router.push("/orders");
    } catch (placeError) {
      console.error("Error placing order:", placeError);
      setError("We couldn't place your order. Please try again.");
      setIsPlacing(false);
    }
  };

  //#endregion

  //#region Hooks

  useEffect(() => {
    if (!cart) return;
    // Keep showing the lines while the cart empties after a successful order.
    if (isPlacing) return;
    StoreService.getCartProducts(cart)
      .then((result: CartLine[]) => setLines(result))
      .catch((fetchError: unknown) =>
        console.error("Error loading cart:", fetchError)
      );
  }, [cart, isPlacing]);

  //#endregion

  if (!isReady) return <PageSpinner />;
  if (!authInfo) {
    return <SignInPrompt message="Sign in to check out." />;
  }

  return (
    <div className="font-ember min-h-screen w-full bg-[var(--amazonGrey)] flex justify-center p-4">
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-4 mt-2">
        <div className="flex-1 bg-white shadow-md p-4">
          <h1 className="text-2xl font-emberThin font-bold mb-2">Checkout</h1>
          {!lines && (
            <div className="flex justify-center py-10">
              <Spinner size={32} />
            </div>
          )}
          {lines && lines.length === 0 && (
            <div className="text-sm">
              Your cart is empty. <Link href="/" className="text-[var(--amazonLink)] hover:underline">Keep shopping</Link>
            </div>
          )}
          {lines?.map((line) => (
            <div
              key={line.productData.id}
              className="flex gap-3 py-3 border-t border-gray-200"
            >
              <div className="relative w-20 h-20 shrink-0">
                <Image
                  src={line.productData.thumbnail}
                  alt={line.productData.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold">{line.productData.title}</div>
                <div className="text-xs text-gray-600">Qty: {line.quantity}</div>
              </div>
              <div className="text-sm font-bold">
                ${(line.productData.price * line.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="md:w-1/3 w-full bg-white shadow-md p-4 h-fit">
          <div className="font-bold font-emberThin text-lg">
            Order total: ${total.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600 my-2">
            This is a demo store. No payment is taken and nothing is shipped.
          </div>
          {error && <div className="text-xs text-red-600 mb-2">{error}</div>}
          <AmazonButton
            full
            type="standard"
            text={isPlacing ? "Placing order" : "Place your order"}
            icon={isPlacing ? <Spinner size={16} tone="inherit" className="ml-2" /> : undefined}
            disabled={isPlacing || !lines?.length}
            onClick={placeOrder}
          />
        </div>
      </div>
    </div>
  );
}
