import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { AppHeader, Card, MetricRow, Screen, SectionTitle } from "../../src/components/ui";
import { ENGINE_VERSION, useFitment } from "../../src/state/FitmentProvider";
import { colors, fontFamily, radius, spacing } from "../../src/theme";

export default function ProfileScreen() {
  const { buildItems, savedBuilds } = useFitment();

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

      <SectionTitle>App status</SectionTitle>
      <Card>
        <MetricRow label="Catalog" value="Demo catalog" />
        <MetricRow label="Engine" value={ENGINE_VERSION} />
        <MetricRow label="Appearance" value="Light" last />
      </Card>

      <SectionTitle>Privacy</SectionTitle>
      <Card style={styles.rowsCard}>
        <InfoRow
          icon="lock-closed-outline"
          title="Private by default"
          body="Build and firearm data is stored only on this device until sync exists."
        />
        <InfoRow
          icon="shield-checkmark-outline"
          title="Evidence before confidence"
          body="Weak or missing records are shown as unknown, never upgraded to verified."
          last
        />
      </Card>

      <SectionTitle>Help & legal</SectionTitle>
      <Card style={styles.rowsCard}>
        <InfoRow
          icon="help-circle-outline"
          title="How results work"
          body="FITMENT checks mounting interfaces, required adapters, dimensional checks, and evidence quality for the exact variants you select."
        />
        <InfoRow
          icon="scale-outline"
          title="Legal and regulatory"
          body="FITMENT reports mechanical compatibility only. Legal requirements vary by jurisdiction and are never part of a fit result."
          last
        />
      </Card>

      <Text style={styles.disclaimer}>
        Demo catalog results are not manufacturer-verified and should not be used as installation,
        safety, purchase, or legal guidance.
      </Text>
    </Screen>
  );
}

function InfoRow({
  icon,
  title,
  body,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, last ? styles.rowLast : null]}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={colors.inkSoft} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  accountIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  accountCopy: { flex: 1 },
  accountTitle: { color: colors.ink, fontFamily, fontSize: 15, fontWeight: "600" },
  accountBody: { color: colors.inkSoft, fontFamily, fontSize: 13, marginTop: 2 },
  rowsCard: { paddingVertical: spacing.xxs },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  rowLast: { borderBottomWidth: 0 },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm - 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  rowCopy: { flex: 1 },
  rowTitle: { color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600" },
  rowBody: { color: colors.inkSoft, fontFamily, fontSize: 13, lineHeight: 18, marginTop: 2 },
  disclaimer: {
    color: colors.inkFaint,
    fontFamily,
    fontSize: 12,
    lineHeight: 17,
    marginTop: spacing.xl,
  },
});
