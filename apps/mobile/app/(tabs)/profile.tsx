import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppHeader, Card, MetricRow, Screen, SectionTitle } from "../../src/components/ui";
import { ENGINE_VERSION, useFitment } from "../../src/state/FitmentProvider";
import { colors, fontFamily, radius, spacing } from "../../src/theme";

export default function ProfileScreen() {
  const {
    firearms,
    accessories,
    buildItems,
    savedBuilds,
    catalogRevision,
    catalogMode,
    catalogSource,
    catalogError,
    catalogRefreshing,
    refreshCatalog,
  } = useFitment();

  return (
    <Screen>
      <AppHeader title="Profile" subtitle="Data, privacy, and app status." />

      <Card style={styles.accountCard}>
        <View style={styles.accountIcon}>
          <Ionicons name="cloud-offline-outline" size={19} color={colors.inkSoft} />
        </View>
        <View style={styles.accountCopy}>
          <Text style={styles.accountTitle}>Account sync is not connected yet</Text>
          <Text style={styles.accountBody}>Your current builds remain on this iPhone.</Text>
        </View>
      </Card>

      <SectionTitle>Local data</SectionTitle>
      <Card>
        <MetricRow label="Storage" value="On this iPhone" />
        <MetricRow label="Current build" value={`${buildItems.length} component${buildItems.length === 1 ? "" : "s"}`} />
        <MetricRow label="Saved builds" value={String(savedBuilds.length)} last />
      </Card>

      <SectionTitle>Catalog</SectionTitle>
      <Card>
        <MetricRow label="Mode" value={catalogMode === "PREVIEW" ? "Preview" : "Production"} />
        <MetricRow label="Source" value={catalogSource === "LOCAL_PREVIEW" ? "Bundled preview" : "Supabase configured"} />
        <MetricRow label="Firearms" value={String(firearms.length)} />
        <MetricRow label="Components" value={String(accessories.length)} />
        <MetricRow label="Revision" value={String(catalogRevision)} last />
      </Card>
      <Pressable
        accessibilityRole="button"
        disabled={catalogRefreshing}
        onPress={() => void refreshCatalog()}
        style={({ pressed }) => [styles.refreshRow, pressed ? styles.pressed : null]}
      >
        <Ionicons name="refresh" size={17} color={colors.inkSoft} />
        <Text style={styles.refreshText}>{catalogRefreshing ? "Refreshing catalog…" : "Refresh catalog"}</Text>
      </Pressable>
      {catalogError ? <Text style={styles.errorText}>{catalogError.message}</Text> : null}

      <SectionTitle>App status</SectionTitle>
      <Card>
        <MetricRow label="Engine" value={ENGINE_VERSION} />
        <MetricRow label="Appearance" value="Light" last />
      </Card>

      <SectionTitle>Privacy & trust</SectionTitle>
      <Card style={styles.rowsCard}>
        <InfoRow icon="lock-closed-outline" title="Private by default" body="Build data stays on this device until authenticated sync is connected." />
        <InfoRow icon="shield-checkmark-outline" title="Evidence before confidence" body="Weak or missing records remain unknown; they are never upgraded to verified." last />
      </Card>

      <SectionTitle>Help & legal</SectionTitle>
      <Card style={styles.rowsCard}>
        <InfoRow icon="help-circle-outline" title="How results work" body="Interfaces, adapters, dimensional checks, evidence, and exact variants contribute to each result." />
        <InfoRow icon="scale-outline" title="Legal and regulatory" body="FITMENT reports mechanical compatibility only. Legal requirements are separate and jurisdiction-dependent." last />
      </Card>

      <Text style={styles.disclaimer}>Preview catalog results may include manufacturer-sourced and demonstration records. Verification is shown on each result.</Text>
    </Screen>
  );
}

function InfoRow({ icon, title, body, last = false }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; last?: boolean }) {
  return (
    <View style={[styles.row, last ? styles.rowLast : null]}>
      <View style={styles.rowIcon}><Ionicons name={icon} size={18} color={colors.inkSoft} /></View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accountCard: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: spacing.sm },
  accountIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceMuted },
  accountCopy: { flex: 1 },
  accountTitle: { color: colors.ink, fontFamily, fontSize: 15, fontWeight: "600" },
  accountBody: { color: colors.inkSoft, fontFamily, fontSize: 13, marginTop: 2 },
  rowsCard: { paddingVertical: spacing.xxs },
  row: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowLast: { borderBottomWidth: 0 },
  rowIcon: { width: 34, height: 34, borderRadius: radius.sm - 2, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceMuted },
  rowCopy: { flex: 1 },
  rowTitle: { color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600" },
  rowBody: { color: colors.inkSoft, fontFamily, fontSize: 13, lineHeight: 18, marginTop: 2 },
  refreshRow: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs, marginTop: spacing.xs, borderRadius: radius.sm, backgroundColor: colors.surfaceMuted },
  refreshText: { color: colors.inkSoft, fontFamily, fontSize: 13, fontWeight: "600" },
  pressed: { opacity: 0.65 },
  errorText: { color: colors.danger, fontFamily, fontSize: 12, lineHeight: 17, marginTop: spacing.xs },
  disclaimer: { color: colors.inkFaint, fontFamily, fontSize: 12, lineHeight: 17, marginTop: spacing.xl },
});
