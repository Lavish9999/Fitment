export const compatibilityStatuses = [
  "VERIFIED_DIRECT",
  "VERIFIED_WITH_ADAPTER",
  "LIKELY_COMPATIBLE",
  "NEEDS_MEASUREMENT",
  "CONFLICT_DETECTED",
  "NOT_COMPATIBLE",
  "UNKNOWN",
] as const;

export type CompatibilityStatus = (typeof compatibilityStatuses)[number];

export type EvidenceKind =
  | "MANUFACTURER_DOCUMENTATION"
  | "MANUFACTURER_SUPPORT"
  | "STAFF_PHYSICAL_VERIFICATION"
  | "VERIFIED_USER_REPORT"
  | "AUTHORIZED_RETAILER"
  | "OTHER_RETAILER"
  | "UNVERIFIED_COMMUNITY"
  | "DEMO_UNVERIFIED";

export interface EvidenceSource {
  id: string;
  kind: EvidenceKind;
  title: string;
  url?: string;
  exactCombinationVerified: boolean;
  reviewedAt: string;
}

export interface ProductInterface {
  interfaceId: string;
  location: string;
  evidenceSourceId?: string;
  verificationStatus: "VERIFIED" | "PARTIAL" | "DEMO_UNVERIFIED";
}

export interface DimensionCheck {
  code: string;
  label: string;
  result: "PASS" | "FAIL" | "UNKNOWN";
  critical: boolean;
  explanation: string;
  evidenceSourceIds: string[];
}

export interface RatingCheck {
  code: string;
  label: string;
  result: "PASS" | "FAIL" | "UNKNOWN";
  critical: boolean;
  explanation: string;
  evidenceSourceIds: string[];
}

export interface ComponentDependency {
  productVariantId: string;
  reason: string;
  mandatory: boolean;
  evidenceSourceIds: string[];
}

export interface CatalogVariant {
  id: string;
  manufacturer: string;
  family: string;
  exactModel: string;
  sku?: string;
  category: string;
  provides: ProductInterface[];
  requires: ProductInterface[];
  dependencies: ComponentDependency[];
  knownPriceCents?: number;
  knownWeightGrams?: number;
  dataCompleteness: "COMPLETE_FOR_SCOPE" | "PARTIAL";
}

export interface AdapterConnection {
  adapterProductVariantId: string;
  inputInterfaceId: string;
  outputInterfaceId: string;
  confidenceScore: number;
  verified: boolean;
  priceCents?: number;
  weightGrams?: number;
  evidenceSourceIds: string[];
  restrictions: string[];
}

export interface CompatibilityExclusion {
  id: string;
  hostVariantId: string;
  accessoryVariantId: string;
  reason: string;
  evidenceSourceIds: string[];
}

export interface RequiredComponentResult {
  productVariantId: string;
  reason: string;
  mandatory: boolean;
  priceCents: number | null;
  weightGrams: number | null;
  evidenceSourceIds: string[];
}

export interface CompatibilityEvaluation {
  status: CompatibilityStatus;
  confidenceScore: number;
  summary: string;
  directMatches: string[];
  mismatches: string[];
  unknowns: string[];
  requiredComponents: RequiredComponentResult[];
  optionalComponents: RequiredComponentResult[];
  knownConflicts: string[];
  evidenceSources: EvidenceSource[];
  lastVerifiedAt: string | null;
  engineVersion: string;
  adapterPath: string[];
}

export interface EvaluationInput {
  host: CatalogVariant;
  accessory: CatalogVariant;
  adapters: AdapterConnection[];
  exclusions: CompatibilityExclusion[];
  evidenceSources: EvidenceSource[];
  dimensionChecks?: DimensionCheck[];
  ratingChecks?: RatingCheck[];
  adapterGraphCompleteness: "PARTIAL" | "VERIFIED_FOR_SCOPE";
  engineVersion: string;
  maxAdapterHops?: number;
}
