import {
  Document,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { KwitansiPaperData } from "@/components/kwitansi/kwitansi-paper";
import { formatDateLong, formatKwitansiAmount } from "@/lib/format";
import type { Settings } from "@/lib/settings";

const INK = "#111827";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: INK,
    backgroundColor: "#ffffff",
    paddingVertical: 30,
    paddingHorizontal: 34,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { fontSize: 30, fontFamily: "Helvetica-Bold" },
  noText: { fontSize: 10, marginTop: 6 },

  table: { borderWidth: 1, borderColor: INK, marginTop: 16 },
  row: { flexDirection: "row" },
  rowBorder: { borderTopWidth: 1, borderTopColor: INK },
  label: {
    width: 150,
    borderRightWidth: 1,
    borderRightColor: INK,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  value: { flex: 1, paddingVertical: 7, paddingHorizontal: 10 },
  bold: { fontFamily: "Helvetica-Bold" },
  received: { fontSize: 12 },

  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 18,
  },
  rpLabel: { fontFamily: "Helvetica-Bold", fontSize: 11, marginBottom: 4 },
  amountBox: {
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderColor: INK,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  amountText: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  dateText: { fontFamily: "Helvetica-Bold", fontSize: 11, marginTop: 2 },

  payRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 20,
  },
  payBlock: { maxWidth: 320 },
  infoLine: { flexDirection: "row", marginTop: 3 },
  infoLabel: { width: 78 },
  infoColon: { width: 10 },
  signer: { fontFamily: "Helvetica-Bold", fontSize: 12, marginTop: 26 },
});

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoLine}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoColon}>:</Text>
      <Text>{value || "—"}</Text>
    </View>
  );
}

function KwitansiDocument({
  data,
  settings,
}: {
  data: KwitansiPaperData;
  settings: Settings;
}) {
  const words = (data.amountWords || "").toUpperCase();
  const bankName = data.bankName || settings.bankName;
  const bankAccountName = data.bankAccountName || settings.bankAccountName;
  const bankAccountNumber = data.bankAccountNumber || settings.bankAccountNumber;

  return (
    <Document title={`Kwitansi ${data.number}`} creator="FOMS">
      <Page size="A5" orientation="landscape" wrap={false} style={styles.page}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>KWITANSI</Text>
          <Text style={styles.noText}>No.: {data.number || "—"}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.label}>Sudah Terima Dari</Text>
            <Text style={[styles.value, styles.received]}>
              {data.companyName || "—"}
            </Text>
          </View>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.label}>Banyaknya Uang</Text>
            <Text style={[styles.value, styles.bold]}>: {words || "—"}</Text>
          </View>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.label}>Untuk Pembayaran</Text>
            <Text style={styles.value}>: {data.description || "—"}</Text>
          </View>
        </View>

        <View style={styles.amountRow}>
          <View>
            <Text style={styles.rpLabel}>Rp.</Text>
            <View style={styles.amountBox}>
              <Text style={styles.amountText}>
                {formatKwitansiAmount(data.amount)}
              </Text>
            </View>
          </View>
          <Text style={styles.dateText}>
            {(settings.city || "").toUpperCase()}, {formatDateLong(data.date)}
          </Text>
        </View>

        <View style={styles.payRow}>
          <View style={styles.payBlock}>
            <Text>Untuk Pembayaran Mohon ditujukan ke :</Text>
            <InfoLine label="Bank" value={bankName} />
            <InfoLine label="Atas Nama" value={bankAccountName} />
            <InfoLine label="No. Rekening" value={bankAccountNumber} />
          </View>
          <Text style={styles.signer}>{settings.signerName || "—"}</Text>
        </View>
      </Page>
    </Document>
  );
}

/** Filename-safe kwitansi PDF name, e.g. "Kwitansi-009-IV-26.pdf". */
export function kwitansiFilename(number: string): string {
  return `Kwitansi-${number.replace(/[\\/\s]+/g, "-")}.pdf`;
}

/** Render the kwitansi to a PDF Blob (client-side). */
export async function renderKwitansiBlob(
  data: KwitansiPaperData,
  settings: Settings,
): Promise<Blob> {
  return pdf(<KwitansiDocument data={data} settings={settings} />).toBlob();
}
