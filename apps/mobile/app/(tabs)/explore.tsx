import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { demoHost } from "@fitment/catalog";

import { AppHeader, Card, PrimaryButton, Screen, SectionTitle } from "../../src/components/ui";
import { money } from "../../src/presentation";
import { colors, fontFamily, radius, spacing } from "../../src/theme";

const checks = [
  { icon: "git-compare-outline" as const, title: "Connection", body: "Direct interfaces and required adapters." },
  { icon: "shield-checkmark-outline" as const, title: "Evidence", body: "Source quality and unresolved claims." },
  { icon: "receipt-outline" as const, title: "Complete cost", body: "Accessory plus required components." },
];

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <Screen>
      <AppHeader title="Build smarter." subtitle="Exact variants, clear answers, no compatibility guessing." />

      <Card style={styles.heroCard}>
        <View style={styles.heroAccent} />
        <View style={styles.heroIcon}>
          <Ionicons name="construct-outline" size={24} color={colors.accent} />
        </View>
        <Text style={styles.heroEyebrow}>COMPATIBILITY BUILDER</Text>
        <Text style={styles.heroTitle}>Check a component before it reaches your cart.</Text>
        <Text style={styles.heroBody}>
          Start with the exact firearm, choose a component, then review the connection and required parts.
        </Text>
        <PrimaryButton label="Start a build" icon="arrow-forward" onPress={() => router.push("/builder")} />
      </Card>

      <SectionTitle>Current firearm</SectionTitle>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/builder")}
        style={({ pressed }) => [styles.hostRow, pressed ? styles.pressed : null]}
      >
        <View style={styles.hostGlyph}>
          <Ionicons name="barcode-outline" size={21} color={colors.ink} />
        </View>
        <View style={styles.hostCopy}>
          <Text style={styles.hostMaker}>{demoHost.manufacturer}</Text>
          <Text style={styles.hostName} numberOfLines={1}>{demoHost.exactModel}</Text>
          <Text style={styles.hostMeta}>{money(demoHost.knownPriceCents)} · {demoHost.knownWeightGrams ?? "—"} g</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
      </Pressable>

      <SectionTitle>What gets checked</SectionTitle>
      <Card style={styles.checkCard}>
        {checks.map((item, index) => (
          <View key={item.title} style={[styles.checkRow, index === checks.length - 1 ? styles.checkRowLast : null]}>
            <View style={styles.checkIcon}>
              <Ionicons name={item.icon} size={19} color={colors.inkSoft} />
            </View>
            <View style={styles.checkCopy}>
              <Text style={styles.checkTitle}>{item.title}</Text>
              <Text style={styles.checkBody}>{item.body}</Text>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: { overflow: "hidden", paddingTop: 22 },
  heroAccent: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: colors.accent },
  heroIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", backgroundColor: colors.accentSoft },
  heroEyebrow: { color: colors.accent, fontFamily, fontSize: 11, fontWeight: "700", letterSpacing: 1.1, marginTop: spacing.md },
  heroTitle: { color: colors.ink, fontFamily, fontSize: 25, lineHeight: 30, fontWeight: "700", letterSpacing: -0.5, marginTop: spacing.sm },
  heroBody: { color: colors.inkSoft, fontFamily, fontSize: 14, lineHeight: 20, marginTop: spacing.sm, marginBottom: spacing.lg },
  hostRow: { minHeight: 86, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  pressed: { opacity: 0.68 },
  hostGlyph: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceMuted },
  hostCopy: { flex: 1 },
  hostMaker: { color: colors.inkFaint, fontFamily, fontSize: 12 },
  hostName: { color: colors.ink, fontFamily, fontSize: 15, fontWeight: "600", marginTop: 2 },
  hostMeta: { color: colors.inkSoft, fontFamily, fontSize: 12, marginTop: 5 },
  checkCard: { paddingVertical: 4 },
  checkRow: { minHeight: 70, flexDirection: "row", alignItems: "center", gap: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  checkRowLast: { borderBottomWidth: 0 },
  checkIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceMuted },
  checkCopy: { flex: 1 },
  checkTitle: { color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600" },
  checkBody: { color: colors.inkSoft, fontFamily, fontSize: 13, marginTop: 3 },
});
