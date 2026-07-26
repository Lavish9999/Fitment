import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { AppHeader, Card, Screen, SectionTitle } from "../../src/components/ui";
import { colors, fontFamily, radius, spacing } from "../../src/theme";

const rows = [
  { icon: "lock-closed-outline" as const, title: "Private by default", body: "Current build data stays on this iPhone." },
  { icon: "shield-checkmark-outline" as const, title: "Evidence before confidence", body: "Weak records cannot become verified claims." },
  { icon: "git-branch-outline" as const, title: "Versioned results", body: "Compatibility output carries an engine version." },
];

export default function ProfileScreen() {
  return (
    <Screen>
      <AppHeader title="Profile" subtitle="Account, privacy, and FITMENT status." />

      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>F</Text>
        </View>
        <View style={styles.identityCopy}>
          <Text style={styles.identityTitle}>Local tester</Text>
          <Text style={styles.identityBody}>No account connected</Text>
        </View>
        <View style={styles.localPill}>
          <Text style={styles.localPillText}>LOCAL</Text>
        </View>
      </View>

      <SectionTitle>Privacy model</SectionTitle>
      <Card style={styles.rowsCard}>
        {rows.map((row, index) => (
          <View key={row.title} style={[styles.row, index === rows.length - 1 ? styles.rowLast : null]}>
            <View style={styles.rowIcon}>
              <Ionicons name={row.icon} size={19} color={colors.inkSoft} />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>{row.title}</Text>
              <Text style={styles.rowBody}>{row.body}</Text>
            </View>
          </View>
        ))}
      </Card>

      <SectionTitle>App status</SectionTitle>
      <Card>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Catalog</Text>
          <Text style={styles.statusValue}>Demo records</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Engine</Text>
          <Text style={styles.statusValue}>0.2.0-demo</Text>
        </View>
        <View style={[styles.statusRow, styles.statusRowLast]}>
          <Text style={styles.statusLabel}>Cloud sync</Text>
          <Text style={styles.statusValueMuted}>Not connected</Text>
        </View>
      </Card>

      <Text style={styles.disclaimer}>
        Demonstration records are not manufacturer claims and are not purchase, installation, safety, or legal guidance.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { minHeight: 82, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.md, borderRadius: radius.lg, backgroundColor: colors.ink },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent },
  avatarText: { color: colors.white, fontFamily, fontSize: 19, fontWeight: "700" },
  identityCopy: { flex: 1 },
  identityTitle: { color: colors.white, fontFamily, fontSize: 15, fontWeight: "600" },
  identityBody: { color: "#B9B8B0", fontFamily, fontSize: 12, marginTop: 4 },
  localPill: { minHeight: 28, paddingHorizontal: 10, borderRadius: radius.pill, justifyContent: "center", backgroundColor: colors.navActive },
  localPillText: { color: colors.white, fontFamily, fontSize: 10, fontWeight: "700", letterSpacing: 0.8 },
  rowsCard: { paddingVertical: 3 },
  row: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowLast: { borderBottomWidth: 0 },
  rowIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceMuted },
  rowCopy: { flex: 1 },
  rowTitle: { color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600" },
  rowBody: { color: colors.inkSoft, fontFamily, fontSize: 12, lineHeight: 17, marginTop: 3 },
  statusRow: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  statusRowLast: { borderBottomWidth: 0 },
  statusLabel: { color: colors.inkSoft, fontFamily, fontSize: 14 },
  statusValue: { color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600" },
  statusValueMuted: { color: colors.inkFaint, fontFamily, fontSize: 14, fontWeight: "600" },
  disclaimer: { color: colors.inkFaint, fontFamily, fontSize: 11, lineHeight: 17, textAlign: "center", paddingHorizontal: spacing.lg, marginTop: spacing.xl },
});
