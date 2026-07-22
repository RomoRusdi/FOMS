import {
  Document,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { KwitansiPaperData } from "@/components/kwitansi/kwitansi-paper";
import { formatDateLong, formatRupiah } from "@/lib/format";
import type { Settings } from "@/lib/settings";

const NAVY = "#14294a";
const INK = "#101f36";
const MUTED = "#64748b";
const META = "#94a3b8";
const LINE = "#cbd5e1";
const PAGEBG = "#f4f6fa";
const DIVIDER = "#eef1f5";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: INK,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NAVY,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  logoText: { color: NAVY, fontSize: 20, fontFamily: "Helvetica-Bold" },
  companyName: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.3,
  },
  companyAddr: { color: "#a9b8d4", fontSize: 8.5, marginTop: 2 },

  body: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 2,
    borderBottomColor: NAVY,
    paddingBottom: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    letterSpacing: 3,
  },
  noLabel: { fontSize: 8, color: META },
  noValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: NAVY },

  row: { flexDirection: "row", marginBottom: 11, alignItems: "flex-start" },
  label: { width: 120, color: MUTED },
  value: { flex: 1, lineHeight: 1.4 },
  bold: { fontFamily: "Helvetica-Bold" },
  moneyBox: {
    flex: 1,
    backgroundColor: PAGEBG,
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  moneyText: {
    fontFamily: "Helvetica-BoldOblique",
    color: NAVY,
    lineHeight: 1.4,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 20,
  },
  jumlahBox: {
    borderWidth: 2,
    borderColor: NAVY,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  jumlahLabel: { fontSize: 8, color: META, letterSpacing: 0.5 },
  jumlahValue: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginTop: 2,
  },
  sign: { width: 180, alignItems: "center" },
  signCity: { color: MUTED, marginBottom: 2 },
  signLine: {
    width: 150,
    borderTopWidth: 1,
    borderTopColor: LINE,
    marginTop: 4,
    marginBottom: 4,
  },
  signName: { fontFamily: "Helvetica-Bold", color: INK },
  signRole: { fontSize: 8, color: META, marginTop: 1 },

  footer: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: DIVIDER,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 8, color: META },
});

function KwitansiDocument({
  data,
  settings,
}: {
  data: KwitansiPaperData;
  settings: Settings;
}) {
  const description = data.description.trim();
  const fullDescription =
    description && data.vesselName
      ? `${description} (${data.vesselName}).`
      : description;

  return (
    <Document
      title={`Kwitansi ${data.number}`}
      author={settings.companyName}
      creator="FOMS"
    >
      <Page size="A5" orientation="landscape" wrap={false} style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>K</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.companyName}>{settings.companyName}</Text>
            <Text style={styles.companyAddr}>{settings.companyAddress}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>KWITANSI</Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.noLabel}>No.</Text>
              <Text style={styles.noValue}>{data.number}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Telah terima dari</Text>
            <Text style={[styles.value, styles.bold]}>
              {data.companyName || "—"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Uang sejumlah</Text>
            <View style={styles.moneyBox}>
              <Text style={styles.moneyText}>{data.amountWords}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Untuk pembayaran</Text>
            <Text style={styles.value}>{fullDescription || "—"}</Text>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.jumlahBox}>
              <Text style={styles.jumlahLabel}>JUMLAH</Text>
              <Text style={styles.jumlahValue}>{formatRupiah(data.amount)}</Text>
            </View>
            <View style={styles.sign}>
              <Text style={styles.signCity}>
                {settings.city}, {formatDateLong(data.date)}
              </Text>
              <View style={{ height: 38 }} />
              <View style={styles.signLine} />
              <Text style={styles.signName}>{settings.signerName}</Text>
              <Text style={styles.signRole}>{settings.signerRole}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{settings.bankLine}</Text>
            <Text style={styles.footerText}>{settings.footerNote}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

/** Filename-safe kwitansi PDF name, e.g. "Kwitansi-009-VII-26.pdf". */
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
