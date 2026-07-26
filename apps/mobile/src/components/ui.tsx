import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontFamily, radius, shadow, spacing, tabBarMetrics } from "../theme";

export function Screen({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const bottomPadding =
    insets.bottom + tabBarMetrics.height + tabBarMetrics.bottomOffset + tabBarMetrics.clearance;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
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
      <Text style={styles.screenTitle}>{title}</Text>
      {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function DemoBanner() {
  return (
    <View style={styles.demoBanner}>
      <Ionicons name="flask-outline" size={13} color={colors.inkFaint} />
      <Text style={styles.demoBannerText}>Demo catalog — unverified demonstration data</Text>
    </View>
  );
}

export function ModalScreen({
  title,
  children,
  scroll = true,
}: {
  title: string;
  children: ReactNode;
  scroll?: boolean;
}) {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{title}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={8}
          onPress={() => router.back()}
          style={({ pressed }) => [styles.modalClose, pressed ? styles.pressed : null]}
        >
          <Ionicons name="close" size={20} color={colors.ink} />
        </Pressable>
      </View>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={styles.modalBody}>{children}</View>
      )}
    </SafeAreaView>
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
  icon?: keyof typeof Ionicons.glyphMap | undefined;
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
      {icon ? <Ionicons name={icon} size={17} color={colors.white} /> : null}
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
      {icon ? <Ionicons name={icon} size={17} color={colors.ink} /> : null}
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function SelectorRow({
  eyebrow,
  title,
  detail,
  icon,
  onPress,
}: {
  eyebrow: string;
  title: string;
  detail?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.selectorRow, pressed ? styles.rowPressed : null]}
    >
      {icon ? (
        <View style={styles.selectorIcon}>
          <Ionicons name={icon} size={19} color={colors.ink} />
        </View>
      ) : null}
      <View style={styles.selectorCopy}>
        <Text style={styles.rowEyebrow}>{eyebrow}</Text>
        <Text style={styles.rowTitle}>{title}</Text>
        {detail ? <Text style={styles.rowDetail}>{detail}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={17} color={colors.inkFaint} />
    </Pressable>
  );
}

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={20} color={colors.inkSoft} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.md },
  header: { paddingTop: spacing.xs, paddingBottom: spacing.md },
  screenTitle: {
    color: colors.ink,
    fontFamily,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: "600",
    letterSpacing: -0.6,
  },
  screenSubtitle: {
    color: colors.inkSoft,
    fontFamily,
    fontSize: 14,
    lineHeight: 19,
    marginTop: spacing.xxs,
  },
  demoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: spacing.sm,
  },
  demoBannerText: { color: colors.inkFaint, fontFamily, fontSize: 12, fontWeight: "500" },
  modalHeader: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  modalTitle: {
    flex: 1,
    color: colors.ink,
    fontFamily,
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  modalClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  modalContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  modalBody: { flex: 1 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily,
    fontSize: 18,
    fontWeight: "600",
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
    minHeight: 26,
    borderRadius: radius.pill,
    justifyContent: "center",
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  badgeText: { fontFamily, fontSize: 12, fontWeight: "600" },
  metricRow: {
    minHeight: 44,
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
    minHeight: 48,
    borderRadius: radius.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.md,
  },
  primaryButtonText: { color: colors.white, fontFamily, fontSize: 15, fontWeight: "600" },
  secondaryButton: {
    minHeight: 46,
    borderRadius: radius.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
  },
  secondaryButtonText: { color: colors.ink, fontFamily, fontSize: 15, fontWeight: "600" },
  buttonPressed: { transform: [{ scale: 0.985 }], opacity: 0.85 },
  buttonDisabled: { opacity: 0.36 },
  pressed: { opacity: 0.65 },
  selectorRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowPressed: { opacity: 0.68 },
  selectorIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  selectorCopy: { flex: 1 },
  rowEyebrow: { color: colors.inkFaint, fontFamily, fontSize: 12, marginBottom: 2 },
  rowTitle: { color: colors.ink, fontFamily, fontSize: 16, lineHeight: 21, fontWeight: "600" },
  rowDetail: { color: colors.inkSoft, fontFamily, fontSize: 13, marginTop: 3 },
  emptyState: { alignItems: "center", paddingVertical: spacing.xl, paddingHorizontal: spacing.md },
  emptyIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    marginBottom: spacing.sm,
  },
  emptyTitle: { color: colors.ink, fontFamily, fontSize: 15, fontWeight: "600" },
  emptyBody: {
    color: colors.inkSoft,
    fontFamily,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginTop: spacing.xxs,
  },
});
