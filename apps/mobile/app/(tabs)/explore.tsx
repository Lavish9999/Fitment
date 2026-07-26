import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import {
  AppHeader,
  Card,
  PrimaryButton,
  Screen,
  SectionTitle,
  SelectorRow,
} from "../../src/components/ui";
import { categoryLabel, money, statusPresentation } from "../../src/presentation";
import { useFitment } from "../../src/state/FitmentProvider";
import { colors, fontFamily, spacing } from "../../src/theme";

export default function ExploreScreen() {
  const router = useRouter();
  const {
    selectedHost,
    selectedAccessory,
    evaluation,
    buildItems,
    savedBuilds,
    catalogMode,
    catalogRefreshing,
  } = useFitment();
  const presentation = statusPresentation(evaluation);

  return (
    <Screen>
      <AppHeader title="Explore" subtitle="Know what fits before you buy." />
      <View style={styles.catalogBanner}>
        <Ionicons name="shield-checkmark-outline" size={14} color={colors.accent} />
        <Text style={styles.catalogText}>
          {catalogMode === "PREVIEW" ? "Preview catalog" : "Live catalog"} · verification shown per item
          {catalogRefreshing ? " · refreshing" : ""}
        </Text>
      </View>

      <Card style={styles.actionCard}>
        <View style={styles.actionTop}>
          <View style={styles.actionIcon}>
            <Ionicons name="git-compare-outline" size={19} color={colors.accent} />
          </View>
          <Text style={styles.actionLabel}>Compatibility check</Text>
        </View>
        <Text style={styles.actionTitle}>Check a part before you buy it.</Text>
        <Text style={styles.actionBody}>
          Pick your exact firearm and a component, then see what fits and what else is required.
        </Text>
        <PrimaryButton label="Start a build" icon="arrow-forward" onPress={() => router.push("/builder")} />
      </Card>

      <SectionTitle>Current firearm</SectionTitle>
      <SelectorRow
        icon="barcode-outline"
        eyebrow={selectedHost.manufacturer}
        title={selectedHost.exactModel}
        detail={`${money(selectedHost.knownPriceCents)} · ${selectedHost.knownWeightGrams ?? "—"} g`}
        onPress={() => router.push("/select-firearm")}
      />

      <SectionTitle>Recent check</SectionTitle>
      <SelectorRow
        icon="scan-outline"
        eyebrow={`${selectedAccessory.manufacturer} · ${categoryLabel(selectedAccessory.category)}`}
        title={selectedAccessory.exactModel}
        detail={presentation.label}
        onPress={() => router.push("/builder")}
      />

      <SectionTitle>Your builds</SectionTitle>
      <SelectorRow
        icon="albums-outline"
        eyebrow="Armory"
        title={
          buildItems.length === 0
            ? "Current build is empty"
            : `Current build · ${buildItems.length} component${buildItems.length === 1 ? "" : "s"}`
        }
        detail={
          savedBuilds.length === 0
            ? "No saved builds yet"
            : `${savedBuilds.length} saved build${savedBuilds.length === 1 ? "" : "s"}`
        }
        onPress={() => router.push("/armory")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  catalogBanner: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: spacing.sm,
  },
  catalogText: { flex: 1, color: colors.inkFaint, fontFamily, fontSize: 12, fontWeight: "500" },
  actionCard: { gap: spacing.sm },
  actionTop: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentSoft,
  },
  actionLabel: { color: colors.inkSoft, fontFamily, fontSize: 13, fontWeight: "600" },
  actionTitle: {
    color: colors.ink,
    fontFamily,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "600",
    letterSpacing: -0.4,
  },
  actionBody: { color: colors.inkSoft, fontFamily, fontSize: 14, lineHeight: 20, marginBottom: spacing.xxs },
});
