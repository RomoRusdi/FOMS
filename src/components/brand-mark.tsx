import { cn } from "@/lib/utils";

/** The "K" logo square (placeholder for PT Kecap logo, per handoff Assets note). */
export function BrandMark({
  size = 32,
  radius = 9,
  className,
  variant = "brand",
}: {
  size?: number;
  radius?: number;
  className?: string;
  /** brand = blue on navy bars; navy = navy on light; paper = white square, navy "K". */
  variant?: "brand" | "navy" | "paper";
}) {
  const styles =
    variant === "paper"
      ? "bg-white text-navy"
      : variant === "navy"
        ? "bg-navy text-white"
        : "bg-brand text-white";
  return (
    <div
      className={cn(
        "flex flex-none items-center justify-center font-extrabold",
        styles,
        className,
      )}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        fontSize: Math.round(size * 0.5),
      }}
    >
      K
    </div>
  );
}
