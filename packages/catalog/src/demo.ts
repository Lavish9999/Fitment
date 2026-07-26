import type {
  AdapterConnection,
  CatalogVariant,
  CompatibilityExclusion,
  EvidenceSource,
} from "../../domain/src/index.js";

export const demoEvidence: EvidenceSource[] = [
  {
    id: "evidence-demo-glock-mos",
    kind: "DEMO_UNVERIFIED",
    title: "Demonstration host interface record",
    exactCombinationVerified: false,
    reviewedAt: "2026-07-26T00:00:00.000Z",
  },
  {
    id: "evidence-demo-rmr",
    kind: "DEMO_UNVERIFIED",
    title: "Demonstration optic interface record",
    exactCombinationVerified: false,
    reviewedAt: "2026-07-26T00:00:00.000Z",
  },
  {
    id: "evidence-demo-plate",
    kind: "DEMO_UNVERIFIED",
    title: "Demonstration optic-plate adapter record",
    exactCombinationVerified: false,
    reviewedAt: "2026-07-26T00:00:00.000Z",
  },
];

export const demoHost: CatalogVariant = {
  id: "firearm-g19-gen5-mos-demo",
  manufacturer: "Glock",
  family: "G19",
  exactModel: "G19 Gen5 MOS — demonstration variant",
  category: "PISTOL",
  provides: [
    {
      interfaceId: "MOS_PLATE_SYSTEM",
      location: "slide",
      evidenceSourceId: "evidence-demo-glock-mos",
      verificationStatus: "DEMO_UNVERIFIED",
    },
    {
      interfaceId: "GLOCK_UNIVERSAL_RAIL",
      location: "frame rail",
      evidenceSourceId: "evidence-demo-glock-mos",
      verificationStatus: "DEMO_UNVERIFIED",
    },
  ],
  requires: [],
  dependencies: [],
  knownPriceCents: 62000,
  knownWeightGrams: 670,
  dataCompleteness: "PARTIAL",
};

export const demoAccessories: CatalogVariant[] = [
  {
    id: "optic-rmr-demo",
    manufacturer: "Demo Optics Co.",
    family: "RMR-pattern optic",
    exactModel: "RMR Footprint Optic — demo record",
    sku: "DEMO-RMR-01",
    category: "RED_DOT_OPTIC",
    provides: [],
    requires: [
      {
        interfaceId: "RM_RMR_FOOTPRINT",
        location: "optic base",
        evidenceSourceId: "evidence-demo-rmr",
        verificationStatus: "DEMO_UNVERIFIED",
      },
    ],
    dependencies: [],
    knownPriceCents: 29900,
    knownWeightGrams: 35,
    dataCompleteness: "PARTIAL",
  },
  {
    id: "light-glock-rail-demo",
    manufacturer: "Demo Illumination",
    family: "Compact rail light",
    exactModel: "Universal Rail Light — demo record",
    sku: "DEMO-LIGHT-01",
    category: "WEAPON_LIGHT",
    provides: [],
    requires: [
      {
        interfaceId: "GLOCK_UNIVERSAL_RAIL",
        location: "clamp",
        evidenceSourceId: "evidence-demo-glock-mos",
        verificationStatus: "DEMO_UNVERIFIED",
      },
    ],
    dependencies: [],
    knownPriceCents: 14900,
    knownWeightGrams: 72,
    dataCompleteness: "PARTIAL",
  },
  {
    id: "optic-unknown-demo",
    manufacturer: "Unknown Maker",
    family: "Unclassified optic",
    exactModel: "Missing Interface Record — demo",
    category: "RED_DOT_OPTIC",
    provides: [],
    requires: [],
    dependencies: [],
    knownPriceCents: 9900,
    dataCompleteness: "PARTIAL",
  },
];

export const demoRequiredComponents: CatalogVariant[] = [
  {
    id: "adapter-mos-to-rmr-demo",
    manufacturer: "Demo Mounting Co.",
    family: "MOS-to-RMR plate",
    exactModel: "MOS to RMR Plate — demo record",
    sku: "DEMO-PLATE-01",
    category: "PISTOL_OPTIC_PLATE",
    provides: [
      {
        interfaceId: "RM_RMR_FOOTPRINT",
        location: "top",
        evidenceSourceId: "evidence-demo-plate",
        verificationStatus: "DEMO_UNVERIFIED",
      },
    ],
    requires: [
      {
        interfaceId: "MOS_PLATE_SYSTEM",
        location: "bottom",
        evidenceSourceId: "evidence-demo-plate",
        verificationStatus: "DEMO_UNVERIFIED",
      },
    ],
    dependencies: [],
    knownPriceCents: 3500,
    knownWeightGrams: 12,
    dataCompleteness: "PARTIAL",
  },
];

export const demoProductsById = new Map(
  [...demoAccessories, ...demoRequiredComponents].map((product) => [product.id, product]),
);

export const demoAdapters: AdapterConnection[] = [
  {
    adapterProductVariantId: "adapter-mos-to-rmr-demo",
    inputInterfaceId: "MOS_PLATE_SYSTEM",
    outputInterfaceId: "RM_RMR_FOOTPRINT",
    confidenceScore: 44,
    verified: true,
    priceCents: 3500,
    weightGrams: 12,
    evidenceSourceIds: ["evidence-demo-plate"],
    restrictions: ["Demonstration data only; verify the exact slide, plate, screws, and optic revision."],
  },
];

export const demoExclusions: CompatibilityExclusion[] = [];
