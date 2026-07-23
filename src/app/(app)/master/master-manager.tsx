"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MasterActionResult } from "./actions";

export interface MasterItem {
  id: string;
  primary: string;
  secondary?: string;
}

export interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
}

export function MasterManager({
  title,
  addLabel,
  items,
  fields,
  emptyText,
  onCreate,
  onDelete,
}: {
  title: string;
  addLabel: string;
  items: MasterItem[];
  fields: FieldDef[];
  emptyText: string;
  onCreate: (data: Record<string, string>) => Promise<MasterActionResult>;
  onDelete: (id: string) => Promise<MasterActionResult>;
}) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<MasterItem | null>(null);
  const [pending, startTransition] = useTransition();

  const demoNote = (r: MasterActionResult) =>
    r.ok && r.demo ? "Mode demo — tidak tersimpan." : undefined;

  function submitAdd() {
    startTransition(async () => {
      const res = await onCreate(form);
      if (!res.ok) {
        toast.error("Gagal menambah", { description: res.error });
        return;
      }
      toast.success("Berhasil ditambah", { description: demoNote(res) });
      setAddOpen(false);
      setForm({});
      router.refresh();
    });
  }

  function confirmDelete() {
    const target = deleteTarget;
    if (!target) return;
    startTransition(async () => {
      const res = await onDelete(target.id);
      if (!res.ok) {
        toast.error("Gagal menghapus", { description: res.error });
        return;
      }
      toast.success("Berhasil dihapus", { description: demoNote(res) });
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-divider px-[18px] py-[13px]">
        <div className="text-sm font-bold text-ink">{title}</div>
        <button
          onClick={() => {
            setForm({});
            setAddOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-[10px] bg-brand px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-brand-strong"
        >
          <Plus className="size-3.5" strokeWidth={2.75} />
          {addLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="px-[18px] py-10 text-center text-[13px] text-muted-foreground">
          {emptyText}
        </div>
      ) : (
        items.map((it) => (
          <div
            key={it.id}
            className="flex items-center justify-between gap-3 border-t border-page px-[18px] py-3 first:border-t-0"
          >
            <div className="min-w-0">
              <div className="truncate text-[13.5px] font-semibold text-ink">
                {it.primary}
              </div>
              {it.secondary && (
                <div className="truncate text-[12px] text-meta">
                  {it.secondary}
                </div>
              )}
            </div>
            <button
              onClick={() => setDeleteTarget(it)}
              className="flex size-8 flex-none items-center justify-center rounded-lg border border-line text-danger hover:bg-danger-soft"
              title="Hapus"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))
      )}

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{addLabel}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                <div className="mb-1.5 text-[12.5px] font-semibold text-muted-foreground">
                  {f.label}
                </div>
                <input
                  value={form[f.key] ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                  placeholder={f.placeholder}
                  className="h-[42px] w-full rounded-[10px] border border-line bg-surface px-[13px] text-[13.5px] text-ink outline-none focus:border-brand focus:ring-[3px] focus:ring-brand-soft placeholder:text-meta"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setAddOpen(false)}
              className="rounded-[10px] border border-line px-4 py-2 text-[13px] font-semibold text-body hover:bg-surface-2"
            >
              Batal
            </button>
            <button
              onClick={submitAdd}
              disabled={pending}
              className="flex items-center gap-2 rounded-[10px] bg-navy px-4 py-2 text-[13px] font-semibold text-white hover:bg-navy/90 disabled:opacity-60"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Simpan
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus data?</DialogTitle>
          </DialogHeader>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Yakin hapus{" "}
            <b className="text-ink">{deleteTarget?.primary}</b>? Kwitansi yang
            memakainya tidak ikut terhapus (referensinya dikosongkan).
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="rounded-[10px] border border-line px-4 py-2 text-[13px] font-semibold text-body hover:bg-surface-2"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              disabled={pending}
              className="flex items-center gap-2 rounded-[10px] bg-danger px-4 py-2 text-[13px] font-semibold text-white hover:bg-danger/90 disabled:opacity-60"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Hapus
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
