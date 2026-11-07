"use client";

import { RootState } from "@/app/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../styles/globals.css";
import Popover from "../Popover/Popover";

const Greeting = () => {
  //#region Variables

  const reduxStoreAuth = useSelector((state: RootState) => state.auth);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  //#endregion

  //#region Methods & Helper Functions

  //#endregion

  //#region Hooks

  useEffect(() => {
    if (reduxStoreAuth) {
      const isLoggedIn =
        reduxStoreAuth?.authInfo?.email &&
        reduxStoreAuth?.authInfo?.providerId &&
        reduxStoreAuth?.authInfo?.uid
          ? true
          : false;

      setIsUserSignedIn(isLoggedIn);
    }
  }, [reduxStoreAuth]);

  //#endregion

  return (
    <div>
      <Popover isUserSignedIn={isUserSignedIn}>
        <Link
          href={isUserSignedIn ? "/account" : "/sign-in"}
          className="relative z-50"
        >
          <span className="select-none cursor-pointer w-[135px] h-[90%] flex flex-shrink-0 whitespace-nowrap flex-col p-[10px] text-[12px] hover-border text-white items-start justify-start font-emberThin">
            <span className="whitespace-nowrap">
              Hello,{" "}
              {reduxStoreAuth
                ? reduxStoreAuth?.authInfo?.displayName
                : "Sign in"}
            </span>
            <div className="leading-[1] flex items-center justify-center heading">
              <span className="whitespace-nowrap font-emberThin font-bold">Account & Lists</span>
              <ChevronDown size={15} />
            </div>
          </span>
        </Link>
      </Popover>
    </div>
  );
};

export default Greeting;
