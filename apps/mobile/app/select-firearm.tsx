import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { demoHost } from "@fitment/catalog";

import { Card, MetricRow, ModalScreen } from "../src/components/ui";
import { categoryLabel, interfaceLabel, money } from "../src/presentation";
import { colors, fontFamily, radius, spacing } from "../src/theme";

export default function SelectFirearmScreen() {
  return (
    <ModalScreen title="Firearm">
      <Text style={styles.helper}>
        Compatibility is checked against the exact variant, not a broad model name.
      </Text>

      <Card style={styles.selectedCard}>
        <View style={styles.selectedTop}>
          <View style={styles.copy}>
            <Text style={styles.maker}>{demoHost.manufacturer}</Text>
            <Text style={styles.model}>{demoHost.exactModel}</Text>
          </View>
          <View style={styles.check}>
            <Ionicons name="checkmark" size={15} color={colors.white} />
          </View>
        </View>

        <View style={styles.metrics}>
          <MetricRow label="Family" value={demoHost.family} />
          <MetricRow label="Category" value={categoryLabel(demoHost.category)} />
          <MetricRow label="SKU" value={demoHost.sku ?? "Not recorded"} />
          <MetricRow label="Known price" value={money(demoHost.knownPriceCents)} />
          <MetricRow
            label="Known weight"
            value={demoHost.knownWeightGrams === undefined ? "Unknown" : `${demoHost.knownWeightGrams} g`}
            last
          />
        </View>
      </Card>

      <Text style={styles.sectionLabel}>Mounting interfaces</Text>
      <Card style={styles.interfaceCard}>
        {demoHost.provides.map((item, index) => (
          <View
            key={item.interfaceId}
            style={[styles.interfaceRow, index === demoHost.provides.length - 1 ? styles.interfaceRowLast : null]}
          >
            <View style={styles.interfaceIcon}>
              <Ionicons name="link-outline" size={16} color={colors.inkSoft} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.interfaceName}>{interfaceLabel(item.interfaceId)}</Text>
              <Text style={styles.interfaceMeta}>
                {item.location} · {item.verificationStatus === "DEMO_UNVERIFIED" ? "demo record" : "verified"}
              </Text>
            </View>
          </View>
        ))}
      </Card>

      <Text style={styles.footnote}>
        This is the only firearm in the demo catalog. Variant search by manufacturer, generation,
        caliber, and optic cut arrives with the full catalog.
      </Text>
    </ModalScreen>
  );
}

const styles = StyleSheet.create({
  helper: { color: colors.inkSoft, fontFamily, fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
  selectedCard: { borderColor: colors.accent, borderWidth: 1 },
  selectedTop: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  copy: { flex: 1 },
  maker: { color: colors.inkFaint, fontFamily, fontSize: 12 },
  model: { color: colors.ink, fontFamily, fontSize: 17, lineHeight: 22, fontWeight: "600", marginTop: 2 },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
  metrics: {
    marginTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  sectionLabel: {
    color: colors.ink,
    fontFamily,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.2,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  interfaceCard: { paddingVertical: spacing.xxs },
  interfaceRow: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  interfaceRowLast: { borderBottomWidth: 0 },
  interfaceIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm - 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  interfaceName: { color: colors.ink, fontFamily, fontSize: 15, fontWeight: "600" },
  interfaceMeta: { color: colors.inkSoft, fontFamily, fontSize: 12, marginTop: 2 },
  footnote: {
    color: colors.inkFaint,
    fontFamily,
    fontSize: 12,
    lineHeight: 17,
    marginTop: spacing.lg,
  },
});
