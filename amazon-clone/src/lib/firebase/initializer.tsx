"use client";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, firestoreDb } from "./config";
import { useDispatch } from "react-redux";
import { setAuthInfo, clearAuthInfo } from "@/app/state/slices/auth-slice";
import { UserInfo } from "firebase/auth";
import { Address, UserData } from "@/app/types";
import { setUserData } from "@/app/state/slices/user-slice";
import FirebaseService from "@/app/services/FirebaseService";

export default function FirebaseInitializer() {
  const auth = getAuth(app);
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribeCart: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Auth info
        const userInfo: UserInfo = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          providerId: user.providerId,
        };

        const userRef = firestoreDb.collection("users").doc(userInfo.uid);
        const userDoc = await userRef.get();
        FirebaseService.indexEmail(
          user.email,
          user.providerData[0]?.providerId
        ).catch((error) => console.warn("Email index not updated", error));

        if (!userDoc.exists) {
          const userData: UserData = {
            addressBook: [],
            cart: [],
            defaultAddress: {} as Address,
            email: user.email as string,
            favorites: [],
            firstName: user.displayName?.split(" ")[0],
            lastName: user.displayName?.split(" ")[1],
            uid: user.uid,
            authProvider: user.providerData[0].providerId,
            wishlist: []
          };
          await userRef.set(userData);
          dispatch(setAuthInfo(userInfo));
          dispatch(setUserData(userData));
        } else {
          dispatch(setAuthInfo(userInfo));
          dispatch(setUserData(userDoc.data()));
        }

        // Set up cart listener
        unsubscribeCart = userRef.onSnapshot((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            dispatch(setUserData(userData));
          }
        });
      } else {
        dispatch(clearAuthInfo());
        // Clean up cart listener when user logs out
        if (unsubscribeCart) {
          unsubscribeCart();
        }
      }
    });

    // Clean up both listeners on unmount
    return () => {
      unsubscribeAuth();
      if (unsubscribeCart) {
        unsubscribeCart();
      }
    };
  }, [dispatch]);

  return null;
}
