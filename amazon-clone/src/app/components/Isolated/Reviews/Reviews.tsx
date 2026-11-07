import { ExtraOrderInfo, Product } from "@/app/types";
import React, { useEffect, useState } from "react";
import AmazonRating from "../../Shared/AmazonRating";
import StarStack from "../StarStack/StarStack";
import AmazonButton from "../../Shared/AmazonButton";
import { MenuItem, Select } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/types";
import { useParams } from "next/navigation";
import { User } from "lucide-react";

interface ReviewProps {
  productInfo: Product;
}

export default function Reviews(props: ReviewProps) {
  //#region Variables

  const [searchType, setSearchType] = useState<string>("Highest Rating");
  const [sortedReviews, setSortedReviews] = useState<Product["reviews"]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const firebaseUserData = useSelector((state: RootState) => state.user);
  const [productInfo, setProductInfo] = useState<Product | null>(null);
  const [orderInfo, setOrderInfo] = useState<ExtraOrderInfo | null>(null);
  const params = useParams();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  //#endregion

  //#region Methods

  const sortReviews = (
    reviews: Product["reviews"] | undefined,
    type: string
  ) => {
    if (!reviews) return [];

    return [...reviews].sort((a, b) => {
      switch (type) {
        case "Lowest Rating":
          return a.rating - b.rating;
        case "Highest Rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "In Stock":
        return "green";
      case "Low Stock":
        return "var(--amazonOrange)";
      case "Out of Stock":
        return "red";
    }
  };

  //#endregion

  //#region Hooks

  useEffect(() => {
    if (props.productInfo?.reviews) {
      setSortedReviews(sortReviews(props.productInfo.reviews, searchType));
    }
  }, [searchType, props.productInfo]);

  //#endregion

  return (
    <div className="w-full font-ember p-10">
      {/* Reviews Container */}
      <div className="pt-4 flex">
        {/* Summary */}
        <div className="w-[20%]">
          <div className="text-2xl font-ember">Customer Reviews</div>
          <AmazonRating rating={props?.productInfo?.rating} size="large" />
          <div className="text-[grey] font-ember">
            {`${props?.productInfo?.reviews?.length} reviews`}
          </div>
          <StarStack
            rating={props?.productInfo?.rating}
            reviews={props?.productInfo?.reviews}
          />
          <hr className="w-full border-[var(--amazonGrey))]" />
          <div className="text-xl font-emberThin font-bold my-2">
            Review this product
          </div>
          <div className="text-xs font-ember my-2">
            Share your thoughts with other customers
          </div>
          <AmazonButton
            type="outlined"
            onClick={() => {}}
            disabled
            text="Write a customer review"
            full
          />
        </div>
        {/* Reviews List */}
        <div className="px-4 md:px-20 w-full">
          <div className="font-sans font-semibold text-xl">
            Top reviews from other buyers
          </div>
          <div className="my-2">
            <Select
              size="small"
              value={searchType}
              label=""
              onChange={(e) => {
                setSearchType(e.target.value);
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    overflow: "auto",
                  },
                },
              }}
            >
              <MenuItem value={"Highest Rating"}>Highest Rating</MenuItem>
              <MenuItem value={"Lowest Rating"}>Lowest Rating</MenuItem>
            </Select>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="font-emberCondensed text-sm">
              {sortedReviews.map((item, index) => (
                <div key={index} className="my-10">
                  <div className="flex items-center gap-2">
                    <User className="text-gray-400" />
                    <span className="font-emberThin font-bold">
                      {item.reviewerName}
                    </span>
                  </div>
                  <div className="mt-1">
                    <AmazonRating rating={item.rating} size="small" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Reviewed on{" "}
                    {new Date(item.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="mt-2 font-emberCondensed">{item.comment}</div>
                </div>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
