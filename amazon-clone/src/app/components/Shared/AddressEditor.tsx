"use client";

import { Address } from "@/app/types";
import FirebaseService from "@/app/services/FirebaseService";
import { useState } from "react";
import AmazonButton from "./AmazonButton";
import { Spinner } from "./Spinner";

type AddressForm = { street: string; city: string; state: string; zip: string };

const emptyForm: AddressForm = { street: "", city: "", state: "", zip: "" };

const inputClassName =
  "border border-black rounded-md amazon-focus w-full text-black text-sm p-1 font-normal";

export default function AddressEditor(props: {
  uid: string;
  address: Partial<Address> | null | undefined;
}) {
  //#region Variables

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const saved = props.address;
  const hasAddress = Boolean(saved?.street && saved?.city);

  //#endregion

  //#region Methods

  const startEditing = () => {
    setForm({
      street: saved?.street ?? "",
      city: saved?.city ?? "",
      state: saved?.state ?? "",
      zip: saved?.zip !== undefined ? String(saved.zip) : "",
    });
    setError("");
    setIsEditing(true);
  };

  const save = async () => {
    const street = form.street.trim();
    const city = form.city.trim();
    const state = form.state.trim().toUpperCase();
    const zip = form.zip.trim();
    if (!street || !city) {
      setError("Enter a street address and city.");
      return;
    }
    if (!/^[A-Z]{2}$/.test(state)) {
      setError("Enter the state as two letters, like GA.");
      return;
    }
    if (!/^\d{5}$/.test(zip)) {
      setError("Enter a 5-digit ZIP code.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await FirebaseService.updateDefaultAddress(props.uid, {
        street,
        city,
        state,
        zip,
      });
      setIsEditing(false);
    } catch (saveError) {
      console.error("Error saving address:", saveError);
      setError("We couldn't save your address. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const setField = (field: keyof AddressForm, value: string) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  //#endregion

  return (
    <div id="address" className="flex flex-col gap-2 scroll-mt-20">
      <div className="text-gray-500 text-xs">Delivery address</div>
      {!isEditing && (
        <>
          <div className="text-sm">
            {hasAddress
              ? `${saved?.street}, ${saved?.city}, ${saved?.state} ${saved?.zip}`
              : "No delivery address yet"}
          </div>
          <AmazonButton
            type="outlined"
            text={hasAddress ? "Edit address" : "Add address"}
            full
            onClick={startEditing}
          />
        </>
      )}
      {isEditing && (
        <div className="flex flex-col gap-2 text-sm">
          <label className="flex flex-col gap-1">
            Street address
            <input
              className={inputClassName}
              value={form.street}
              onChange={(e) => setField("street", e.target.value)}
              autoComplete="address-line1"
            />
          </label>
          <label className="flex flex-col gap-1">
            City
            <input
              className={inputClassName}
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              autoComplete="address-level2"
            />
          </label>
          <div className="flex gap-2">
            <label className="flex flex-col gap-1 w-1/3">
              State
              <input
                className={inputClassName}
                value={form.state}
                maxLength={2}
                onChange={(e) => setField("state", e.target.value)}
                autoComplete="address-level1"
              />
            </label>
            <label className="flex flex-col gap-1 flex-1">
              ZIP code
              <input
                className={inputClassName}
                value={form.zip}
                inputMode="numeric"
                maxLength={5}
                onChange={(e) => setField("zip", e.target.value)}
                autoComplete="postal-code"
              />
            </label>
          </div>
          {error && <div className="text-xs text-red-600">{error}</div>}
          <div className="flex gap-2">
            <AmazonButton
              type="close"
              text="Cancel"
              full
              disabled={isSaving}
              onClick={() => setIsEditing(false)}
            />
            <AmazonButton
              type="standard"
              text={isSaving ? "Saving" : "Save address"}
              icon={
                isSaving ? (
                  <Spinner size={16} tone="inherit" className="ml-2" />
                ) : undefined
              }
              full
              disabled={isSaving}
              onClick={save}
            />
          </div>
        </div>
      )}
    </div>
  );
}
