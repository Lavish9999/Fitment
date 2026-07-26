import { Platform } from "react-native";

export const colors = {
  background: "#F4F2ED",
  surface: "#FFFFFF",
  surfaceMuted: "#ECE9E2",
  ink: "#171714",
  inkSoft: "#55554F",
  inkFaint: "#8A8981",
  line: "#DEDBD3",
  accent: "#C8683B",
  accentSoft: "#F5E3D8",
  success: "#277A4A",
  successSoft: "#E4F1E8",
  warning: "#96601D",
  warningSoft: "#F7ECD9",
  danger: "#B4433A",
  dangerSoft: "#F7E5E2",
  nav: "#1D1D1A",
  navActive: "#383833",
  white: "#FFFFFF",
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 22,
  pill: 999,
} as const;

export const fontFamily = Platform.OS === "ios" ? "System" : "sans-serif";

export const shadow = {
  shadowColor: "#000000",
  shadowOpacity: 0.05,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 2,
} as const;
