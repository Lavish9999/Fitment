import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import {
  AppHeader,
  Card,
  MetricRow,
  PrimaryButton,
  Screen,
  SecondaryButton,
  SectionTitle,
} from "../../src/components/ui";
import { money } from "../../src/presentation";
import { useFitment, type SavedBuild } from "../../src/state/FitmentProvider";
import { colors, fontFamily, radius, spacing } from "../../src/theme";

export default function ArmoryScreen() {
  const router = useRouter();
  const {
    selectedHost,
    buildItems,
    savedBuilds,
    totals,
    productById,
    removeFromBuild,
    clearBuild,
    saveCurrentBuild,
    loadBuild,
    renameBuild,
    duplicateBuild,
    deleteBuild,
  } = useFitment();

  function savedBuildPrice(build: SavedBuild): string {
    const host = productById(build.hostId);
    const prices = [host?.knownPriceCents, ...build.componentIds.map((id) => productById(id)?.knownPriceCents)];
    if (prices.some((value) => value === undefined)) return "Price incomplete";
    return money(prices.reduce<number>((sum, value) => sum + (value ?? 0), 0));
  }

  function promptRename(build: SavedBuild) {
    if (Platform.OS === "ios") {
      Alert.prompt("Rename build", undefined, (name) => renameBuild(build.id, name ?? ""), "plain-text", build.name);
    }
  }

  function confirmDelete(build: SavedBuild) {
    Alert.alert("Delete build?", `“${build.name}” will be removed from this iPhone.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteBuild(build.id) },
    ]);
  }

  function openBuildActions(build: SavedBuild) {
    Alert.alert(build.name, undefined, [
      {
        text: "Open in Builder",
        onPress: () => {
          loadBuild(build.id);
          router.push("/builder");
        },
      },
      ...(Platform.OS === "ios" ? [{ text: "Rename", onPress: () => promptRename(build) }] : []),
      { text: "Duplicate", onPress: () => duplicateBuild(build.id) },
      { text: "Delete", style: "destructive" as const, onPress: () => confirmDelete(build) },
      { text: "Cancel", style: "cancel" as const },
    ]);
  }

  return (
    <Screen>
      <AppHeader title="Armory" subtitle="Builds and firearms stored on this iPhone." />

      <SectionTitle>Current build</SectionTitle>
      <Card>
        <View style={styles.hostLine}>
          <View style={styles.hostIcon}>
            <Ionicons name="barcode-outline" size={18} color={colors.ink} />
          </View>
          <View style={styles.hostCopy}>
            <Text style={styles.hostMaker}>{selectedHost.manufacturer}</Text>
            <Text style={styles.hostName}>{selectedHost.exactModel}</Text>
          </View>
        </View>

        {buildItems.length === 0 ? (
          <View style={styles.compactEmpty}>
            <Ionicons name="add-circle-outline" size={22} color={colors.inkFaint} />
            <View style={styles.compactEmptyCopy}>
              <Text style={styles.compactEmptyTitle}>No components yet</Text>
              <Text style={styles.compactEmptyBody}>Use Builder to add a compatible component and required parts.</Text>
            </View>
          </View>
        ) : (
          <View style={styles.itemList}>
            {buildItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemCopy}>
                  <Text style={styles.itemTitle}>{item.exactModel}</Text>
                  <Text style={styles.itemMeta}>{money(item.knownPriceCents)}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.exactModel}`}
                  hitSlop={12}
                  onPress={() => removeFromBuild(item.id)}
                  style={({ pressed }) => [styles.removeButton, pressed ? styles.pressed : null]}
                >
                  <Ionicons name="close" size={16} color={colors.danger} />
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

        {buildItems.length > 0 ? (
          <View style={styles.actions}>
            <PrimaryButton label="Save build" icon="bookmark-outline" onPress={saveCurrentBuild} />
            <SecondaryButton label="Clear current build" onPress={clearBuild} />
          </View>
        ) : null}
      </Card>

      <SectionTitle>Saved builds</SectionTitle>
      {savedBuilds.length === 0 ? (
        <Card style={styles.compactCard}>
          <View style={styles.compactEmpty}>
            <Ionicons name="bookmark-outline" size={22} color={colors.inkFaint} />
            <View style={styles.compactEmptyCopy}>
              <Text style={styles.compactEmptyTitle}>Nothing saved</Text>
              <Text style={styles.compactEmptyBody}>Save a named snapshot of the current exact configuration.</Text>
            </View>
          </View>
        </Card>
      ) : (
        <Card style={styles.listCard}>
          {savedBuilds.map((build, index) => {
            const host = productById(build.hostId);
            return (
              <Pressable
                key={build.id}
                accessibilityRole="button"
                onPress={() => openBuildActions(build)}
                style={({ pressed }) => [
                  styles.savedRow,
                  index === savedBuilds.length - 1 ? styles.savedRowLast : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <View style={styles.savedGlyph}>
                  <Ionicons name="cube-outline" size={17} color={colors.inkSoft} />
                </View>
                <View style={styles.savedCopy}>
                  <Text style={styles.savedTitle}>{build.name}</Text>
                  <Text style={styles.savedMeta}>
                    {host?.exactModel ?? "Unknown host"} · {build.componentIds.length} component{build.componentIds.length === 1 ? "" : "s"} · {savedBuildPrice(build)}
                  </Text>
                </View>
                <Text style={styles.savedDate}>
                  {new Date(build.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </Text>
              </Pressable>
            );
          })}
        </Card>
      )}

      <SectionTitle>Selected firearm</SectionTitle>
      <Card style={styles.listCard}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/select-firearm")}
          style={({ pressed }) => [styles.savedRow, styles.savedRowLast, pressed ? styles.pressed : null]}
        >
          <View style={styles.savedGlyph}>
            <Ionicons name="barcode-outline" size={17} color={colors.inkSoft} />
          </View>
          <View style={styles.savedCopy}>
            <Text style={styles.savedTitle}>{selectedHost.exactModel}</Text>
            <Text style={styles.savedMeta}>{selectedHost.manufacturer} · {money(selectedHost.knownPriceCents)}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
        </Pressable>
      </Card>
      <Text style={styles.footnote}>Selection does not claim ownership. Private ownership records arrive later in Phase 1.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hostLine: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  hostIcon: { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceMuted },
  hostCopy: { flex: 1 },
  hostMaker: { color: colors.inkFaint, fontFamily, fontSize: 12 },
  hostName: { color: colors.ink, fontFamily, fontSize: 15, lineHeight: 20, fontWeight: "600", marginTop: 1 },
  compactCard: { paddingVertical: spacing.xs },
  compactEmpty: { minHeight: 86, flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.sm, paddingVertical: spacing.sm },
  compactEmptyCopy: { flex: 1 },
  compactEmptyTitle: { color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600" },
  compactEmptyBody: { color: colors.inkSoft, fontFamily, fontSize: 13, lineHeight: 18, marginTop: 2 },
  itemList: { marginTop: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  itemRow: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  itemCopy: { flex: 1, paddingVertical: spacing.xs },
  itemTitle: { color: colors.ink, fontFamily, fontSize: 14, lineHeight: 19, fontWeight: "600" },
  itemMeta: { color: colors.inkSoft, fontFamily, fontSize: 12, marginTop: 3 },
  removeButton: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.dangerSoft },
  pressed: { opacity: 0.62 },
  metrics: { marginTop: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  actions: { gap: spacing.xs, marginTop: spacing.md },
  listCard: { paddingVertical: spacing.xxs },
  savedRow: { minHeight: 60, flexDirection: "row", alignItems: "center", gap: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  savedRowLast: { borderBottomWidth: 0 },
  savedGlyph: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceMuted },
  savedCopy: { flex: 1, paddingVertical: spacing.xs },
  savedTitle: { color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600" },
  savedMeta: { color: colors.inkSoft, fontFamily, fontSize: 12, lineHeight: 17, marginTop: 3 },
  savedDate: { color: colors.inkFaint, fontFamily, fontSize: 12 },
  footnote: { color: colors.inkFaint, fontFamily, fontSize: 12, lineHeight: 17, marginTop: spacing.xs },
});
