import { Loader2 } from "lucide-react";

type SpinnerProps = {
  size?: number;
  // "inherit" uses the surrounding text color, e.g. inside a yellow button
  tone?: "orange" | "inherit";
  className?: string;
};

export function Spinner({ size = 24, tone = "orange", className = "" }: SpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label="Loading"
      size={size}
      className={`animate-spin ${
        tone === "orange" ? "text-[var(--amazonOrange)]" : ""
      } ${className}`}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center">
      <Spinner size={40} />
    </div>
  );
}
