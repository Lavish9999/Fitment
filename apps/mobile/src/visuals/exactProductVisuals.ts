export interface FirearmStageTransform {
  scale: number;
  translateX: number;
  translateY: number;
}

export interface ExactProductVisual {
  productVariantId: string;
  imageUri: string;
  sourcePageUrl: string;
  sourceLabel: string;
  view: "LEFT_PROFILE" | "RIGHT_PROFILE" | "PRODUCT_ANGLE";
  background: "WHITE" | "BLACK" | "TRANSPARENT";
  previewOnly: boolean;
  kind: "FIREARM" | "COMPONENT";
  firearmTransform?: FirearmStageTransform;
}

export interface MountedProductPlacement {
  hostVariantId: string;
  componentVariantId: string;
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
  heightPercent: number;
  rotationDeg: number;
  zIndex: number;
}

const visuals: ExactProductVisual[] = [
  {
    productVariantId: "firearm-sig-p365-xmacro-optics-ready",
    imageUri:
      "https://www.sigsauer.com/media/catalog/product/cache/2f7933e2ff16f0ec074a16ab6b6195f2/3/6/365xca-9-comp-2.jpg",
    sourcePageUrl: "https://www.sigsauer.com/p365-xmacro.html",
    sourceLabel: "SIG SAUER official product image",
    view: "LEFT_PROFILE",
    background: "WHITE",
    previewOnly: true,
    kind: "FIREARM",
    firearmTransform: { scale: 1.28, translateX: 0, translateY: 8 },
  },
  {
    productVariantId: "firearm-glock-g19-gen5-mos",
    imageUri:
      "https://us.glock.com/_next/image?q=75&url=https%3A%2F%2Feu-images.contentstack.com%2Fv3%2Fassets%2Fbltf7171cc1cfc1a31f%2Fbltd9c57ef6cba05faf%2F6929a75e020f0c00047c1b8f%2F7.png&w=3840",
    sourcePageUrl: "https://us.glock.com/en/products/law-enforcement/pistols/g19-gen5-mos",
    sourceLabel: "GLOCK official product viewer image",
    view: "LEFT_PROFILE",
    background: "WHITE",
    previewOnly: true,
    kind: "FIREARM",
    firearmTransform: { scale: 1.56, translateX: -2, translateY: 16 },
  },
  {
    productVariantId: "firearm-glock-g19-gen4-mos",
    imageUri:
      "https://us.glock.com/_next/image?q=75&url=https%3A%2F%2Feu-images.contentstack.com%2Fv3%2Fassets%2Fbltf7171cc1cfc1a31f%2Fblta19e2b01249d812d%2F6942dfa7d968ee5f9c09b3e4%2F7.png&w=3840",
    sourcePageUrl: "https://us.glock.com/en/products/law-enforcement/pistols/g19-gen4-mos",
    sourceLabel: "GLOCK official product viewer image",
    view: "LEFT_PROFILE",
    background: "WHITE",
    previewOnly: true,
    kind: "FIREARM",
    firearmTransform: { scale: 1.56, translateX: -2, translateY: 16 },
  },
  {
    productVariantId: "optic-sig-romeozero-elite-1x24",
    imageUri: "https://www.sigsauer.com/media/sigsauer/gallery/Gallery-rzelite-1.jpg",
    sourcePageUrl: "https://www.sigsauer.com/romeozero-elite-1x24-mm.html",
    sourceLabel: "SIG SAUER official product gallery image",
    view: "PRODUCT_ANGLE",
    background: "BLACK",
    previewOnly: true,
    kind: "COMPONENT",
  },
  {
    productVariantId: "optic-trijicon-rmr-type2-rm06",
    imageUri:
      "https://www.bhphotovideo.com/cdn-cgi/image/fit%3Dscale-down%2Cwidth%3D500%2Cquality%3D95/https%3A//www.bhphotovideo.com/images/images500x500/trijicon_rm06_c_700672_rm06_rmr_type_2_1508326696_1366441.jpg",
    sourcePageUrl:
      "https://www.bhphotovideo.com/c/product/1366441-REG/trijicon_rm06_c_700672_rm06_rmr_type_2.html/overview",
    sourceLabel: "B&H authorized-dealer product image",
    view: "PRODUCT_ANGLE",
    background: "WHITE",
    previewOnly: true,
    kind: "COMPONENT",
  },
  {
    productVariantId: "light-streamlight-tlr7-x",
    imageUri:
      "https://www.streamlight.com/images/default-source/product-large-images/tlr-7-x_01.jpg?Status=Master&sfvrsn=3cc10cf3_73",
    sourcePageUrl: "https://www.streamlight.com/products/detail/tlr-7-x",
    sourceLabel: "Streamlight official product image",
    view: "PRODUCT_ANGLE",
    background: "WHITE",
    previewOnly: true,
    kind: "COMPONENT",
  },
  {
    productVariantId: "light-streamlight-tlr7-x-sub-1913",
    imageUri:
      "https://www.streamlight.com/images/default-source/product-large-images/tlr-7-x-sub/tlr-7-x-sub_01.jpg?Status=Master&sfvrsn=355418f3_23",
    sourcePageUrl: "https://www.streamlight.com/products/detail/tlr-7-x-sub",
    sourceLabel: "Streamlight official product image",
    view: "PRODUCT_ANGLE",
    background: "WHITE",
    previewOnly: true,
    kind: "COMPONENT",
  },
];

const placements: MountedProductPlacement[] = [
  {
    hostVariantId: "firearm-sig-p365-xmacro-optics-ready",
    componentVariantId: "optic-sig-romeozero-elite-1x24",
    leftPercent: 52,
    topPercent: 19,
    widthPercent: 17,
    heightPercent: 27,
    rotationDeg: 0,
    zIndex: 40,
  },
  {
    hostVariantId: "firearm-sig-p365-xmacro-optics-ready",
    componentVariantId: "light-streamlight-tlr7-x-sub-1913",
    leftPercent: 34,
    topPercent: 54,
    widthPercent: 22,
    heightPercent: 25,
    rotationDeg: 0,
    zIndex: 20,
  },
  {
    hostVariantId: "firearm-glock-g19-gen5-mos",
    componentVariantId: "optic-trijicon-rmr-type2-rm06",
    leftPercent: 52,
    topPercent: 20,
    widthPercent: 17,
    heightPercent: 25,
    rotationDeg: 0,
    zIndex: 40,
  },
  {
    hostVariantId: "firearm-glock-g19-gen4-mos",
    componentVariantId: "optic-trijicon-rmr-type2-rm06",
    leftPercent: 52,
    topPercent: 20,
    widthPercent: 17,
    heightPercent: 25,
    rotationDeg: 0,
    zIndex: 40,
  },
  {
    hostVariantId: "firearm-glock-g19-gen5-mos",
    componentVariantId: "light-streamlight-tlr7-x",
    leftPercent: 34,
    topPercent: 55,
    widthPercent: 22,
    heightPercent: 25,
    rotationDeg: 0,
    zIndex: 20,
  },
  {
    hostVariantId: "firearm-glock-g19-gen4-mos",
    componentVariantId: "light-streamlight-tlr7-x",
    leftPercent: 34,
    topPercent: 55,
    widthPercent: 22,
    heightPercent: 25,
    rotationDeg: 0,
    zIndex: 20,
  },
];

const exactProductVisuals = new Map(
  visuals.map((visual) => [visual.productVariantId, visual] as const),
);

const mountedPlacements = new Map(
  placements.map((placement) => [
    `${placement.hostVariantId}:${placement.componentVariantId}`,
    placement,
  ] as const),
);

export function getExactProductVisual(productVariantId: string): ExactProductVisual | null {
  return exactProductVisuals.get(productVariantId) ?? null;
}

export function getMountedProductPlacement(
  hostVariantId: string,
  componentVariantId: string,
): MountedProductPlacement | null {
  return mountedPlacements.get(`${hostVariantId}:${componentVariantId}`) ?? null;
}
