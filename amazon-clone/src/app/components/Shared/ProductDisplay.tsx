import React, { useEffect, useState } from "react";
import { StoreService } from "../../services/StoreService";
import DepartmentData from "../../../../public/data/departments.json";
import HelperFunctions from "../../services/Helpers";
import { Department, ProductResponse } from "@/app/types";
import Link from "next/link";
import Image from "next/image";
import AmazonButton from "./AmazonButton";
import { RefreshCwIcon } from "lucide-react";
interface ProductDisplayProps {
  type: string;
}

export default function ProductDisplay(props: ProductDisplayProps) {

  //#region Variables

  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState<Department[]>();
  const [departmentData, setDepartmentData] = useState<ProductResponse[]>();

  //#endregion

  //#region Methods

  // For UI appeal, we fetch 4 random images from 7 different categories and display them.
  
  const fetchProducts = async () => {
    try {
      // Obtain data from 7 random departments
      const randomIndices = HelperFunctions.getRandomIndices(
        DepartmentData.length,
        7
      );
      const selectedDepartments = DepartmentData.filter((value, index) =>
        randomIndices.includes(index)
      );
      setDepartments(selectedDepartments as Department[]);
      const selectedDepartmentData = await Promise.all(
        selectedDepartments.map((dept) =>
          StoreService.getProductsByCategory(dept.name, 4)
        )
      );
      if (selectedDepartmentData) {
        setDepartmentData(selectedDepartmentData as []);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //#endregion

  //#region Hooks

  //#endregion

  return (
    <div className="relative -mt-[70px] sm:-mt-[100px] md:-mt-[120px] lg:-mt-[350px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {departmentData?.map((department) => (
          <div
            key={department.products[0]?.category}
            className="bg-white shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4">
              <h2 className="font-emberThin font-bold text-xl">
                {HelperFunctions.formatDepartmentName(
                  department?.products[0]?.category
                )}
              </h2>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2">
              {department?.products?.map((product) => (
                <div
                  key={product.title}
                  className="aspect-square relative group"
                >
                  <Link
                    href={`/product/${product.id}`}
                    className="block w-full h-full relative"
                  >
                    <Image
                      loading="lazy"
                      alt={product.title}
                      src={product.images[0]}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </Link>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50">
              <button
                className="w-full text-sm text-blue-600 hover:text-blue-800 hover:underline font-emberBold flex items-center justify-center gap-2"
                onClick={() => console.log(department.products[0]?.category)}
              >
                See more
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {(departmentData?.length as number) > 0 && (
          <div className="flex flex-col select-none w-full sm:w-[25%]">
            <AmazonButton
              type="standard"
              onClick={() => fetchProducts()}
              icon={<RefreshCwIcon />}
            />
          </div>
        )}
      </div>
    </div>
  );
}
