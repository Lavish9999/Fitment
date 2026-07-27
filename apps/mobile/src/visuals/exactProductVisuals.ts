export interface ExactProductVisual {
  productVariantId: string;
  imageUri: string;
  sourcePageUrl: string;
  sourceLabel: string;
  view: "LEFT_PROFILE" | "RIGHT_PROFILE" | "PRODUCT_ANGLE";
  background: "WHITE" | "BLACK" | "TRANSPARENT";
  previewOnly: boolean;
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
  },
  {
    productVariantId: "optic-sig-romeozero-elite-1x24",
    imageUri: "https://www.sigsauer.com/media/sigsauer/gallery/Gallery-rzelite-1.jpg",
    sourcePageUrl: "https://www.sigsauer.com/romeozero-elite-1x24-mm.html",
    sourceLabel: "SIG SAUER official product gallery image",
    view: "PRODUCT_ANGLE",
    background: "BLACK",
    previewOnly: true,
  },
];

const exactProductVisuals = new Map(
  visuals.map((visual) => [visual.productVariantId, visual] as const),
);

export function getExactProductVisual(productVariantId: string): ExactProductVisual | null {
  return exactProductVisuals.get(productVariantId) ?? null;
}
