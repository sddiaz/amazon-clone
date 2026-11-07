"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SignInPrompt from "../components/Shared/SignInPrompt";
import { PageSpinner } from "../components/Shared/Spinner";
import FirebaseService from "../services/FirebaseService";
import { PlacedOrder, RootState } from "../types";

export default function Orders() {
  //#region Variables

  const { authInfo, isReady } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<PlacedOrder[] | null>(null);
  const [error, setError] = useState("");

  //#endregion

  //#region Hooks

  useEffect(() => {
    if (!authInfo?.uid) return;
    FirebaseService.getOrders(authInfo.uid)
      .then((result: PlacedOrder[]) => setOrders(result))
      .catch((fetchError: unknown) => {
        console.error("Error loading orders:", fetchError);
        setError("We couldn't load your orders. Please try again.");
      });
  }, [authInfo?.uid]);

  //#endregion

  if (!isReady) return <PageSpinner />;
  if (!authInfo) {
    return <SignInPrompt message="Sign in to see your orders." />;
  }

  return (
    <div className="font-ember min-h-screen w-full bg-[var(--amazonGrey)] flex justify-center p-4">
      <div className="w-full max-w-[1000px] mt-2">
        <h1 className="text-2xl font-emberThin font-bold mb-3">Your Orders</h1>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!orders && !error && <PageSpinner />}
        {orders && orders.length === 0 && (
          <div className="bg-white shadow-md p-4 text-sm">
            You haven&apos;t placed any orders yet.{" "}
            <Link href="/" className="text-[var(--amazonLink)] hover:underline">
              Start shopping
            </Link>
          </div>
        )}
        <div className="flex flex-col gap-4">
          {orders?.map((order) => (
            <div key={order.id} className="bg-white shadow-md">
              <div className="bg-gray-100 p-3 text-xs text-gray-700 flex flex-wrap gap-x-8 gap-y-1">
                <div>
                  <div className="uppercase">Order placed</div>
                  <div>
                    {new Date(order.orderDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <div className="uppercase">Total</div>
                  <div>${order.total.toFixed(2)}</div>
                </div>
                <div className="break-all">
                  <div className="uppercase">Order #</div>
                  <div>{order.id}</div>
                </div>
              </div>
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 p-3 border-t border-gray-200"
                >
                  <div className="relative w-20 h-20 shrink-0">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.productId}`}
                      className="text-sm font-bold text-[var(--amazonLink)] hover:underline"
                    >
                      {item.title}
                    </Link>
                    <div className="text-xs text-gray-600">
                      Qty: {item.quantity} · ${item.price.toFixed(2)} each
                    </div>
                    <Link
                      href={`/product/${item.productId}`}
                      className="inline-block mt-2 text-xs bg-yellow-400 hover:bg-yellow-500 rounded-2xl px-3 py-1"
                    >
                      Buy it again
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
