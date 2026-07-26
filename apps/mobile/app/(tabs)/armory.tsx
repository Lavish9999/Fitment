import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { demoHost } from "@fitment/catalog";

import {
  AppHeader,
  Card,
  EmptyState,
  MetricRow,
  PrimaryButton,
  Screen,
  SecondaryButton,
  SectionTitle,
} from "../../src/components/ui";
import { money } from "../../src/presentation";
import { useFitment } from "../../src/state/FitmentProvider";
import { colors, fontFamily, radius, spacing } from "../../src/theme";

export default function ArmoryScreen() {
  const {
    buildItems,
    savedBuilds,
    totals,
    removeFromBuild,
    clearBuild,
    saveCurrentBuild,
  } = useFitment();

  return (
    <Screen>
      <AppHeader title="Armory" subtitle="Your current configuration and builds saved on this iPhone." />

      <View style={styles.modeBanner}>
        <View style={styles.modeIcon}>
          <Ionicons name="phone-portrait-outline" size={18} color={colors.accent} />
        </View>
        <View style={styles.modeCopy}>
          <Text style={styles.modeTitle}>Device-only mode</Text>
          <Text style={styles.modeBody}>Nothing here is synced to an account yet.</Text>
        </View>
      </View>

      <SectionTitle>Current build</SectionTitle>
      <Card>
        <View style={styles.hostLine}>
          <View style={styles.hostIcon}>
            <Ionicons name="barcode-outline" size={19} color={colors.ink} />
          </View>
          <View style={styles.hostCopy}>
            <Text style={styles.hostMaker}>{demoHost.manufacturer}</Text>
            <Text style={styles.hostName} numberOfLines={1}>{demoHost.exactModel}</Text>
          </View>
          <Text style={styles.count}>{buildItems.length}</Text>
        </View>

        {buildItems.length === 0 ? (
          <EmptyState
            icon="add-circle-outline"
            title="No components yet"
            body="Use Builder to add a compatible component and any required parts."
          />
        ) : (
          <View style={styles.itemList}>
            {buildItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemCopy}>
                  <Text style={styles.itemTitle} numberOfLines={2}>{item.exactModel}</Text>
                  <Text style={styles.itemMeta}>{money(item.knownPriceCents)}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.exactModel}`}
                  hitSlop={12}
                  onPress={() => removeFromBuild(item.id)}
                  style={({ pressed }) => [styles.removeButton, pressed ? styles.pressed : null]}
                >
                  <Ionicons name="close" size={17} color={colors.danger} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <View style={styles.metrics}>
          <MetricRow label="Known total" value={money(totals.price)} />
          <MetricRow label="Configured weight" value={totals.weight === undefined ? "Unknown" : `${totals.weight} g`} />
          <MetricRow label="Incomplete values" value={String(totals.unknownPrices + totals.unknownWeights)} last />
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Save build" icon="bookmark-outline" onPress={() => void saveCurrentBuild()} />
          {buildItems.length > 0 ? <SecondaryButton label="Clear current build" onPress={clearBuild} /> : null}
        </View>
      </Card>

      <SectionTitle>Saved builds</SectionTitle>
      <Card>
        {savedBuilds.length === 0 ? (
          <EmptyState icon="bookmark-outline" title="Nothing saved" body="Saved snapshots will appear here with their engine version." />
        ) : (
          savedBuilds.map((build, index) => (
            <View key={build.id} style={[styles.savedRow, index === savedBuilds.length - 1 ? styles.savedRowLast : null]}>
              <View style={styles.savedGlyph}>
                <Ionicons name="cube-outline" size={18} color={colors.inkSoft} />
              </View>
              <View style={styles.savedCopy}>
                <Text style={styles.savedTitle}>{build.name}</Text>
                <Text style={styles.savedMeta}>{build.componentIds.length} components · engine {build.engineVersion}</Text>
              </View>
              <Text style={styles.savedDate}>
                {new Date(build.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </Text>
            </View>
          ))
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  modeBanner: { minHeight: 70, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.md, borderRadius: radius.lg, backgroundColor: colors.accentSoft },
  modeIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  modeCopy: { flex: 1 },
  modeTitle: { color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600" },
  modeBody: { color: colors.inkSoft, fontFamily, fontSize: 12, marginTop: 3 },
  hostLine: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  hostIcon: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceMuted },
  hostCopy: { flex: 1 },
  hostMaker: { color: colors.inkFaint, fontFamily, fontSize: 11 },
  hostName: { color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600", marginTop: 2 },
  count: { minWidth: 30, textAlign: "center", color: colors.ink, fontFamily, fontSize: 18, fontWeight: "700" },
  itemList: { marginTop: spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  itemRow: { minHeight: 66, flexDirection: "row", alignItems: "center", gap: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  itemCopy: { flex: 1, paddingVertical: spacing.sm },
  itemTitle: { color: colors.ink, fontFamily, fontSize: 14, lineHeight: 19, fontWeight: "600" },
  itemMeta: { color: colors.inkSoft, fontFamily, fontSize: 12, marginTop: 4 },
  removeButton: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: colors.dangerSoft },
  pressed: { opacity: 0.62 },
  metrics: { marginTop: spacing.md, paddingTop: spacing.xs, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  actions: { gap: spacing.sm, marginTop: spacing.lg },
  savedRow: { minHeight: 66, flexDirection: "row", alignItems: "center", gap: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  savedRowLast: { borderBottomWidth: 0 },
  savedGlyph: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceMuted },
  savedCopy: { flex: 1 },
  savedTitle: { color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600" },
  savedMeta: { color: colors.inkSoft, fontFamily, fontSize: 11, marginTop: 4 },
  savedDate: { color: colors.inkFaint, fontFamily, fontSize: 11 },
});
