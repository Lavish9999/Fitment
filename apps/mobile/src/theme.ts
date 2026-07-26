import { Platform } from "react-native";

export const colors = {
  background: "#F5F3EE",
  surface: "#FFFFFF",
  surfaceMuted: "#EDEAE3",
  ink: "#1A1915",
  inkSoft: "#57564F",
  inkFaint: "#8B8A81",
  line: "#E1DED6",
  accent: "#B85C34",
  accentSoft: "#F4E4D9",
  success: "#2E7047",
  successSoft: "#E5F0E8",
  warning: "#8F5D1D",
  warningSoft: "#F6ECDA",
  danger: "#A8433C",
  dangerSoft: "#F6E5E2",
  nav: "#191916",
  white: "#FFFFFF",
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  pill: 999,
} as const;

export const fontFamily = Platform.OS === "ios" ? "System" : "sans-serif";

export const tabBarMetrics = {
  height: 58,
  horizontalInset: 28,
  minimumBottomOffset: 8,
  clearance: 22,
} as const;

export function tabBarBottom(safeAreaBottom: number): number {
  return Math.max(safeAreaBottom - 14, tabBarMetrics.minimumBottomOffset);
}

export function screenBottomPadding(safeAreaBottom: number): number {
  return tabBarBottom(safeAreaBottom) + tabBarMetrics.height + tabBarMetrics.clearance;
}

export const shadow = {
  shadowColor: "#000000",
  shadowOpacity: 0.04,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;
