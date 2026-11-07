"use client";
import React from "react";
import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  size?: string;
}

export default function AmazonRating(props: RatingProps) {
  //#region Variables

  const fullStars = Math.floor(props.rating);
  const hasHalfStar = props.rating % 1 >= 0.5;

  //#endregion

  //#region Methods

  const getStarColor = (index: number) => {
    if (index < fullStars || (index === fullStars && hasHalfStar)) {
      return "fill-[var(--amazonOrange)]";
    }
    return "text-gray-200 fill-gray-200";
  };

  //#endregion

  return (
    <div className="flex items-center gap-0.5 align-center">
      <div className={`${props?.size == "large" ? "order-1" : "order-2"} flex`}>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={props?.size == "large" ? 24 : 16}
            className={getStarColor(index)}
            strokeWidth={0}
          />
        ))}
      </div>

      <div
        className={`${
          props?.size == "large" ? "text-xs" : "text-xs"
        } ml-1 mt-1 order-1 font-emberThin text-nowrap`}
      >
        {props.rating.toString() + (props?.size == "large" ? " out of 5" : "")}
      </div>
    </div>
  );
}
