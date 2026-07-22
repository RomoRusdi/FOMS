import { Construction } from "lucide-react";

export function PagePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-[18px]">
      <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-2xl border border-line bg-surface px-6 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <Construction className="size-7" />
        </div>
        <div className="text-lg font-extrabold tracking-[-0.01em] text-ink">
          {title}
        </div>
        <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>
        <span className="mt-4 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          Segera hadir
        </span>
      </div>
    </div>
  );
}
