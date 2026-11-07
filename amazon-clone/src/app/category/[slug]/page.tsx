import ProductGrid from "../../components/Shared/ProductGrid";
import HelperFunctions from "../../services/Helpers";
import { StoreService } from "../../services/StoreService";
import { ProductResponse } from "../../types";

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  let results: ProductResponse | null = null;
  let failed = false;

  try {
    results = await StoreService.getProductsByCategory(slug);
  } catch {
    failed = true;
  }

  return (
    <div className="font-ember min-h-screen w-full bg-[var(--amazonGrey)] flex justify-center p-4">
      <div className="w-full max-w-[1500px] mt-2">
        <h1 className="text-xl font-emberThin font-bold mb-3">
          {HelperFunctions.formatDepartmentName(decodeURIComponent(slug))}
        </h1>
        {failed && (
          <div className="text-sm text-red-600">
            This category is unavailable right now. Please try again.
          </div>
        )}
        {results && results.products?.length === 0 && (
          <div className="text-sm">No products in this category.</div>
        )}
        {results && results.products?.length > 0 && (
          <ProductGrid products={results.products} />
        )}
      </div>
    </div>
  );
}
