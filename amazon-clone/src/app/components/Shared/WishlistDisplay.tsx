import { Product, RootState } from "@/app/types";
import Image from "next/image";
import Prime from "../../../../public/prime-logo.png";
import AmazonLink from "./AmazonLink";
import Alert from "./Alert";
import AmazonButton from "./AmazonButton";
import FirebaseService from "@/app/services/FirebaseService";
import { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

interface WishlistDisplayProps {
  wishlistData: Product[];
}

export default function WishlistDisplay(props: WishlistDisplayProps) {
  //#region Variables

  const [alert, setAlert] = useState<string[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const firebaseUserData = useSelector((state: RootState) => state.user);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  //#endregion

  const handleAlert = (type: string, message: string) => {
    setAlert([type, message]);
    setTimeout(() => {
      setAlert([]);
    }, 3000);
  };

  const handleAddToCart = async (id: number) => {
    try {
      const result = await FirebaseService.addItemToCart(
        firebaseUserData?.userData?.uid,
        id,
        selectedQuantity
      );
      if (result) {
        handleAlert("success", "Item Added to Cart.");
      } else {
        handleAlert("error", "Failed to Add Items.");
      }
    } catch (error) {
      console.error("Error fetching product #" + id + ": ", error);
      throw error;
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await FirebaseService.removeItemFromWishlist(
        firebaseUserData?.userData?.uid,
        id
      );
      handleAlert("success", "Item removed from your Wish List.");
    } catch (error) {
      console.error("Error removing product #" + id + ": ", error);
      handleAlert("error", "Could not remove that item.");
    }
  };

  if (!props?.wishlistData?.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p className="text-lg">Your wishlist is empty</p>
        <p className="text-sm">
          Add items to your wishlist to keep track of products you're interested
          in
        </p>
      </div>
    );
  }

  return (
    <>
      <Alert
        type={alert[0] ?? ""}
        message={alert[1] ?? ""}
        isActive={alert.length > 0}
      />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {props?.wishlistData.map((product, index) => {
        if (!product) return null;

        return (
          <div
            key={index}
            className="border-[var(--amazonGrey)] border flex flex-col p-4 font-ember"
          >
            {/* Product Image */}
            <div className="relative pb-4 flex justify-center">
              <Link
                href={`/product/${product.id}`}
              >
                <Image
                  width={100}
                  height={100}
                  alt={product.title}
                  src={product.thumbnail || "/api/placeholder/160/160"}
                  className="object-cover rounded"
                />
              </Link>
            </div>

            {/* Product Title */}
            <div className="text-md font-ember">{product?.title}</div>

            {/* Price */}
            <div className="font-bold"> ${product.price.toFixed(2)}</div>

            <span className="flex text-sm font-emberThin font-bold -ml-4">
              <Image
                src={Prime}
                height={10}
                width={75}
                alt="Prime Logo"
                className="-mr-2"
              />
              Two-Day
            </span>
            <span className="flex text-sm font-emberThin font-bold items-center">
              <AmazonLink
                href="https://www.linkedin.com/in/santiagoddiaz/"
                text="Free Returns"
                style="text-xs ml-1 font-bold"
              />
            </span>

            {/* Stock Status */}
            <div className="text-sm mb-4">
              <span
                className={
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {product.stock > 0 ? `In Stock` : "Out of stock"}
              </span>
            </div>

            {/* Button */}
            <AmazonButton
              full
              text="Add to Cart"
              type="standard"
              onClick={() => handleAddToCart(product?.id)}
              disabled={product?.stock <= 0}
            />
            <div className="mt-2">
              <AmazonButton
                full
                text="Remove"
                type="outlined"
                onClick={() => handleRemove(product?.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
}
