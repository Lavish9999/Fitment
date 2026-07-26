import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, fontFamily, radius, shadow, spacing } from "../theme";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        <Text style={styles.wordmark}>FITMENT</Text>
        <Text style={styles.screenTitle}>{title}</Text>
        {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.demoPill}>
        <Text style={styles.demoPillText}>DEMO</Text>
      </View>
    </View>
  );
}

export function SectionTitle({ children, action }: { children: string; action?: ReactNode }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {action}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Badge({
  label,
  foreground = colors.inkSoft,
  background = colors.surfaceMuted,
}: {
  label: string;
  foreground?: string;
  background?: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <Text style={[styles.badgeText, { color: foreground }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function MetricRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.metricRow, last ? styles.metricRowLast : null]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        pressed ? styles.buttonPressed : null,
        disabled ? styles.buttonDisabled : null,
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={colors.white} /> : null}
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  icon,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.secondaryButton, pressed ? styles.buttonPressed : null]}
    >
      {icon ? <Ionicons name={icon} size={18} color={colors.ink} /> : null}
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function ChevronRow({
  eyebrow,
  title,
  detail,
  onPress,
}: {
  eyebrow: string;
  title: string;
  detail?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.chevronRow, pressed ? styles.rowPressed : null]}
    >
      <View style={styles.chevronCopy}>
        <Text style={styles.rowEyebrow}>{eyebrow}</Text>
        <Text style={styles.rowTitle} numberOfLines={2}>{title}</Text>
        {detail ? <Text style={styles.rowDetail} numberOfLines={1}>{detail}</Text> : null}
      </View>
      <View style={styles.chevronCircle}>
        <Ionicons name="chevron-forward" size={17} color={colors.inkSoft} />
      </View>
    </Pressable>
  );
}

export function EmptyState({ icon, title, body }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={22} color={colors.inkSoft} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingBottom: 122 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  headerCopy: { flex: 1 },
  wordmark: {
    color: colors.inkFaint,
    fontFamily,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.1,
    marginBottom: spacing.sm,
  },
  screenTitle: {
    color: colors.ink,
    fontFamily,
    fontSize: 32,
    lineHeight: 37,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  screenSubtitle: {
    color: colors.inkSoft,
    fontFamily,
    fontSize: 15,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  demoPill: {
    minHeight: 30,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    marginTop: 2,
  },
  demoPillText: {
    color: colors.inkSoft,
    fontFamily,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.9,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    ...shadow,
  },
  badge: {
    minHeight: 28,
    maxWidth: "78%",
    borderRadius: radius.pill,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  badgeText: { fontFamily, fontSize: 11, fontWeight: "700" },
  metricRow: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  metricRowLast: { borderBottomWidth: 0 },
  metricLabel: { color: colors.inkSoft, fontFamily, fontSize: 14 },
  metricValue: {
    color: colors.ink,
    fontFamily,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flexShrink: 1,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.md,
  },
  primaryButtonText: { color: colors.white, fontFamily, fontSize: 15, fontWeight: "700" },
  secondaryButton: {
    minHeight: 50,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
  },
  secondaryButtonText: { color: colors.ink, fontFamily, fontSize: 15, fontWeight: "600" },
  buttonPressed: { transform: [{ scale: 0.985 }], opacity: 0.86 },
  buttonDisabled: { opacity: 0.36 },
  chevronRow: {
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: spacing.md,
  },
  rowPressed: { opacity: 0.68 },
  chevronCopy: { flex: 1 },
  rowEyebrow: { color: colors.inkFaint, fontFamily, fontSize: 12, marginBottom: 4 },
  rowTitle: { color: colors.ink, fontFamily, fontSize: 16, lineHeight: 21, fontWeight: "600" },
  rowDetail: { color: colors.inkSoft, fontFamily, fontSize: 12, marginTop: 5 },
  chevronCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  emptyState: { alignItems: "center", paddingVertical: spacing.xl, paddingHorizontal: spacing.md },
  emptyIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    marginBottom: spacing.md,
  },
  emptyTitle: { color: colors.ink, fontFamily, fontSize: 16, fontWeight: "600" },
  emptyBody: {
    color: colors.inkSoft,
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: spacing.xs,
  },
});
