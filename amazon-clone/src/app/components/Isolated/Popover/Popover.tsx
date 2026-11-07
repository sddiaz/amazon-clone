import { useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import Overlay from "../../Shared/Overlay";
import AmazonButton from "../../Shared/AmazonButton";
import Divider from "@mui/material/Divider";
import AmazonLink from "../../Shared/AmazonLink";
import FirebaseService from "../../../services/FirebaseService";

export default function Popover(props: {
  children: ReactNode;
  isUserSignedIn: boolean;
}) {
  
  //#region Variables

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  //#endregion

  //#region Methods

  //#endregion

  //#region Hooks

  //#endregion

  return (
    <div onMouseEnter={() => setIsOpen(false)}>
      <div
        className="relative select-none"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {props?.children}
        {isOpen && (
          <>
            <div className="z-50 absolute top-full right-0 w-[200px] rounded shadow-lg">
              {/* Arrow */}
              <div className="absolute z-10 bg-white w-4 h-4 transform rotate-45 right-[10px]" />
              <div className="relative z-10 p-4 rounded bg-white mt-1 text-black text-[12px] font-emberThin">
                {!props?.isUserSignedIn && (
                  <>
                    <AmazonButton
                      full
                      type="standard"
                      text="Sign In"
                      onClick={() => router.push("/sign-in")}
                    />
                    <div className="flex w-full justify-center my-2">
                      New User?&nbsp;
                      <AmazonLink text="Start Here" href="/sign-in" />
                    </div>
                    <Divider />
                  </>
                )}
                <div className="font-emberThin text-[14px] flex justify-start flex-col font-semibold">
                  Your Account
                  <ul className="font-light">
                    <li>
                      <AmazonLink href="/account" text="Account" defaultColor />
                    </li>
                    <li>
                      <AmazonLink href="/orders" text="Orders" defaultColor />
                    </li>
                    <li>
                      <AmazonLink
                        disabled
                        href=""
                        text="Recommendations"
                        defaultColor
                      />
                    </li>{" "}
                    <li>
                      <AmazonLink
                        href="/wishlist"
                        text="Wish List"
                        defaultColor
                      />
                    </li>{" "}
                    <li>
                      <AmazonLink
                        disabled
                        href=""
                        text="Music Library"
                        defaultColor
                      />
                    </li>{" "}
                    <li>
                      <AmazonLink
                        disabled
                        href=""
                        text="Prime Membership"
                        defaultColor
                      />
                    </li>{" "}
                    <li>
                      <AmazonLink
                        disabled
                        href=""
                        text="Start Selling"
                        defaultColor
                      />
                    </li>{" "}
                    <li>
                      <AmazonLink disabled href="" text="Kindle" defaultColor />
                    </li>{" "}
                    <li>
                      <AmazonLink
                        disabled
                        href=""
                        text="Content & Devices"
                        defaultColor
                      />
                    </li>
                    {props?.isUserSignedIn && (
                      <li onClick={() => FirebaseService.signOut()}>
                        <AmazonLink
                          href="/sign-in"
                          text="Sign Out"
                          defaultColor
                        />
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {isOpen && <Overlay />}
    </div>
  );
}
