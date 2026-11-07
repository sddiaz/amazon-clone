import ProductGrid from "../components/Shared/ProductGrid";
import { StoreService } from "../services/StoreService";
import { ProductResponse } from "../types";

export const metadata = { title: "Search - Amazon Clone" };

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = ((await props.searchParams).q ?? "").trim();
  let results: ProductResponse | null = null;
  let failed = false;

  if (query) {
    try {
      results = await StoreService.searchProducts(query);
    } catch {
      failed = true;
    }
  }

  return (
    <div className="font-ember min-h-screen w-full bg-[var(--amazonGrey)] flex justify-center p-4">
      <div className="w-full max-w-[1500px] mt-2">
        <h1 className="text-xl font-emberThin font-bold mb-3">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {!query && <div className="text-sm">Type something in the search bar.</div>}
        {failed && (
          <div className="text-sm text-red-600">
            Search is unavailable right now. Please try again.
          </div>
        )}
        {results && results.products.length === 0 && (
          <div className="text-sm">No products matched your search.</div>
        )}
        {results && results.products.length > 0 && (
          <ProductGrid products={results.products} />
        )}
      </div>
    </div>
  );
}
