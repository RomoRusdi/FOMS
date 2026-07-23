"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Loader2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { KwitansiPaperData } from "@/components/kwitansi/kwitansi-paper";
import {
  buildKwitansiObjectUrl,
  downloadKwitansiPdf,
  preloadPdf,
} from "@/lib/pdf/actions";
import type { Settings } from "@/lib/settings";
import type { Receipt } from "@/lib/types";
import { deleteReceipt } from "@/app/(app)/kwitansi/actions";

const box =
  "flex size-[30px] items-center justify-center rounded-lg border border-line bg-surface hover:bg-surface-2 disabled:opacity-60";

function toPaperData(r: Receipt): KwitansiPaperData {
  return {
    number: r.receipt_number,
    date: r.payment_date,
    companyName: r.company_name,
    amount: r.payment_amount,
    amountWords: r.payment_amount_words,
    description: r.payment_description,
    vesselName: r.vessel_name,
    bankName: r.bank_name,
    bankAccountName: r.bank_account_name,
    bankAccountNumber: r.bank_account_number,
  };
}

export function RowActions({
  receipt,
  settings,
}: {
  receipt: Receipt;
  settings: Settings;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | "view" | "pdf">(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, startDelete] = useTransition();

  useEffect(() => {
    preloadPdf();
  }, []);

  function handleDelete() {
    startDelete(async () => {
      const res = await deleteReceipt(receipt.id);
      if (!res.ok) {
        toast.error("Gagal menghapus", { description: res.error });
        return;
      }
      toast.success("Kwitansi dihapus", {
        description: res.demo
          ? "Mode demo — tidak tersimpan."
          : receipt.receipt_number,
      });
      setConfirmOpen(false);
      router.refresh();
    });
  }

  async function handleView() {
    // Open the tab synchronously so the browser keeps the user-gesture allowance.
    const win = window.open("", "_blank");
    setBusy("view");
    try {
      const { url } = await buildKwitansiObjectUrl(
        toPaperData(receipt),
        settings,
      );
      if (win) win.location.href = url;
      else window.location.href = url;
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch {
      win?.close();
      toast.error("Gagal membuka PDF");
    } finally {
      setBusy(null);
    }
  }

  async function handleDownload() {
    setBusy("pdf");
    try {
      await downloadKwitansiPdf(toPaperData(receipt), settings);
    } catch {
      toast.error("Gagal membuat PDF");
    } finally {
      setBusy(null);
    }
  }

  const soon = (action: string) =>
    toast.info(action, {
      description: `${action} untuk ${receipt.receipt_number} segera hadir.`,
    });

  return (
    <div className="flex justify-end gap-1.5">
      <button
        className={`${box} text-muted-foreground`}
        title="Lihat PDF"
        onClick={handleView}
        disabled={busy !== null}
      >
        {busy === "view" ? (
          <Loader2 className="size-[15px] animate-spin" />
        ) : (
          <Eye className="size-[15px]" />
        )}
      </button>
      <button
        className={`${box} text-[11px] font-bold text-brand`}
        title="Download PDF"
        onClick={handleDownload}
        disabled={busy !== null}
      >
        {busy === "pdf" ? (
          <Loader2 className="size-[15px] animate-spin" />
        ) : (
          "PDF"
        )}
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger className={`${box} text-muted-foreground outline-none`}>
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => soon("Edit")}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => soon("Duplikat")}>
            Duplikat
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus kwitansi?</DialogTitle>
          </DialogHeader>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Yakin hapus kwitansi{" "}
            <b className="tabnum text-ink">{receipt.receipt_number}</b> (
            {receipt.company_name})? Tindakan ini tidak bisa dibatalkan.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="rounded-[10px] border border-line px-4 py-2 text-[13px] font-semibold text-body hover:bg-surface-2"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 rounded-[10px] bg-danger px-4 py-2 text-[13px] font-semibold text-white hover:bg-danger/90 disabled:opacity-60"
            >
              {deleting && <Loader2 className="size-4 animate-spin" />}
              Hapus
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
