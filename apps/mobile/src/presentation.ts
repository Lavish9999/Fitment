import { phase1ProductsById } from "@fitment/catalog";
import type { CatalogVariant, CompatibilityEvaluation } from "@fitment/domain";

import { colors } from "./theme";

export interface StatusPresentation {
  label: string;
  foreground: string;
  background: string;
}

export function money(cents?: number | null): string {
  if (cents === undefined || cents === null) return "Unknown";
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

const interfaceLabels: Record<string, string> = {
  MOS_PLATE_SYSTEM: "MOS optic plate system",
  GLOCK_MOS_STANDARD: "GLOCK MOS optic system",
  RM_RMR_FOOTPRINT: "RMR footprint",
  SHIELD_RMSC_FOOTPRINT: "Shield RMSc footprint",
  GLOCK_UNIVERSAL_RAIL: "GLOCK accessory rail",
  PICATINNY_1913_COMPACT: "compact 1913 accessory rail",
};

export function interfaceLabel(interfaceId: string): string {
  return (
    interfaceLabels[interfaceId] ??
    interfaceId
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export function productLabel(productVariantId: string): string {
  const product = phase1ProductsById.get(productVariantId);
  return product ? product.family : productVariantId;
}

export function humanizeTechnicalText(text: string): string {
  let result = text;
  for (const [id, label] of Object.entries(interfaceLabels)) {
    result = result.replaceAll(id, label);
  }
  for (const [id, product] of phase1ProductsById) {
    result = result.replaceAll(id, product.family);
  }
  return result;
}

function hasInterfaceMatch(evaluation: CompatibilityEvaluation): boolean {
  return evaluation.directMatches.length > 0 || evaluation.adapterPath.length > 0;
}

export function statusPresentation(evaluation: CompatibilityEvaluation): StatusPresentation {
  switch (evaluation.status) {
    case "VERIFIED_DIRECT":
      return { label: "Verified fit", foreground: colors.success, background: colors.successSoft };
    case "VERIFIED_WITH_ADAPTER":
      return {
        label: "Fits with required adapter",
        foreground: colors.success,
        background: colors.successSoft,
      };
    case "LIKELY_COMPATIBLE":
      return {
        label: "Likely fit — unverified",
        foreground: colors.warning,
        background: colors.warningSoft,
      };
    case "NEEDS_MEASUREMENT":
      return {
        label: "Measurement required",
        foreground: colors.warning,
        background: colors.warningSoft,
      };
    case "CONFLICT_DETECTED":
      return { label: "Known conflict", foreground: colors.danger, background: colors.dangerSoft };
    case "NOT_COMPATIBLE":
      return { label: "Not compatible", foreground: colors.danger, background: colors.dangerSoft };
    case "UNKNOWN":
      if (hasInterfaceMatch(evaluation)) {
        return {
          label: "Match found — unverified",
          foreground: colors.warning,
          background: colors.warningSoft,
        };
      }
      return {
        label: "Insufficient information",
        foreground: colors.inkSoft,
        background: colors.surfaceMuted,
      };
  }
}

export function resultHeadline(evaluation: CompatibilityEvaluation): string {
  const adapters = evaluation.adapterPath.length;
  switch (evaluation.status) {
    case "VERIFIED_DIRECT":
      return "This component is verified to fit directly.";
    case "VERIFIED_WITH_ADAPTER":
      return adapters === 1
        ? "This component is verified to fit using one required adapter."
        : `This component is verified to fit using ${adapters} required adapters.`;
    case "LIKELY_COMPATIBLE":
      return "This component likely fits, but the exact pairing is not fully verified.";
    case "NEEDS_MEASUREMENT":
      return "A measurement is needed before this fit can be confirmed.";
    case "CONFLICT_DETECTED":
      return "A known conflict blocks this combination.";
    case "NOT_COMPATIBLE":
      return "This component does not fit this firearm.";
    case "UNKNOWN":
      if (adapters > 0) {
        return adapters === 1
          ? "The mounting interfaces align using one adapter, but this combination is not verified."
          : `The mounting interfaces align using ${adapters} adapters, but this combination is not verified.`;
      }
      if (evaluation.directMatches.length > 0) {
        return "The mounting interface matches, but the pairing is not verified.";
      }
      return "There is not enough information to evaluate this fit.";
  }
}

export function resultExplanation(
  evaluation: CompatibilityEvaluation,
  accessory: CatalogVariant,
): string {
  const requirement = accessory.requires[0];
  const requirementLabel = requirement ? interfaceLabel(requirement.interfaceId) : undefined;

  if (evaluation.status === "CONFLICT_DETECTED" || evaluation.status === "NOT_COMPATIBLE") {
    const reason = evaluation.knownConflicts[0] ?? evaluation.mismatches[0];
    return reason
      ? humanizeTechnicalText(reason)
      : "The catalog records a conflict for this exact pairing.";
  }

  if (evaluation.adapterPath.length > 0 && requirementLabel) {
    const adapterNames = evaluation.adapterPath.map((id) => productLabel(id)).join(", then a ");
    return `This component uses the ${requirementLabel}. Your firearm needs a ${adapterNames} to mount it.`;
  }

  const directMatch = evaluation.directMatches[0];
  if (directMatch) {
    return `Your firearm provides the ${interfaceLabel(directMatch)} this component mounts to.`;
  }

  if (!requirement) {
    return "The catalog has no mounting record for this component, so nothing can be checked yet.";
  }

  return `No verified way to mount the ${requirementLabel} on this firearm has been recorded yet.`;
}

export function confidenceNote(evaluation: CompatibilityEvaluation): string {
  const demoOnly =
    evaluation.evidenceSources.length === 0 ||
    evaluation.evidenceSources.every((source) => source.kind === "DEMO_UNVERIFIED");
  return demoOnly
    ? `${evaluation.confidenceScore}/100 — demonstration data only`
    : `${evaluation.confidenceScore}/100`;
}

export function unresolvedChecks(evaluation: CompatibilityEvaluation): string[] {
  if (evaluation.unknowns.length > 0) return evaluation.unknowns.map(humanizeTechnicalText);
  if (evaluation.status === "UNKNOWN" && hasInterfaceMatch(evaluation)) {
    return ["The connection matches, but the exact combination is not backed by verified evidence."];
  }
  return [];
}
