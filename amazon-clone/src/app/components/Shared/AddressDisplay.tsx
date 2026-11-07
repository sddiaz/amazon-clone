import { UserData } from "@/app/types";
import React from "react";
import AmazonLink from "./AmazonLink";

interface AddressDisplayProps {
  userData: UserData | null;
}

const AddressDisplay = (props: AddressDisplayProps) => {
  const addr = props?.userData?.defaultAddress;
  // New accounts start with an empty address object, so check real fields.
  const hasAddress = Boolean(addr?.street && addr?.city);

  return (
    <span>
      {hasAddress ? (
        <span>
          Delivering to {addr?.street}, {addr?.city}, {addr?.state} {addr?.zip}{" "}
          <AmazonLink href="/account#address" text="Change" />
        </span>
      ) : (
        <AmazonLink href="/account#address" text="Add a delivery address" />
      )}
    </span>
  );
};

export default AddressDisplay;
