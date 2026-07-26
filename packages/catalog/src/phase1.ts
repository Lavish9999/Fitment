import type {
  AdapterConnection,
  CatalogVariant,
  CompatibilityExclusion,
  EvidenceSource,
} from "../../domain/src/index.js";

import {
  demoAccessories,
  demoAdapters,
  demoEvidence,
  demoExclusions,
  demoRequiredComponents,
} from "./demo.js";

export interface CatalogDataset {
  id: string;
  revision: number;
  mode: "PREVIEW" | "PRODUCTION";
  firearms: [CatalogVariant, ...CatalogVariant[]];
  accessories: [CatalogVariant, ...CatalogVariant[]];
  requiredComponents: CatalogVariant[];
  adapters: AdapterConnection[];
  exclusions: CompatibilityExclusion[];
  evidenceSources: EvidenceSource[];
}

const manufacturerEvidence: EvidenceSource[] = [
  {
    id: "evidence-glock-g19-gen5-mos-official",
    kind: "MANUFACTURER_DOCUMENTATION",
    title: "GLOCK G19 Gen5 MOS official product specifications",
    url: "https://us.glock.com/en/products/law-enforcement/pistols/g19-gen5-mos",
    exactCombinationVerified: true,
    reviewedAt: "2026-07-26T00:00:00.000Z",
  },
  {
    id: "evidence-glock-g19-gen4-mos-official",
    kind: "MANUFACTURER_DOCUMENTATION",
    title: "GLOCK G19 Gen4 MOS official product specifications",
    url: "https://us.glock.com/en/products/law-enforcement/pistols/g19-gen4-mos",
    exactCombinationVerified: true,
    reviewedAt: "2026-07-26T00:00:00.000Z",
  },
  {
    id: "evidence-glock-mos-adapter-instructions",
    kind: "MANUFACTURER_DOCUMENTATION",
    title: "GLOCK MOS Adapter Plate Instructions 21422",
    url: "https://eu-assets.contentstack.com/v3/assets/bltf7171cc1cfc1a31f/blt06337d8ec5ed9ac8/68f7dfbab497b1ddaede6b66/MOS_Instructions_21422.pdf",
    exactCombinationVerified: false,
    reviewedAt: "2026-07-26T00:00:00.000Z",
  },
  {
    id: "evidence-sig-p365-xmacro-official",
    kind: "MANUFACTURER_DOCUMENTATION",
    title: "SIG SAUER P365-XMACRO official introduction and specifications",
    url: "https://www.sigsauer.com/blog/sig-sauer-introduces-p365-xmacro-bringing-even-more-to-everyday-carry",
    exactCombinationVerified: true,
    reviewedAt: "2026-07-26T00:00:00.000Z",
  },
  {
    id: "evidence-sig-romeozero-elite-official",
    kind: "MANUFACTURER_DOCUMENTATION",
    title: "SIG SAUER ROMEOZero Elite official product specifications",
    url: "https://www.sigsauer.com/romeozero-elite-1x24-mm.html",
    exactCombinationVerified: true,
    reviewedAt: "2026-07-26T00:00:00.000Z",
  },
];

const glock19Gen5Mos: CatalogVariant = {
  id: "firearm-glock-g19-gen5-mos",
  manufacturer: "GLOCK",
  family: "G19",
  exactModel: "G19 Gen5 MOS",
  category: "PISTOL",
  provides: [
    {
      interfaceId: "GLOCK_MOS_STANDARD",
      location: "slide",
      evidenceSourceId: "evidence-glock-g19-gen5-mos-official",
      verificationStatus: "VERIFIED",
    },
    {
      interfaceId: "GLOCK_UNIVERSAL_RAIL",
      location: "frame rail",
      evidenceSourceId: "evidence-glock-g19-gen5-mos-official",
      verificationStatus: "VERIFIED",
    },
  ],
  requires: [],
  dependencies: [],
  knownWeightGrams: 675,
  dataCompleteness: "PARTIAL",
};

const glock19Gen4Mos: CatalogVariant = {
  id: "firearm-glock-g19-gen4-mos",
  manufacturer: "GLOCK",
  family: "G19",
  exactModel: "G19 Gen4 MOS",
  category: "PISTOL",
  provides: [
    {
      interfaceId: "GLOCK_MOS_STANDARD",
      location: "slide",
      evidenceSourceId: "evidence-glock-g19-gen4-mos-official",
      verificationStatus: "VERIFIED",
    },
    {
      interfaceId: "GLOCK_UNIVERSAL_RAIL",
      location: "frame rail",
      evidenceSourceId: "evidence-glock-g19-gen4-mos-official",
      verificationStatus: "VERIFIED",
    },
  ],
  requires: [],
  dependencies: [],
  knownWeightGrams: 670,
  dataCompleteness: "PARTIAL",
};

const sigP365XMacro: CatalogVariant = {
  id: "firearm-sig-p365-xmacro-optics-ready",
  manufacturer: "SIG SAUER",
  family: "P365",
  exactModel: "P365-XMACRO Optics Ready",
  category: "PISTOL",
  provides: [
    {
      interfaceId: "SHIELD_RMSC_FOOTPRINT",
      location: "optics-ready slide",
      evidenceSourceId: "evidence-sig-p365-xmacro-official",
      verificationStatus: "VERIFIED",
    },
    {
      interfaceId: "PICATINNY_1913_COMPACT",
      location: "frame rail",
      evidenceSourceId: "evidence-sig-p365-xmacro-official",
      verificationStatus: "VERIFIED",
    },
  ],
  requires: [],
  dependencies: [],
  knownWeightGrams: 610,
  dataCompleteness: "PARTIAL",
};

const romeoZeroElite: CatalogVariant = {
  id: "optic-sig-romeozero-elite-1x24",
  manufacturer: "SIG SAUER",
  family: "ROMEOZero Elite",
  exactModel: "ROMEOZero Elite 1x24 mm",
  category: "RED_DOT_OPTIC",
  provides: [],
  requires: [
    {
      interfaceId: "SHIELD_RMSC_FOOTPRINT",
      location: "optic base",
      evidenceSourceId: "evidence-sig-romeozero-elite-official",
      verificationStatus: "VERIFIED",
    },
  ],
  dependencies: [],
  knownPriceCents: 19999,
  dataCompleteness: "PARTIAL",
};

const glockMosPlate02: CatalogVariant = {
  id: "adapter-glock-mos-plate-02-trijicon",
  manufacturer: "GLOCK",
  family: "MOS Adapter Plate 02",
  exactModel: "MOS Adapter Plate 02 — Trijicon pattern",
  category: "PISTOL_OPTIC_PLATE",
  provides: [
    {
      interfaceId: "RM_RMR_FOOTPRINT",
      location: "top",
      evidenceSourceId: "evidence-glock-mos-adapter-instructions",
      verificationStatus: "PARTIAL",
    },
  ],
  requires: [
    {
      interfaceId: "GLOCK_MOS_STANDARD",
      location: "bottom",
      evidenceSourceId: "evidence-glock-mos-adapter-instructions",
      verificationStatus: "VERIFIED",
    },
  ],
  dependencies: [],
  dataCompleteness: "PARTIAL",
};

const manufacturerAdapters: AdapterConnection[] = [
  {
    adapterProductVariantId: glockMosPlate02.id,
    inputInterfaceId: "GLOCK_MOS_STANDARD",
    outputInterfaceId: "RM_RMR_FOOTPRINT",
    confidenceScore: 78,
    verified: true,
    evidenceSourceIds: ["evidence-glock-mos-adapter-instructions"],
    restrictions: [
      "The exact optic model, supplied screws, and plate revision still require product-level verification.",
    ],
  },
];

export const phase1Catalog: CatalogDataset = {
  id: "fitment-phase1-preview",
  revision: 1,
  mode: "PREVIEW",
  firearms: [sigP365XMacro, glock19Gen5Mos, glock19Gen4Mos],
  accessories: [romeoZeroElite, ...demoAccessories],
  requiredComponents: [glockMosPlate02, ...demoRequiredComponents],
  adapters: [...manufacturerAdapters, ...demoAdapters],
  exclusions: [...demoExclusions],
  evidenceSources: [...manufacturerEvidence, ...demoEvidence],
};

export const phase1ProductsById = new Map(
  [...phase1Catalog.firearms, ...phase1Catalog.accessories, ...phase1Catalog.requiredComponents].map(
    (product) => [product.id, product],
  ),
);
