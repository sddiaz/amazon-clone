"use client";

import { Product } from "@/app/types";

interface StarStackProps {
  reviews: Product["reviews"];
  rating: number;
}
export default function StarStack(props: StarStackProps) {


  //#region Methods

  const getRatingPercentage = (rating: number) => {
    const totalReviews = props?.reviews?.length; 
    const count = props?.reviews?.filter((item) => Math.floor(item.rating) === rating).length;
    return totalReviews ? ((count / totalReviews) * 100).toFixed(1) : 0;
  };

  //#endregion
  return (
    <div className="py-4 w-full space-y-3">
    {Array.from({ length: 5 }, (_, index) => {
      const rating = 5 - index;
      const percentage = getRatingPercentage(rating);

      return (
        <div key={rating} className="flex items-center space-x-4 justify-start">
          <div className="w-6 text-right font-semibold">{rating}</div>

          <div className="flex-1 h-4 bg-gray-200 rounded-md overflow-hidden">
            <div
              className="h-full bg-[var(--amazonOrange)] transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="w-12 text-right text-sm font-medium font-ember">{percentage}%</div>
        </div>
      );
    })}
  </div>
  );
}
