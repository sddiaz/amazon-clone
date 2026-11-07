import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/types";
import AmazonRating from "./AmazonRating";

export default function ProductGrid(props: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {props.products.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.id}`}
          className="bg-white shadow-md p-3 flex flex-col hover:shadow-xl transition-shadow"
        >
          <div className="relative aspect-square w-full">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="mt-2 text-sm font-bold line-clamp-2">
            {product.title}
          </div>
          <AmazonRating rating={product.rating} size="small" />
          <div className="mt-1 text-lg font-emberThin font-bold">
            ${product.price.toFixed(2)}
          </div>
        </Link>
      ))}
    </div>
  );
}
