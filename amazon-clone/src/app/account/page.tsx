"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import AmazonButton from "../components/Shared/AmazonButton";
import SignInPrompt from "../components/Shared/SignInPrompt";
import FirebaseService from "../services/FirebaseService";
import { RootState } from "../types";

export default function Account() {
  //#region Variables

  const router = useRouter();
  const { authInfo, isReady } = useSelector((state: RootState) => state.auth);
  const userData = useSelector((state: RootState) => state.user.userData);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState("");

  const signInMethod =
    userData?.authProvider === "google.com" ? "Google" : "Email and password";

  //#endregion

  //#region Methods

  const signOut = async () => {
    await FirebaseService.signOut();
    router.push("/");
  };

  const deleteAccount = async () => {
    setError("");
    try {
      await FirebaseService.deleteAccountAndData();
      router.push("/");
    } catch (deleteError) {
      console.error("Error deleting account:", deleteError);
      setError(
        "We couldn't delete your account. For security, please sign out, sign back in, and try again."
      );
      setIsConfirmingDelete(false);
    }
  };

  //#endregion

  if (!isReady) return null;
  if (!authInfo) {
    return <SignInPrompt message="Sign in to manage your account." />;
  }

  return (
    <div className="font-ember min-h-screen w-full bg-[var(--amazonGrey)] flex justify-center p-4">
      <div className="w-full max-w-[600px] mt-2 bg-white shadow-md p-4 h-fit flex flex-col gap-3">
        <h1 className="text-2xl font-emberThin font-bold">Your Account</h1>
        <div className="text-sm">
          <div className="text-gray-500 text-xs">Name</div>
          <div>{authInfo.displayName || "Not set"}</div>
        </div>
        <div className="text-sm">
          <div className="text-gray-500 text-xs">Email</div>
          <div className="break-all">{authInfo.email}</div>
        </div>
        <div className="text-sm">
          <div className="text-gray-500 text-xs">Sign-in method</div>
          <div>{signInMethod}</div>
        </div>
        <Link href="/orders">
          <AmazonButton type="outlined" text="Your Orders" full onClick={() => {}} />
        </Link>
        <Link href="/wishlist">
          <AmazonButton type="outlined" text="Your Wish List" full onClick={() => {}} />
        </Link>
        <AmazonButton type="outlined" text="Sign out" full onClick={signOut} />
        {error && <div className="text-xs text-red-600">{error}</div>}
        {isConfirmingDelete ? (
          <div className="border border-red-300 rounded p-3 text-sm flex flex-col gap-2">
            This permanently deletes your account, cart and wishlist.
            <div className="flex gap-2">
              <AmazonButton type="close" text="Cancel" full onClick={() => setIsConfirmingDelete(false)} />
              <AmazonButton type="standard" text="Delete my account" full onClick={deleteAccount} />
            </div>
          </div>
        ) : (
          <AmazonButton
            type="close"
            text="Delete account"
            full
            onClick={() => setIsConfirmingDelete(true)}
          />
        )}
      </div>
    </div>
  );
}
