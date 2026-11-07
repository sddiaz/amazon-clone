"use client";

import Image from "next/image";
import AmazonLogo from "../../../public/amazon-logo-black.jpeg";
import Link from "next/link";
import { useState } from "react";
import Alert from "../components/Shared/Alert";
import AmazonButton from "../components/Shared/AmazonButton";
import { useRouter } from "next/navigation";
import GoogleButton from "../components/Isolated/GoogleSignInButton/GoogleButton";
import AmazonLink from "../components/Shared/AmazonLink";
import FirebaseService from "../services/FirebaseService";

export default function SignIn() {
  //#region Variables

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [password, setPassword] = useState("");
  const [passwordFlow, setPasswordFlow] = useState(false);

  //#endregion

  //#region Methods

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      const result = await FirebaseService.googleSignInUp();
      const user = result;
      if (user) {
        router.push("/"); // Redirect to home page
      }
    } catch (error) {
      setError("Failed to sign in with Google");
    }
  };

  const handleContinue = async () => {
    const input = document.querySelector(
      'input[type="email"]'
    ) as HTMLInputElement;

    if (email === "") {
      setError("Enter your email");
    } else if (!input?.validity.valid) {
      setError("Wrong or Invalid email address. Please correct and try again.");
    } else {
      // Check if email exists in users
      const { doesEmailExist, emailType } = await FirebaseService.findUserByEmail(email);
      if (doesEmailExist) {
        if (emailType != "google.com") {
          setError("");
          setPasswordFlow(true);
        }
        else {
          setError("You already have a Google email with us, please sign in with Google."); 
        }
      } else {
        setError("No account found with this email.");
      }
    }
  };

  const handleForgotPassword = async () => {
    setNotice("");
    if (email === "") {
      setError("Enter your email first");
      return;
    }
    try {
      await FirebaseService.resetPassword(email);
      setError("");
      setNotice(
        "If an account exists for this email, a password reset link is on its way."
      );
    } catch {
      setError("Could not send a reset email. Please try again.");
    }
  };

  const handleSignIn = async () => {
    try {
      setError("");
      const result = await FirebaseService.signIn(email, password);
      const user = result;
      if (user) {
        router.push("/"); // Redirect to home page
      }
    } catch (error) {
      setError("Failed to sign in with email and password");
    }
  };

  //#endregion

  //#region Hooks

  //#endregion

  return (
    <div className="bg-white min-h-screen flex flex-col items-center select-none text-black font-ember text-[13px]">
      <Link href={"/"}>
        <Image width={100} alt="Amazon Logo" src={AmazonLogo} />
      </Link>
      <div className="">
        <div className="border rounded-md mt-4 p-10 w-[350px]">
          <h1 className="font-emberThin text-[28px]">Sign in</h1>
          {notice && <div className="text-green-700 my-2">{notice}</div>}
          {!passwordFlow && (
            <>
              <div className="font-emberThin">Email or mobile phone number</div>
              <input
                required
                className={`my-2 border border-black rounded-md amazon-focus w-full text-black text-sm p-1 font-normal`}
                onChange={(e) => setEmail(e?.target?.value)}
                value={email}
                type="email"
                placeholder=""
              />
              <Alert type="error" message={error} isActive={error !== ""} />
              <AmazonButton
                full
                type="standard"
                text={"Continue"}
                onClick={handleContinue}
              />
              <div className="my-2 flex justify-center">or</div>
              {/* Google Sign In Button */}
              <div className="flex justify-center">
                <GoogleButton onClick={handleGoogleSignIn} />
              </div>

              <div className="my-2">
                By continuing with this (and most apps), you're agreeing to some
                <AmazonLink
                  word
                  href="https://nordvpn.com/blog/targeted-advertising/"
                  text="Conditions"
                />
                that you'll never actually read.
              </div>
              <AmazonLink
                style="flex justify-center"
                href=""
                text="Forgot your Password?"
                onClick={handleForgotPassword}
              />
            </>
          )}
          {passwordFlow && (
            <>
              <div className="flex justify-between">
                {email}
                <AmazonLink
                  style="flex justify-center"
                  href="/sign-in"
                  text="Not You?"
                />
              </div>{" "}
              <div className="flex justify-between mt-6">
                <div className="font-emberThin font-bold">Password</div>
                <AmazonLink
                  style="flex justify-center"
                  href=""
                  text="Forgot your Password?"
                  onClick={handleForgotPassword}
                />
              </div>
              <input
                required
                className={`my-2 border border-black rounded-md amazon-focus w-full text-black text-sm p-1 font-normal`}
                onChange={(e) => setPassword(e?.target?.value)}
                value={password}
                type="password"
                placeholder=""
              />
              <Alert type="error" message={error} isActive={error !== ""} />
              <AmazonButton
                full
                type="standard"
                text={"Sign in"}
                onClick={handleSignIn}
              />
            </>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 w-full my-6 text-[12px]">
          <div className="w-full h-[1px] bg-black"></div>
          <span className="whitespace-nowrap">New to Amazon Clone?</span>
          <div className="w-full h-[1px] bg-black"></div>
        </div>
        <AmazonButton
          full
          type="outlined"
          text="Create Account"
          onClick={() => router.push("/sign-up")}
        />
      </div>
    </div>
  );
}
