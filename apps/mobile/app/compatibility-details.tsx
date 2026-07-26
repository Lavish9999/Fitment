import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Badge, Card, ModalScreen, PrimaryButton } from "../src/components/ui";
import {
  confidenceNote,
  humanizeTechnicalText,
  interfaceLabel,
  money,
  productLabel,
  resultExplanation,
  resultHeadline,
  statusPresentation,
  unresolvedChecks,
} from "../src/presentation";
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
  const { evaluation, selectedAccessory, requiredProducts, blocked, addSelected } = useFitment();
  const presentation = statusPresentation(evaluation);
  const unresolved = unresolvedChecks(evaluation);

  const connectionItems = [
    ...evaluation.directMatches.map((id) => `Direct match on the ${interfaceLabel(id)}.`),
    ...evaluation.adapterPath.map((id, index) => `Adapter ${index + 1}: ${productLabel(id)}.`),
  ];

  const lastVerified = evaluation.lastVerifiedAt
    ? new Date(evaluation.lastVerifiedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Never";

  return (
    <ModalScreen title="Compatibility details">
      <Card>
        <View style={styles.resultTop}>
          <Badge
            label={presentation.label}
            foreground={presentation.foreground}
            background={presentation.background}
          />
          <Text style={styles.score}>{confidenceNote(evaluation)}</Text>
        </View>
        <Text style={styles.summary}>{resultHeadline(evaluation)}</Text>
        <Text style={styles.explanation}>{resultExplanation(evaluation, selectedAccessory)}</Text>
      </Card>

      <DetailSection
        title="Connection"
        items={connectionItems}
        empty="No verified connection between this firearm and component is recorded."
      />
      <DetailSection
        title="Required parts"
        items={evaluation.requiredComponents.map((item) => {
          const product = requiredProducts.find((p) => p.id === item.productVariantId);
          const name = product ? product.family : productLabel(item.productVariantId);
          const price = product ? ` (${money(product.knownPriceCents)})` : "";
          return `${name}${price} — ${humanizeTechnicalText(item.reason)}`;
        })}
        empty="No additional part is identified."
      />
      <DetailSection
        title="Unresolved checks"
        items={unresolved}
        empty="No unresolved checks are attached to this result."
      />
      <DetailSection
        title="Evidence"
        items={evaluation.evidenceSources.map(
          (source) => `${source.title} · ${source.kind.replaceAll("_", " ").toLowerCase()}`,
        )}
        empty="No evidence source is attached."
      />
      <DetailSection
        title="Known conflicts"
        items={evaluation.knownConflicts.map(humanizeTechnicalText)}
        empty="No known conflict is recorded."
      />

      <View style={styles.callout}>
        <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
        <Text style={styles.calloutText}>
          A matching interface does not override missing evidence, dimensional checks, or
          manufacturer restrictions.
        </Text>
      </View>

      <View style={styles.technical}>
        <Text style={styles.technicalTitle}>Technical record</Text>
        <TechnicalRow label="Last verified" value={lastVerified} />
        <TechnicalRow label="Engine" value={evaluation.engineVersion} />
        <TechnicalRow label="Status code" value={evaluation.status} />
        {evaluation.directMatches.length > 0 ? (
          <TechnicalRow label="Interfaces" value={evaluation.directMatches.join(", ")} />
        ) : null}
        {evaluation.adapterPath.length > 0 ? (
          <TechnicalRow label="Adapter path" value={evaluation.adapterPath.join(" → ")} />
        ) : null}
      </View>

      <PrimaryButton
        label={
          blocked
            ? "Cannot add this component"
            : requiredProducts.length > 0
              ? "Add with required parts"
              : "Add to build"
        }
        icon={blocked ? undefined : "add"}
        disabled={blocked}
        onPress={() => {
          addSelected(true);
          router.back();
        }}
      />
    </ModalScreen>
  );
}

function TechnicalRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.technicalRow}>
      <Text style={styles.technicalLabel}>{label}</Text>
      <Text style={styles.technicalValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  resultTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  score: { color: colors.inkSoft, fontFamily, fontSize: 13, fontWeight: "600", flexShrink: 1 },
  summary: {
    color: colors.ink,
    fontFamily,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
    letterSpacing: -0.3,
    marginTop: spacing.sm,
  },
  explanation: { color: colors.inkSoft, fontFamily, fontSize: 14, lineHeight: 20, marginTop: spacing.xs },
  section: { marginTop: spacing.lg },
  sectionTitle: { color: colors.ink, fontFamily, fontSize: 16, fontWeight: "600", marginBottom: spacing.xs },
  empty: { color: colors.inkSoft, fontFamily, fontSize: 14, lineHeight: 20 },
  detailRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.xs, paddingVertical: 5 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.accent, marginTop: 7 },
  detailText: { flex: 1, color: colors.inkSoft, fontFamily, fontSize: 14, lineHeight: 20 },
  callout: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    marginTop: spacing.lg,
  },
  calloutText: { flex: 1, color: colors.inkSoft, fontFamily, fontSize: 13, lineHeight: 18 },
  technical: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  technicalTitle: { color: colors.inkFaint, fontFamily, fontSize: 12, fontWeight: "600", marginBottom: 4 },
  technicalRow: { flexDirection: "row", gap: spacing.sm, paddingVertical: 3 },
  technicalLabel: { width: 92, color: colors.inkFaint, fontFamily, fontSize: 12 },
  technicalValue: { flex: 1, color: colors.inkSoft, fontFamily, fontSize: 12 },
});
