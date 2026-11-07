import { UserData } from "@/app/types";
import React, { useEffect, useState } from "react";
import AmazonLink from "./AmazonLink";

interface AddressDisplayProps {
    userData: UserData; 
}

const AddressDisplay = (props: AddressDisplayProps) => {

    //#region Variables

    const [address, setAddress] = useState(""); 

    //#endregion

  useEffect(() => {
    if (props?.userData) {
        const getDisplayAddress = () => {
            // Check for default address
            if (props?.userData?.defaultAddress) {
              const addr = props?.userData.defaultAddress;
              setAddress(`${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`);
            }
            // Check for first address in addressBook
            else if (props?.userData?.addressBook?.length > 0) {
              const addr = props?.userData.addressBook[0];
              setAddress(`${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`);
            }
        };

        if (address == "") {
            getDisplayAddress(); 
        }
    }
  }, [props?.userData]);

  return (
    <span>
      {address == "" ? (
        <AmazonLink href="/profile" text="No Address Found, Please Add One" />
      ) : (
        <span>
          Delivering to {address}
        </span>
      )}
    </span>
  );
};

export default AddressDisplay;
