import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  demoAccessories,
  demoAdapters,
  demoEvidence,
  demoExclusions,
  demoHost,
  demoProductsById,
} from "@fitment/catalog";
import { evaluateCompatibility } from "@fitment/compatibility-engine";
import type {
  CatalogVariant,
  CompatibilityEvaluation,
  CompatibilityStatus,
} from "@fitment/domain";

const ENGINE_VERSION = "0.1.0-demo";
const STORAGE_KEY = "fitment.mobile.saved-builds.v1";

const colors = {
  bg: "#F3F3EF",
  surface: "#FFFFFF",
  soft: "#F8F8F5",
  text: "#111111",
  muted: "#666862",
  faint: "#8B8D87",
  border: "#DDDCD6",
  dark: "#171817",
  green: "#147A43",
  greenSoft: "#E9F4ED",
  amber: "#9A5A12",
  amberSoft: "#FBF0E1",
  slate: "#5E6872",
  slateSoft: "#EDF0F2",
  red: "#B93832",
  redSoft: "#FAE9E7",
};

interface SavedBuild {
  id: string;
  name: string;
  componentIds: string[];
  engineVersion: string;
  savedAt: string;
}

interface StatusPresentation {
  label: string;
  foreground: string;
  background: string;
}

function money(cents?: number): string {
  if (cents === undefined) return "Unknown";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function getStatus(evaluation: CompatibilityEvaluation): StatusPresentation {
  const status: CompatibilityStatus = evaluation.status;

  if (status === "VERIFIED_DIRECT") {
    return { label: "Verified direct fit", foreground: colors.green, background: colors.greenSoft };
  }
  if (status === "VERIFIED_WITH_ADAPTER") {
    return { label: "Verified with adapter", foreground: colors.amber, background: colors.amberSoft };
  }
  if (status === "LIKELY_COMPATIBLE") {
    return { label: "Likely compatible", foreground: colors.amber, background: colors.amberSoft };
  }
  if (status === "NEEDS_MEASUREMENT") {
    return { label: "Needs measurement", foreground: colors.slate, background: colors.slateSoft };
  }
  if (status === "CONFLICT_DETECTED") {
    return { label: "Conflict detected", foreground: colors.red, background: colors.redSoft };
  }
  if (status === "NOT_COMPATIBLE") {
    return { label: "Not compatible", foreground: colors.red, background: colors.redSoft };
  }
  if (evaluation.directMatches.length > 0 || evaluation.adapterPath.length > 0) {
    return {
      label: "Interface match · unverified",
      foreground: colors.slate,
      background: colors.slateSoft,
    };
  }
  return { label: "Unknown", foreground: colors.slate, background: colors.slateSoft };
}

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function DataRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={last ? styles.dataRowLast : styles.dataRow}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value}</Text>
    </View>
  );
}

function BulletList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) {
    return <Text style={styles.mutedBody}>{empty}</Text>;
  }

  return (
    <View style={styles.bulletList}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <View style={styles.bullet} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function BuilderScreen() {
  const [selectedAccessoryId, setSelectedAccessoryId] = useState(demoAccessories[0]?.id ?? "");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [buildItems, setBuildItems] = useState<CatalogVariant[]>([]);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);

  const selectedAccessory =
    demoAccessories.find((item) => item.id === selectedAccessoryId) ?? demoAccessories[0];

  const evaluation = useMemo(() => {
    if (!selectedAccessory) return null;

    return evaluateCompatibility({
      host: demoHost,
      accessory: selectedAccessory,
      adapters: demoAdapters,
      exclusions: demoExclusions,
      evidenceSources: demoEvidence,
      adapterGraphCompleteness: "PARTIAL",
      engineVersion: ENGINE_VERSION,
      dimensionChecks: [
        {
          code: "CONTROL_CLEARANCE",
          label: "Control clearance",
          result: "UNKNOWN",
          critical: false,
          explanation:
            "Control clearance has not been physically verified for this demonstration combination.",
          evidenceSourceIds: [],
        },
      ],
    });
  }, [selectedAccessory]);

  useEffect(() => {
    async function restoreBuilds() {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      try {
        const parsed = JSON.parse(stored) as SavedBuild[];
        if (Array.isArray(parsed)) setSavedBuilds(parsed);
      } catch {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    }

    void restoreBuilds();
  }, []);

  const totals = useMemo(() => {
    const prices = [demoHost.knownPriceCents, ...buildItems.map((item) => item.knownPriceCents)];
    const weights = [demoHost.knownWeightGrams, ...buildItems.map((item) => item.knownWeightGrams)];

    return {
      price:
        prices.every((value) => value !== undefined)
          ? prices.reduce<number>((sum, value) => sum + (value ?? 0), 0)
          : undefined,
      weight:
        weights.every((value) => value !== undefined)
          ? weights.reduce<number>((sum, value) => sum + (value ?? 0), 0)
          : undefined,
      unknownPrices: prices.filter((value) => value === undefined).length,
      unknownWeights: weights.filter((value) => value === undefined).length,
    };
  }, [buildItems]);

  if (!selectedAccessory || !evaluation) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Catalog unavailable</Text>
          <Text style={styles.mutedBody}>No demonstration accessories are loaded.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const presentation = getStatus(evaluation);
  const requiredProducts = evaluation.requiredComponents
    .map((component) => demoProductsById.get(component.productVariantId))
    .filter((component): component is CatalogVariant => Boolean(component));

  const unresolved = [...evaluation.unknowns];
  if (
    evaluation.status === "UNKNOWN" &&
    unresolved.length === 0 &&
    (evaluation.directMatches.length > 0 || evaluation.adapterPath.length > 0)
  ) {
    unresolved.push(
      "The interface matches, but the exact firearm and accessory combination is not backed by verified evidence.",
    );
  }

  const blocked =
    evaluation.status === "NOT_COMPATIBLE" || evaluation.status === "CONFLICT_DETECTED";

  function selectAccessory(id: string) {
    setSelectedAccessoryId(id);
    setPickerVisible(false);
    void Haptics.selectionAsync();
  }

  function addToBuild(includeRequired: boolean) {
    if (blocked) return;

    const additions = includeRequired
      ? [selectedAccessory, ...requiredProducts]
      : [selectedAccessory];

    setBuildItems((current) => {
      const existing = new Set(current.map((item) => item.id));
      return [...current, ...additions.filter((item) => !existing.has(item.id))];
    });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function removeFromBuild(id: string) {
    setBuildItems((current) => current.filter((item) => item.id !== id));
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async function saveBuild() {
    const record: SavedBuild = {
      id: String(Date.now()),
      name: `Build ${savedBuilds.length + 1}`,
      componentIds: buildItems.map((item) => item.id),
      engineVersion: ENGINE_VERSION,
      savedAt: new Date().toISOString(),
    };
    const next = [record, ...savedBuilds];
    setSavedBuilds(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.wordmark}>FITMENT</Text>
        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>DEMO DATA</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>BUILD WITH CONFIDENCE</Text>
          <Text style={styles.title}>Know what fits before you buy.</Text>
          <Text style={styles.subtitle}>
            Select an exact firearm and component. FITMENT explains the connection, required parts,
            evidence quality, and unresolved checks.
          </Text>
        </View>

        <SectionLabel>EXACT FIREARM</SectionLabel>
        <View style={styles.card}>
          <Text style={styles.kicker}>{demoHost.manufacturer}</Text>
          <Text style={styles.cardTitle}>{demoHost.exactModel}</Text>
          <Text style={styles.meta}>Exact variant · {demoHost.id}</Text>
          <View style={styles.divider} />
          <DataRow label="Known price" value={money(demoHost.knownPriceCents)} />
          <DataRow
            label="Known weight"
            value={demoHost.knownWeightGrams === undefined ? "Unknown" : `${demoHost.knownWeightGrams} g`}
            last
          />
        </View>

        <SectionLabel>SELECT COMPONENT</SectionLabel>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Select an accessory"
          style={({ pressed }) => [styles.selectionCard, pressed ? styles.pressed : null]}
          onPress={() => {
            setPickerVisible(true);
            void Haptics.selectionAsync();
          }}
        >
          <View style={styles.selectionCopy}>
            <Text style={styles.kicker}>{selectedAccessory.manufacturer}</Text>
            <Text style={styles.selectionTitle}>{selectedAccessory.exactModel}</Text>
            <Text style={styles.meta}>{selectedAccessory.category.replaceAll("_", " ")}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <View style={styles.inlineStats}>
          <DataRow label="Product price" value={money(selectedAccessory.knownPriceCents)} />
          <DataRow
            label="Known weight"
            value={
              selectedAccessory.knownWeightGrams === undefined
                ? "Unknown"
                : `${selectedAccessory.knownWeightGrams} g`
            }
            last
          />
        </View>

        <SectionLabel>COMPATIBILITY</SectionLabel>
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: presentation.background }]}>
              <Text style={[styles.statusBadgeText, { color: presentation.foreground }]}>
                {presentation.label.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.confidence}>{evaluation.confidenceScore}/100</Text>
          </View>

          <Text style={styles.summary}>{evaluation.summary}</Text>
          <Text style={styles.explanation}>
            Confidence is limited because these are demonstration records, not verified manufacturer
            claims.
          </Text>

          <View style={styles.divider} />
          <Text style={styles.detailTitle}>Required components</Text>
          <BulletList
            items={evaluation.requiredComponents.map(
              (component) => `${component.productVariantId} — ${component.reason}`,
            )}
            empty="No additional component is currently identified."
          />

          <Text style={styles.detailTitle}>Unresolved checks</Text>
          <BulletList items={unresolved} empty="No unresolved checks in this evaluation." />

          <Text style={styles.detailTitle}>Evidence</Text>
          <BulletList
            items={evaluation.evidenceSources.map((source) => `${source.title} · ${source.kind}`)}
            empty="No evidence source is attached."
          />

          <Pressable
            accessibilityRole="button"
            disabled={blocked}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed ? styles.primaryPressed : null,
              blocked ? styles.disabled : null,
            ]}
            onPress={() => addToBuild(true)}
          >
            <Text style={styles.primaryButtonText}>
              {blocked
                ? "Cannot add this component"
                : requiredProducts.length > 0
                  ? "Add component + required parts"
                  : evaluation.status === "UNKNOWN"
                    ? "Add as unresolved"
                    : "Add to build"}
            </Text>
          </Pressable>

          {requiredProducts.length > 0 && !blocked ? (
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]}
              onPress={() => addToBuild(false)}
            >
              <Text style={styles.secondaryButtonText}>Add component only</Text>
            </Pressable>
          ) : null}
        </View>

        <SectionLabel>YOUR BUILD</SectionLabel>
        <View style={styles.card}>
          <View style={styles.buildHeader}>
            <Text style={styles.cardTitle}>Current build</Text>
            <Text style={styles.componentCount}>{buildItems.length} components</Text>
          </View>

          {buildItems.length === 0 ? (
            <View style={styles.emptyBuild}>
              <Text style={styles.emptyBuildTitle}>No components added</Text>
              <Text style={styles.mutedBody}>
                Review a compatibility result, then add the component to this build.
              </Text>
            </View>
          ) : (
            <View style={styles.buildList}>
              {buildItems.map((item) => (
                <View key={item.id} style={styles.buildItem}>
                  <View style={styles.buildItemCopy}>
                    <Text style={styles.buildItemTitle}>{item.exactModel}</Text>
                    <Text style={styles.meta}>{money(item.knownPriceCents)}</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${item.exactModel}`}
                    hitSlop={12}
                    onPress={() => removeFromBuild(item.id)}
                  >
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <View style={styles.divider} />
          <DataRow label="Known build price" value={money(totals.price)} />
          <DataRow
            label="Known configured weight"
            value={totals.weight === undefined ? "Unknown" : `${totals.weight} g`}
          />
          <DataRow label="Unknown price items" value={String(totals.unknownPrices)} />
          <DataRow label="Unknown weight items" value={String(totals.unknownWeights)} last />

          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]}
            onPress={() => void saveBuild()}
          >
            <Text style={styles.secondaryButtonText}>Save on this iPhone</Text>
          </Pressable>
          <Text style={styles.storageNote}>
            This Phase 1 save stays on the device. Account sync is the next Supabase wiring step.
          </Text>
        </View>

        {savedBuilds.length > 0 ? (
          <>
            <SectionLabel>SAVED ON DEVICE</SectionLabel>
            <View style={styles.card}>
              {savedBuilds.map((build, index) => (
                <View
                  key={build.id}
                  style={
                    index === savedBuilds.length - 1 ? styles.savedRowLast : styles.savedRow
                  }
                >
                  <View style={styles.savedCopy}>
                    <Text style={styles.buildItemTitle}>{build.name}</Text>
                    <Text style={styles.meta}>
                      {build.componentIds.length} components · engine {build.engineVersion}
                    </Text>
                  </View>
                  <Text style={styles.savedDate}>
                    {new Date(build.savedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <Text style={styles.disclaimer}>
          Demonstration records are not manufacturer claims and must not be used as purchase,
          installation, safety, or legal guidance.
        </Text>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={pickerVisible}
        onRequestClose={() => setPickerVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setPickerVisible(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetEyebrow}>SELECT COMPONENT</Text>
                <Text style={styles.sheetTitle}>Accessories</Text>
              </View>
              <Pressable hitSlop={12} onPress={() => setPickerVisible(false)}>
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            </View>

            {demoAccessories.map((product) => {
              const selected = product.id === selectedAccessory.id;
              return (
                <Pressable
                  key={product.id}
                  style={({ pressed }) => [
                    styles.option,
                    selected ? styles.optionSelected : null,
                    pressed ? styles.pressed : null,
                  ]}
                  onPress={() => selectAccessory(product.id)}
                >
                  <View style={styles.optionCopy}>
                    <Text style={styles.optionManufacturer}>{product.manufacturer}</Text>
                    <Text style={styles.optionTitle}>{product.exactModel}</Text>
                    <Text style={styles.meta}>{product.category.replaceAll("_", " ")}</Text>
                  </View>
                  <View style={selected ? styles.radioSelected : styles.radio}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, justifyContent: "center", padding: 24 },
  emptyTitle: { color: colors.text, fontSize: 26, fontWeight: "800", marginBottom: 8 },
  header: {
    height: 54,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
  wordmark: { color: colors.text, fontSize: 15, fontWeight: "900", letterSpacing: 2.4 },
  demoBadge: {
    minHeight: 26,
    paddingHorizontal: 10,
    borderRadius: 999,
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  demoBadgeText: { color: colors.muted, fontSize: 10, fontWeight: "800", letterSpacing: 0.7 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingBottom: 48 },
  hero: { paddingTop: 34, paddingBottom: 34 },
  eyebrow: { color: colors.muted, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  title: {
    color: colors.text,
    fontSize: 42,
    lineHeight: 43,
    fontWeight: "800",
    letterSpacing: -1.5,
    marginTop: 10,
  },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: 16 },
  sectionLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.25,
    marginTop: 8,
    marginBottom: 9,
    marginLeft: 3,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.035,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  kicker: { color: colors.muted, fontSize: 13, marginBottom: 5 },
  cardTitle: { color: colors.text, fontSize: 18, lineHeight: 23, fontWeight: "700" },
  meta: { color: colors.faint, fontSize: 12, lineHeight: 17, marginTop: 4 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: 16 },
  dataRow: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  dataRowLast: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  dataLabel: { color: colors.muted, fontSize: 14 },
  dataValue: { color: colors.text, fontSize: 14, fontWeight: "700", textAlign: "right", flexShrink: 1 },
  selectionCard: {
    minHeight: 96,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 17,
  },
  selectionCopy: { flex: 1, paddingRight: 12 },
  selectionTitle: { color: colors.text, fontSize: 16, lineHeight: 21, fontWeight: "700" },
  chevron: { color: colors.faint, fontSize: 34, fontWeight: "300" },
  pressed: { opacity: 0.68 },
  inlineStats: { marginBottom: 24, paddingHorizontal: 4 },
  statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  statusBadge: { minHeight: 30, borderRadius: 999, paddingHorizontal: 10, justifyContent: "center", flexShrink: 1 },
  statusBadgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.45 },
  confidence: { color: colors.text, fontSize: 15, fontWeight: "800" },
  summary: { color: colors.text, fontSize: 18, lineHeight: 26, fontWeight: "600", marginTop: 20 },
  explanation: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 10 },
  detailTitle: { color: colors.text, fontSize: 13, fontWeight: "800", marginTop: 20, marginBottom: 8 },
  mutedBody: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  bulletList: { gap: 8 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  bullet: { width: 5, height: 5, borderRadius: 99, backgroundColor: colors.faint, marginTop: 8 },
  bulletText: { color: colors.muted, fontSize: 14, lineHeight: 21, flex: 1 },
  primaryButton: {
    minHeight: 54,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: colors.dark,
    marginTop: 24,
  },
  primaryPressed: { transform: [{ scale: 0.985 }], opacity: 0.9 },
  disabled: { opacity: 0.38 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginTop: 10,
  },
  secondaryButtonText: { color: colors.text, fontSize: 15, fontWeight: "700" },
  buildHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  componentCount: { color: colors.muted, fontSize: 13 },
  emptyBuild: { paddingVertical: 24 },
  emptyBuildTitle: { color: colors.text, fontSize: 15, fontWeight: "700", marginBottom: 6 },
  buildList: { marginTop: 18 },
  buildItem: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  buildItemCopy: { flex: 1, paddingVertical: 10 },
  buildItemTitle: { color: colors.text, fontSize: 14, lineHeight: 19, fontWeight: "700" },
  removeText: { color: colors.red, fontSize: 13, fontWeight: "700" },
  storageNote: { color: colors.faint, fontSize: 11, lineHeight: 17, marginTop: 12 },
  savedRow: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  savedRowLast: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  savedCopy: { flex: 1 },
  savedDate: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  disclaimer: { color: colors.faint, fontSize: 11, lineHeight: 17, textAlign: "center", paddingHorizontal: 12 },
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.28)" },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 34,
  },
  handle: { width: 38, height: 5, borderRadius: 99, backgroundColor: "#C7C7C2", alignSelf: "center" },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 20 },
  sheetEyebrow: { color: colors.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  sheetTitle: { color: colors.text, fontSize: 28, fontWeight: "800", letterSpacing: -0.6, marginTop: 4 },
  doneText: { color: colors.text, fontSize: 15, fontWeight: "700" },
  option: {
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 15,
    borderRadius: 17,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 10,
  },
  optionSelected: { borderColor: colors.dark, borderWidth: 1.2 },
  optionCopy: { flex: 1 },
  optionManufacturer: { color: colors.muted, fontSize: 12, marginBottom: 3 },
  optionTitle: { color: colors.text, fontSize: 15, lineHeight: 20, fontWeight: "700" },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  radioSelected: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.dark, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 11, height: 11, borderRadius: 99, backgroundColor: colors.dark },
});
