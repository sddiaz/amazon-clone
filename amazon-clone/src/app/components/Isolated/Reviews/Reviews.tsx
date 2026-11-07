import { Product } from "@/app/types";
import React, { useEffect, useState } from "react";
import AmazonRating from "../../Shared/AmazonRating";
import StarStack from "../StarStack/StarStack";
import AmazonButton from "../../Shared/AmazonButton";
import { MenuItem, Rating, Select } from "@mui/material";
import Link from "next/link";
import FirebaseService from "@/app/services/FirebaseService";
import { useSelector } from "react-redux";
import { RootState } from "@/app/types";
import { User } from "lucide-react";

interface ReviewProps {
  productInfo: Product;
}

export default function Reviews(props: ReviewProps) {
  //#region Variables

  const [searchType, setSearchType] = useState<string>("Highest Rating");
  const [sortedReviews, setSortedReviews] = useState<Product["reviews"]>([]);
  const authInfo = useSelector((state: RootState) => state.auth)?.authInfo;
  const [userReviews, setUserReviews] = useState<Product["reviews"]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newRating, setNewRating] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const isSignedIn = Boolean(authInfo?.uid);

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

  const submitReview = async () => {
    if (!newRating) {
      setFormError("Please select a star rating.");
      return;
    }
    if (!newComment.trim()) {
      setFormError("Please write a few words about the product.");
      return;
    }
    setIsSubmitting(true);
    setFormError("");
    try {
      const saved = await FirebaseService.addReview({
        productId: props.productInfo.id,
        uid: authInfo?.uid,
        reviewerName:
          authInfo?.displayName || authInfo?.email?.split("@")[0] || "Customer",
        rating: newRating,
        comment: newComment.trim(),
      });
      setUserReviews((prev) => [saved as Product["reviews"][number], ...prev]);
      setNewRating(null);
      setNewComment("");
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving review:", error);
      setFormError("Could not save your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  //#endregion

  //#region Hooks

  useEffect(() => {
    if (!props.productInfo?.id) return;
    FirebaseService.getReviews(props.productInfo.id)
      .then((reviews: Product["reviews"]) => setUserReviews(reviews))
      .catch((error: unknown) =>
        console.warn("Customer reviews unavailable", error)
      );
  }, [props.productInfo?.id]);

  useEffect(() => {
    if (props.productInfo?.reviews) {
      setSortedReviews(
        sortReviews(
          [...userReviews, ...props.productInfo.reviews],
          searchType
        )
      );
    }
  }, [searchType, props.productInfo, userReviews]);

  //#endregion

  return (
    <div className="w-full font-ember p-4 md:p-10">
      {/* Reviews Container */}
      <div className="pt-4 flex flex-col md:flex-row gap-6">
        {/* Summary */}
        <div className="w-full md:w-[20%]">
          <div className="text-2xl font-ember">Customer Reviews</div>
          <AmazonRating rating={props?.productInfo?.rating} size="large" />
          <div className="text-[grey] font-ember">
            {`${sortedReviews.length} reviews`}
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
          {isSignedIn ? (
            <AmazonButton
              type="outlined"
              onClick={() => setIsFormOpen((open) => !open)}
              text={isFormOpen ? "Cancel" : "Write a customer review"}
              full
            />
          ) : (
            <Link href="/sign-in">
              <AmazonButton
                type="outlined"
                onClick={() => {}}
                text="Sign in to write a review"
                full
              />
            </Link>
          )}
          {isFormOpen && (
            <div className="mt-4 flex flex-col gap-2">
              <Rating
                value={newRating}
                onChange={(_, value) => setNewRating(value)}
              />
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="What did you like or dislike?"
                className="w-full border border-gray-400 rounded p-2 text-sm"
              />
              {formError && (
                <div className="text-xs text-red-600">{formError}</div>
              )}
              <AmazonButton
                type="standard"
                onClick={submitReview}
                disabled={isSubmitting}
                text={isSubmitting ? "Submitting..." : "Submit"}
                full
              />
            </div>
          )}
        </div>
        {/* Reviews List */}
        <div className="md:px-10 lg:px-20 w-full">
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
