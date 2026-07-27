import type {
  AdapterConnection,
  CatalogVariant,
  CompatibilityExclusion,
  EvidenceSource,
} from "../../domain/src/index.js";

import { demoAccessories } from "./demo.js";

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
    title: "SIG SAUER P365-XMACRO official specifications",
    url: "https://www.sigsauer.com/p365-xmacro.html",
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
  {
    id: "evidence-trijicon-rmr-rm06-authorized-retailer",
    kind: "AUTHORIZED_RETAILER",
    title: "Trijicon RM06 RMR Type 2 authorized-dealer product record",
    url: "https://www.bhphotovideo.com/c/product/1366441-REG/trijicon_rm06_c_700672_rm06_rmr_type_2.html/overview",
    exactCombinationVerified: false,
    reviewedAt: "2026-07-26T00:00:00.000Z",
  },
  {
    id: "evidence-streamlight-tlr7x-official",
    kind: "MANUFACTURER_DOCUMENTATION",
    title: "Streamlight TLR-7 X official product specifications",
    url: "https://www.streamlight.com/products/detail/tlr-7-x",
    exactCombinationVerified: false,
    reviewedAt: "2026-07-26T00:00:00.000Z",
  },
  {
    id: "evidence-streamlight-tlr7x-sub-official",
    kind: "MANUFACTURER_DOCUMENTATION",
    title: "Streamlight TLR-7 X sub official product specifications and XMACRO fit listing",
    url: "https://www.streamlight.com/products/detail/tlr-7-x-sub",
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
  knownWeightGrams: 14,
  dataCompleteness: "PARTIAL",
};

const trijiconRmrType2: CatalogVariant = {
  id: "optic-trijicon-rmr-type2-rm06",
  manufacturer: "Trijicon",
  family: "RMR Type 2",
  exactModel: "RMR Type 2 RM06 — 3.25 MOA",
  sku: "RM06-C-700672",
  category: "RED_DOT_OPTIC",
  provides: [],
  requires: [
    {
      interfaceId: "RM_RMR_FOOTPRINT",
      location: "optic base",
      evidenceSourceId: "evidence-trijicon-rmr-rm06-authorized-retailer",
      verificationStatus: "PARTIAL",
    },
  ],
  dependencies: [],
  knownWeightGrams: 34,
  dataCompleteness: "PARTIAL",
};

const streamlightTlr7X: CatalogVariant = {
  id: "light-streamlight-tlr7-x",
  manufacturer: "Streamlight",
  family: "TLR-7 X",
  exactModel: "TLR-7 X — Black",
  category: "WEAPON_LIGHT",
  provides: [],
  requires: [
    {
      interfaceId: "GLOCK_UNIVERSAL_RAIL",
      location: "rail-grip clamp with GLOCK key",
      evidenceSourceId: "evidence-streamlight-tlr7x-official",
      verificationStatus: "PARTIAL",
    },
  ],
  dependencies: [],
  knownWeightGrams: 75,
  dataCompleteness: "PARTIAL",
};

const streamlightTlr7XSub1913: CatalogVariant = {
  id: "light-streamlight-tlr7-x-sub-1913",
  manufacturer: "Streamlight",
  family: "TLR-7 X sub",
  exactModel: "TLR-7 X sub — 1913 model",
  category: "WEAPON_LIGHT",
  provides: [],
  requires: [
    {
      interfaceId: "PICATINNY_1913_COMPACT",
      location: "1913 clamp",
      evidenceSourceId: "evidence-streamlight-tlr7x-sub-official",
      verificationStatus: "VERIFIED",
    },
  ],
  dependencies: [],
  knownWeightGrams: 75,
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

const diagnosticUnknownAccessory = demoAccessories.find(
  (accessory) => accessory.id === "optic-unknown-demo",
)!;

export const phase1Catalog: CatalogDataset = {
  id: "fitment-phase1-preview",
  revision: 2,
  mode: "PREVIEW",
  firearms: [sigP365XMacro, glock19Gen5Mos, glock19Gen4Mos],
  accessories: [
    romeoZeroElite,
    trijiconRmrType2,
    streamlightTlr7X,
    streamlightTlr7XSub1913,
    diagnosticUnknownAccessory,
  ],
  requiredComponents: [glockMosPlate02],
  adapters: manufacturerAdapters,
  exclusions: [],
  evidenceSources: manufacturerEvidence,
};

export const phase1ProductsById = new Map(
  [...phase1Catalog.firearms, ...phase1Catalog.accessories, ...phase1Catalog.requiredComponents].map(
    (product) => [product.id, product],
  ),
);
