import type { CompatibilityEvaluation } from "@fitment/domain";

import { colors } from "./theme";

export interface StatusPresentation {
  label: string;
  foreground: string;
  background: string;
}

export function money(cents?: number): string {
  if (cents === undefined) return "Unknown";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function categoryLabel(category: string): string {
  return category
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function statusPresentation(evaluation: CompatibilityEvaluation): StatusPresentation {
  switch (evaluation.status) {
    case "VERIFIED_DIRECT":
      return { label: "Verified direct fit", foreground: colors.success, background: colors.successSoft };
    case "VERIFIED_WITH_ADAPTER":
      return { label: "Verified with adapter", foreground: colors.success, background: colors.successSoft };
    case "LIKELY_COMPATIBLE":
      return { label: "Likely compatible", foreground: colors.warning, background: colors.warningSoft };
    case "NEEDS_MEASUREMENT":
      return { label: "Needs measurement", foreground: colors.warning, background: colors.warningSoft };
    case "CONFLICT_DETECTED":
      return { label: "Conflict detected", foreground: colors.danger, background: colors.dangerSoft };
    case "NOT_COMPATIBLE":
      return { label: "Not compatible", foreground: colors.danger, background: colors.dangerSoft };
    case "UNKNOWN":
      if (evaluation.directMatches.length > 0 || evaluation.adapterPath.length > 0) {
        return { label: "Match found · unverified", foreground: colors.warning, background: colors.warningSoft };
      }
      return { label: "Not enough data", foreground: colors.inkSoft, background: colors.surfaceMuted };
  }
}

export function unresolvedChecks(evaluation: CompatibilityEvaluation): string[] {
  if (evaluation.unknowns.length > 0) return evaluation.unknowns;
  if (
    evaluation.status === "UNKNOWN" &&
    (evaluation.directMatches.length > 0 || evaluation.adapterPath.length > 0)
  ) {
    return ["The connection matches, but the exact combination is not backed by verified evidence."];
  }
  return [];
}
