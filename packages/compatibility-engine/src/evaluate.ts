import type {
  CompatibilityEvaluation,
  CompatibilityStatus,
  EvaluationInput,
  EvidenceSource,
  RequiredComponentResult,
} from "../../domain/src/index.js";
import { findVerifiedAdapterPath } from "./adapter-graph.js";
import { calculateConfidence, interfaceConfidence } from "./confidence.js";

function newestReviewedAt(sources: EvidenceSource[]): string | undefined {
  return sources
    .map((source) => source.reviewedAt)
    .sort((a, b) => b.localeCompare(a))[0];
}

function selectSources(sourceIds: Set<string>, sources: EvidenceSource[]): EvidenceSource[] {
  return sources.filter((source) => sourceIds.has(source.id));
}

function statusForConfidence(
  verifiedStatus: "VERIFIED_DIRECT" | "VERIFIED_WITH_ADAPTER",
  confidence: number,
): CompatibilityStatus {
  if (confidence >= 85) return verifiedStatus;
  if (confidence >= 70) return "LIKELY_COMPATIBLE";
  return "UNKNOWN";
}

export function evaluateCompatibility(input: EvaluationInput): CompatibilityEvaluation {
  const dimensionChecks = input.dimensionChecks ?? [];
  const ratingChecks = input.ratingChecks ?? [];
  const sourceIds = new Set<string>();
  const directMatches: string[] = [];
  const mismatches: string[] = [];
  const unknowns: string[] = [];
  const knownConflicts: string[] = [];

  const exclusion = input.exclusions.find(
    (rule) =>
      rule.hostVariantId === input.host.id && rule.accessoryVariantId === input.accessory.id,
  );
  if (exclusion) {
    exclusion.evidenceSourceIds.forEach((id) => sourceIds.add(id));
    return {
      status: "NOT_COMPATIBLE",
      confidenceScore: Math.max(85, calculateConfidence({
        base: 96,
        interfaceScore: 96,
        dimensionChecks,
        ratingChecks,
        unknownCount: 0,
      })),
      summary: exclusion.reason,
      directMatches,
      mismatches: [exclusion.reason],
      unknowns,
      requiredComponents: [],
      optionalComponents: [],
      knownConflicts: [exclusion.reason],
      evidenceSources: selectSources(sourceIds, input.evidenceSources),
      lastVerifiedAt: newestReviewedAt(selectSources(sourceIds, input.evidenceSources)) ?? null,
      engineVersion: input.engineVersion,
      adapterPath: [],
    };
  }

  const failedCriticalChecks = [...dimensionChecks, ...ratingChecks].filter(
    (check) => check.critical && check.result === "FAIL",
  );
  if (failedCriticalChecks.length > 0) {
    failedCriticalChecks.forEach((check) => {
      knownConflicts.push(check.explanation);
      check.evidenceSourceIds.forEach((id) => sourceIds.add(id));
    });
    return {
      status: "CONFLICT_DETECTED",
      confidenceScore: 96,
      summary: "A verified critical restriction or clearance conflict was detected.",
      directMatches,
      mismatches: failedCriticalChecks.map((check) => check.explanation),
      unknowns,
      requiredComponents: [],
      optionalComponents: [],
      knownConflicts,
      evidenceSources: selectSources(sourceIds, input.evidenceSources),
      lastVerifiedAt: newestReviewedAt(selectSources(sourceIds, input.evidenceSources)) ?? null,
      engineVersion: input.engineVersion,
      adapterPath: [],
    };
  }

  const criticalUnknowns = [...dimensionChecks, ...ratingChecks].filter(
    (check) => check.critical && check.result === "UNKNOWN",
  );
  criticalUnknowns.forEach((check) => {
    unknowns.push(check.explanation);
    check.evidenceSourceIds.forEach((id) => sourceIds.add(id));
  });

  if (input.accessory.requires.length === 0) {
    return {
      status: "UNKNOWN",
      confidenceScore: 35,
      summary: "The accessory does not have a verified required interface record.",
      directMatches,
      mismatches,
      unknowns: ["Required mounting interface is missing from the catalog."],
      requiredComponents: [],
      optionalComponents: [],
      knownConflicts,
      evidenceSources: [],
      lastVerifiedAt: null,
      engineVersion: input.engineVersion,
      adapterPath: [],
    };
  }

  const hostInterfaces = input.host.provides.map((item) => item.interfaceId);
  const hostInterfaceScore = interfaceConfidence(input.host.provides, input.evidenceSources);
  const accessoryInterfaceScore = interfaceConfidence(input.accessory.requires, input.evidenceSources);
  const combinedInterfaceScore = Math.min(hostInterfaceScore, accessoryInterfaceScore);

  for (const item of [...input.host.provides, ...input.accessory.requires]) {
    if (item.evidenceSourceId) sourceIds.add(item.evidenceSourceId);
  }

  const mandatoryDependencies: RequiredComponentResult[] = input.accessory.dependencies
    .filter((dependency) => dependency.mandatory)
    .map((dependency) => ({
      productVariantId: dependency.productVariantId,
      reason: dependency.reason,
      mandatory: true,
      priceCents: null,
      weightGrams: null,
      evidenceSourceIds: dependency.evidenceSourceIds,
    }));
  const optionalDependencies: RequiredComponentResult[] = input.accessory.dependencies
    .filter((dependency) => !dependency.mandatory)
    .map((dependency) => ({
      productVariantId: dependency.productVariantId,
      reason: dependency.reason,
      mandatory: false,
      priceCents: null,
      weightGrams: null,
      evidenceSourceIds: dependency.evidenceSourceIds,
    }));
  input.accessory.dependencies.forEach((dependency) =>
    dependency.evidenceSourceIds.forEach((id) => sourceIds.add(id)),
  );

  for (const requirement of input.accessory.requires) {
    if (hostInterfaces.includes(requirement.interfaceId)) {
      directMatches.push(requirement.interfaceId);
      const confidence = calculateConfidence({
        base: 94,
        interfaceScore: combinedInterfaceScore,
        dimensionChecks,
        ratingChecks,
        unknownCount: criticalUnknowns.length,
      });
      if (criticalUnknowns.length > 0) {
        return {
          status: "NEEDS_MEASUREMENT",
          confidenceScore: Math.min(confidence, 69),
          summary: "The mounting standard matches, but a critical clearance or rating check is unresolved.",
          directMatches,
          mismatches,
          unknowns,
          requiredComponents: mandatoryDependencies,
          optionalComponents: optionalDependencies,
          knownConflicts,
          evidenceSources: selectSources(sourceIds, input.evidenceSources),
          lastVerifiedAt: newestReviewedAt(selectSources(sourceIds, input.evidenceSources)) ?? null,
          engineVersion: input.engineVersion,
          adapterPath: [],
        };
      }
      return {
        status: statusForConfidence("VERIFIED_DIRECT", confidence),
        confidenceScore: confidence,
        summary: "The host provides the exact interface required by the accessory.",
        directMatches,
        mismatches,
        unknowns,
        requiredComponents: mandatoryDependencies,
        optionalComponents: optionalDependencies,
        knownConflicts,
        evidenceSources: selectSources(sourceIds, input.evidenceSources),
        lastVerifiedAt: newestReviewedAt(selectSources(sourceIds, input.evidenceSources)) ?? null,
        engineVersion: input.engineVersion,
        adapterPath: [],
      };
    }

    const path = findVerifiedAdapterPath(
      hostInterfaces,
      requirement.interfaceId,
      input.adapters,
      input.maxAdapterHops ?? 3,
    );
    if (path) {
      path.edges.forEach((edge) => edge.evidenceSourceIds.forEach((id) => sourceIds.add(id)));
      const adapterComponents: RequiredComponentResult[] = path.edges.map((edge) => ({
        productVariantId: edge.adapterProductVariantId,
        reason: `Adapts ${edge.inputInterfaceId} to ${edge.outputInterfaceId}.`,
        mandatory: true,
        priceCents: edge.priceCents ?? null,
        weightGrams: edge.weightGrams ?? null,
        evidenceSourceIds: edge.evidenceSourceIds,
      }));
      const confidence = calculateConfidence({
        base: 90,
        interfaceScore: combinedInterfaceScore,
        adapterPath: path.edges,
        dimensionChecks,
        ratingChecks,
        unknownCount: criticalUnknowns.length,
      });
      if (criticalUnknowns.length > 0) {
        return {
          status: "NEEDS_MEASUREMENT",
          confidenceScore: Math.min(confidence, 69),
          summary: "A verified adapter path exists, but a critical clearance or rating check is unresolved.",
          directMatches,
          mismatches,
          unknowns,
          requiredComponents: [...adapterComponents, ...mandatoryDependencies],
          optionalComponents: optionalDependencies,
          knownConflicts,
          evidenceSources: selectSources(sourceIds, input.evidenceSources),
          lastVerifiedAt: newestReviewedAt(selectSources(sourceIds, input.evidenceSources)) ?? null,
          engineVersion: input.engineVersion,
          adapterPath: path.edges.map((edge) => edge.adapterProductVariantId),
        };
      }
      return {
        status: statusForConfidence("VERIFIED_WITH_ADAPTER", confidence),
        confidenceScore: confidence,
        summary: `A verified ${path.edges.length}-component adapter path connects the host to the accessory.`,
        directMatches,
        mismatches,
        unknowns,
        requiredComponents: [...adapterComponents, ...mandatoryDependencies],
        optionalComponents: optionalDependencies,
        knownConflicts,
        evidenceSources: selectSources(sourceIds, input.evidenceSources),
        lastVerifiedAt: newestReviewedAt(selectSources(sourceIds, input.evidenceSources)) ?? null,
        engineVersion: input.engineVersion,
        adapterPath: path.edges.map((edge) => edge.adapterProductVariantId),
      };
    }

    mismatches.push(`Host does not provide ${requirement.interfaceId}.`);
  }

  const closedWorld =
    input.adapterGraphCompleteness === "VERIFIED_FOR_SCOPE" &&
    input.host.dataCompleteness === "COMPLETE_FOR_SCOPE" &&
    input.accessory.dataCompleteness === "COMPLETE_FOR_SCOPE";

  return {
    status: closedWorld ? "NOT_COMPATIBLE" : "UNKNOWN",
    confidenceScore: closedWorld ? 88 : 42,
    summary: closedWorld
      ? "No direct match or verified adapter path exists within the fully reviewed scope."
      : "No verified path was found, but the catalog or adapter graph is incomplete.",
    directMatches,
    mismatches,
    unknowns: closedWorld
      ? unknowns
      : [...unknowns, "Adapter coverage is incomplete; absence of a path is not proof of incompatibility."],
    requiredComponents: mandatoryDependencies,
    optionalComponents: optionalDependencies,
    knownConflicts,
    evidenceSources: selectSources(sourceIds, input.evidenceSources),
    lastVerifiedAt: newestReviewedAt(selectSources(sourceIds, input.evidenceSources)) ?? null,
    engineVersion: input.engineVersion,
    adapterPath: [],
  };
}
