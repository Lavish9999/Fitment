import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge, Card, PrimaryButton } from "../src/components/ui";
import { statusPresentation, unresolvedChecks } from "../src/presentation";
import { useFitment } from "../src/state/FitmentProvider";
import { colors, fontFamily, radius, spacing } from "../src/theme";

function DetailSection({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.length === 0 ? (
        <Text style={styles.empty}>{empty}</Text>
      ) : (
        items.map((item) => (
          <View key={item} style={styles.detailRow}>
            <View style={styles.dot} />
            <Text style={styles.detailText}>{item}</Text>
          </View>
        ))
      )}
    </View>
  );
}

export default function CompatibilityDetailsScreen() {
  const router = useRouter();
  const { evaluation, requiredProducts, blocked, addSelected } = useFitment();
  const presentation = statusPresentation(evaluation);
  const unresolved = unresolvedChecks(evaluation);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>COMPATIBILITY</Text>
          <Text style={styles.title}>Result details</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.close, pressed ? styles.pressed : null]}
        >
          <Ionicons name="close" size={21} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.resultTop}>
            <Badge label={presentation.label} foreground={presentation.foreground} background={presentation.background} />
            <View style={styles.scoreWrap}>
              <Text style={styles.score}>{evaluation.confidenceScore}</Text>
              <Text style={styles.scoreLabel}>/ 100</Text>
            </View>
          </View>
          <Text style={styles.summary}>{evaluation.summary}</Text>
          <Text style={styles.engine}>Engine {evaluation.engineVersion}</Text>
        </Card>

        <DetailSection
          title="Required parts"
          items={evaluation.requiredComponents.map((item) => `${item.productVariantId} — ${item.reason}`)}
          empty="No additional component is identified."
        />
        <DetailSection
          title="Unresolved checks"
          items={unresolved}
          empty="No unresolved checks are attached to this result."
        />
        <DetailSection
          title="Evidence"
          items={evaluation.evidenceSources.map((source) => `${source.title} · ${source.kind.replaceAll("_", " ")}`)}
          empty="No evidence source is attached."
        />
        <DetailSection
          title="Known conflicts"
          items={evaluation.knownConflicts}
          empty="No known conflict is recorded."
        />

        <View style={styles.callout}>
          <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
          <Text style={styles.calloutText}>
            A matching interface does not override missing evidence, dimensional checks, or manufacturer restrictions.
          </Text>
        </View>

        <PrimaryButton
          label={blocked ? "Cannot add this component" : requiredProducts.length > 0 ? "Add with required parts" : "Add to build"}
          icon="add"
          disabled={blocked}
          onPress={() => {
            addSelected(true);
            router.back();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { minHeight: 84, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, paddingHorizontal: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  eyebrow: { color: colors.inkFaint, fontFamily, fontSize: 10, fontWeight: "700", letterSpacing: 1.4 },
  title: { color: colors.ink, fontFamily, fontSize: 26, fontWeight: "700", letterSpacing: -0.5, marginTop: 4 },
  close: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  pressed: { opacity: 0.65 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.md },
  resultTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  scoreWrap: { flexDirection: "row", alignItems: "baseline" },
  score: { color: colors.ink, fontFamily, fontSize: 26, fontWeight: "700", letterSpacing: -0.7 },
  scoreLabel: { color: colors.inkFaint, fontFamily, fontSize: 12, marginLeft: 3 },
  summary: { color: colors.ink, fontFamily, fontSize: 20, lineHeight: 26, fontWeight: "700", letterSpacing: -0.3, marginTop: spacing.lg },
  engine: { color: colors.inkFaint, fontFamily, fontSize: 11, marginTop: spacing.sm },
  section: { paddingVertical: spacing.sm },
  sectionTitle: { color: colors.ink, fontFamily, fontSize: 17, fontWeight: "700", marginBottom: spacing.sm },
  empty: { color: colors.inkSoft, fontFamily, fontSize: 14, lineHeight: 20 },
  detailRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingVertical: 7 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent, marginTop: 7 },
  detailText: { flex: 1, color: colors.inkSoft, fontFamily, fontSize: 14, lineHeight: 21 },
  callout: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.accentSoft },
  calloutText: { flex: 1, color: colors.inkSoft, fontFamily, fontSize: 13, lineHeight: 19 },
});
