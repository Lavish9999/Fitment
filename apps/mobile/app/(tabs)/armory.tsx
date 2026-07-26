import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { demoHost, demoProductsById } from "@fitment/catalog";

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
import { useFitment, type SavedBuild } from "../../src/state/FitmentProvider";
import { colors, fontFamily, radius, spacing } from "../../src/theme";

function savedBuildPrice(build: SavedBuild): string {
  const prices = build.componentIds.map((id) => demoProductsById.get(id)?.knownPriceCents);
  if (prices.some((value) => value === undefined)) return "Price incomplete";
  const total = prices.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  return money(total + (demoHost.knownPriceCents ?? 0));
}

export default function ArmoryScreen() {
  const router = useRouter();
  const {
    buildItems,
    savedBuilds,
    totals,
    removeFromBuild,
    clearBuild,
    saveCurrentBuild,
    loadBuild,
    renameBuild,
    duplicateBuild,
    deleteBuild,
  } = useFitment();

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
            <Text style={styles.hostMaker}>{demoHost.manufacturer}</Text>
            <Text style={styles.hostName}>{demoHost.exactModel}</Text>
          </View>
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
          <MetricRow
            label="Configured weight"
            value={totals.weight === undefined ? "Unknown" : `${totals.weight} g`}
          />
          <MetricRow
            label="Incomplete values"
            value={String(totals.unknownPrices + totals.unknownWeights)}
            last
          />
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
        <Card>
          <EmptyState
            icon="bookmark-outline"
            title="Nothing saved"
            body="Save the current build to keep a named snapshot on this iPhone."
          />
        </Card>
      ) : (
        <Card style={styles.listCard}>
          {savedBuilds.map((build, index) => (
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
                  {build.componentIds.length} component{build.componentIds.length === 1 ? "" : "s"} ·{" "}
                  {savedBuildPrice(build)} · engine {build.engineVersion}
                </Text>
              </View>
              <Text style={styles.savedDate}>
                {new Date(build.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </Pressable>
          ))}
        </Card>
      )}

      <SectionTitle>Owned firearms</SectionTitle>
      <Card style={styles.listCard}>
        <View style={[styles.savedRow, styles.savedRowLast]}>
          <View style={styles.savedGlyph}>
            <Ionicons name="barcode-outline" size={17} color={colors.inkSoft} />
          </View>
          <View style={styles.savedCopy}>
            <Text style={styles.savedTitle}>{demoHost.exactModel}</Text>
            <Text style={styles.savedMeta}>
              {demoHost.manufacturer} · {money(demoHost.knownPriceCents)}
            </Text>
          </View>
        </View>
      </Card>
      <Text style={styles.footnote}>
        Ownership records stay on this iPhone. Nothing is synced to an account yet.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hostLine: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  hostIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  hostCopy: { flex: 1 },
  hostMaker: { color: colors.inkFaint, fontFamily, fontSize: 12 },
  hostName: { color: colors.ink, fontFamily, fontSize: 15, lineHeight: 20, fontWeight: "600", marginTop: 1 },
  itemList: {
    marginTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  itemRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  itemCopy: { flex: 1, paddingVertical: spacing.xs },
  itemTitle: { color: colors.ink, fontFamily, fontSize: 14, lineHeight: 19, fontWeight: "600" },
  itemMeta: { color: colors.inkSoft, fontFamily, fontSize: 12, marginTop: 3 },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dangerSoft,
  },
  pressed: { opacity: 0.62 },
  metrics: {
    marginTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  actions: { gap: spacing.xs, marginTop: spacing.md },
  listCard: { paddingVertical: spacing.xxs },
  savedRow: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  savedRowLast: { borderBottomWidth: 0 },
  savedGlyph: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  savedCopy: { flex: 1, paddingVertical: spacing.xs },
  savedTitle: { color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600" },
  savedMeta: { color: colors.inkSoft, fontFamily, fontSize: 12, lineHeight: 17, marginTop: 3 },
  savedDate: { color: colors.inkFaint, fontFamily, fontSize: 12 },
  footnote: {
    color: colors.inkFaint,
    fontFamily,
    fontSize: 12,
    lineHeight: 17,
    marginTop: spacing.xs,
  },
});
