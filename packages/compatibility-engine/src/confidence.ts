import type {
  AdapterConnection,
  DimensionCheck,
  EvidenceSource,
  ProductInterface,
  RatingCheck,
} from "../../domain/src/index.js";

const sourceWeights: Record<EvidenceSource["kind"], number> = {
  MANUFACTURER_DOCUMENTATION: 98,
  MANUFACTURER_SUPPORT: 96,
  STAFF_PHYSICAL_VERIFICATION: 97,
  VERIFIED_USER_REPORT: 86,
  AUTHORIZED_RETAILER: 78,
  OTHER_RETAILER: 68,
  UNVERIFIED_COMMUNITY: 52,
  DEMO_UNVERIFIED: 35,
};

export function evidenceConfidence(sourceIds: string[], sources: EvidenceSource[]): number {
  const scores = sourceIds
    .map((id) => sources.find((source) => source.id === id))
    .filter((source): source is EvidenceSource => Boolean(source))
    .map((source) => sourceWeights[source.kind]);
  return scores.length > 0 ? Math.max(...scores) : 45;
}

export function interfaceConfidence(
  interfaces: ProductInterface[],
  sources: EvidenceSource[],
): number {
  if (interfaces.length === 0) return 35;
  return Math.min(
    ...interfaces.map((item) => {
      const verificationCap =
        item.verificationStatus === "VERIFIED"
          ? 100
          : item.verificationStatus === "PARTIAL"
            ? 78
            : 45;
      const sourceScore = item.evidenceSourceId
        ? evidenceConfidence([item.evidenceSourceId], sources)
        : 45;
      return Math.min(verificationCap, sourceScore);
    }),
  );
}

export function calculateConfidence(input: {
  base: number;
  interfaceScore: number;
  adapterPath?: AdapterConnection[];
  dimensionChecks: DimensionCheck[];
  ratingChecks: RatingCheck[];
  unknownCount: number;
}): number {
  let score = Math.min(input.base, input.interfaceScore);
  if (input.adapterPath) {
    score = Math.min(score, ...input.adapterPath.map((edge) => edge.confidenceScore));
    score -= Math.max(0, input.adapterPath.length - 1) * 4;
  }
  score -= input.dimensionChecks.filter((check) => check.result === "UNKNOWN").length * 6;
  score -= input.ratingChecks.filter((check) => check.result === "UNKNOWN").length * 8;
  score -= input.unknownCount * 3;
  return Math.max(0, Math.min(100, Math.round(score)));
}
