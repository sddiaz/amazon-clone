import { PageSpinner } from "./components/Shared/Spinner";

// Shown by Next.js while any route segment is loading.
export default function Loading() {
  return <PageSpinner />;
}
