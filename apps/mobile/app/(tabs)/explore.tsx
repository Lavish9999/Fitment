import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ExactProductVisual } from "../../src/components/ExactProductVisual";
import {
  AppHeader,
  PrimaryButton,
  Screen,
  SectionTitle,
  SelectorRow,
} from "../../src/components/ui";
import { categoryLabel, statusPresentation } from "../../src/presentation";
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
      <AppHeader title="Explore" subtitle="Your exact firearm is the starting point." />
      <View style={styles.catalogBanner}>
        <Ionicons name="shield-checkmark-outline" size={14} color={colors.accent} />
        <Text style={styles.catalogText}>
          {catalogMode === "PREVIEW" ? "Preview catalog" : "Live catalog"} · verification shown per item
          {catalogRefreshing ? " · refreshing" : ""}
        </Text>
      </View>

      <ExactProductVisual
        productVariantId={selectedHost.id}
        productName={selectedHost.exactModel}
        manufacturer={selectedHost.manufacturer}
        onPress={() => router.push("/select-firearm")}
      />

      <View style={styles.primaryAction}>
        <PrimaryButton
          label="Build with this firearm"
          icon="arrow-forward"
          onPress={() => router.push("/builder")}
        />
      </View>

      <SectionTitle>Latest fit check</SectionTitle>
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
  primaryAction: { marginTop: spacing.sm },
});
