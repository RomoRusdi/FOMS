import { cn } from "@/lib/utils";

/**
 * Floating "folder" loader (adapted from Uiverse.io by TheAbieza),
 * recolored to the FOMS navy/blue theme.
 */
export function Loader({
  label = "Memuat…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex w-fit flex-col items-center", className)}>
      <div className="animate-folder-float mx-auto w-min">
        {/* tab */}
        <div className="h-3 w-[60px] rounded-tr-[10px] bg-brand" />
        {/* body */}
        <div className="h-[70px] w-[100px] rounded-tr-[8px] bg-[#7ba0f2] shadow-[5px_5px_0_0_#14294a]" />
      </div>
      {label && (
        <div className="mt-4 text-center text-[13px] font-medium text-muted-foreground">
          {label}
        </div>
      )}
    </div>
  );
}
