import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  demoAccessories,
  demoAdapters,
  demoEvidence,
  demoExclusions,
  demoHost,
  demoProductsById,
} from "@fitment/catalog";
import { evaluateCompatibility } from "@fitment/compatibility-engine";
import type { CatalogVariant, CompatibilityEvaluation } from "@fitment/domain";

const ENGINE_VERSION = "0.2.0-demo";
const CURRENT_BUILD_KEY = "fitment.mobile.current-build.v2";
const SAVED_BUILDS_KEY = "fitment.mobile.saved-builds.v2";

export interface SavedBuild {
  id: string;
  name: string;
  componentIds: string[];
  engineVersion: string;
  savedAt: string;
}

interface BuildTotals {
  price?: number;
  weight?: number;
  unknownPrices: number;
  unknownWeights: number;
}

interface FitmentContextValue {
  selectedAccessory: CatalogVariant;
  evaluation: CompatibilityEvaluation;
  requiredProducts: CatalogVariant[];
  buildItems: CatalogVariant[];
  savedBuilds: SavedBuild[];
  totals: BuildTotals;
  blocked: boolean;
  selectAccessory: (id: string) => void;
  addSelected: (includeRequired: boolean) => void;
  removeFromBuild: (id: string) => void;
  clearBuild: () => void;
  saveCurrentBuild: () => Promise<void>;
}

const FitmentContext = createContext<FitmentContextValue | null>(null);

function productsFromIds(ids: string[]): CatalogVariant[] {
  return ids
    .map((id) => demoProductsById.get(id))
    .filter((item): item is CatalogVariant => Boolean(item));
}

export function FitmentProvider({ children }: { children: ReactNode }) {
  const [selectedAccessoryId, setSelectedAccessoryId] = useState(demoAccessories[0].id);
  const [buildItems, setBuildItems] = useState<CatalogVariant[]>([]);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const selectedAccessory =
    demoAccessories.find((item) => item.id === selectedAccessoryId) ?? demoAccessories[0];

  const evaluation = useMemo(
    () =>
      evaluateCompatibility({
        host: demoHost,
        accessory: selectedAccessory,
        adapters: demoAdapters,
        exclusions: demoExclusions,
        evidenceSources: demoEvidence,
        adapterGraphCompleteness: "PARTIAL",
        engineVersion: ENGINE_VERSION,
        dimensionChecks: [
          {
            code: "CONTROL_CLEARANCE",
            label: "Control clearance",
            result: "UNKNOWN",
            critical: false,
            explanation: "Control clearance has not been physically verified for this demonstration combination.",
            evidenceSourceIds: [],
          },
        ],
      }),
    [selectedAccessory],
  );

  const requiredProducts = useMemo(
    () =>
      evaluation.requiredComponents
        .map((component) => demoProductsById.get(component.productVariantId))
        .filter((item): item is CatalogVariant => Boolean(item)),
    [evaluation],
  );

  const blocked =
    evaluation.status === "NOT_COMPATIBLE" || evaluation.status === "CONFLICT_DETECTED";

  useEffect(() => {
    async function restore() {
      const [currentRaw, savedRaw] = await Promise.all([
        AsyncStorage.getItem(CURRENT_BUILD_KEY),
        AsyncStorage.getItem(SAVED_BUILDS_KEY),
      ]);

      try {
        if (currentRaw) {
          const ids = JSON.parse(currentRaw) as string[];
          if (Array.isArray(ids)) setBuildItems(productsFromIds(ids));
        }
        if (savedRaw) {
          const saved = JSON.parse(savedRaw) as SavedBuild[];
          if (Array.isArray(saved)) setSavedBuilds(saved);
        }
      } finally {
        setHydrated(true);
      }
    }

    void restore();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem(CURRENT_BUILD_KEY, JSON.stringify(buildItems.map((item) => item.id)));
  }, [buildItems, hydrated]);

  const totals = useMemo<BuildTotals>(() => {
    const prices = [demoHost.knownPriceCents, ...buildItems.map((item) => item.knownPriceCents)];
    const weights = [demoHost.knownWeightGrams, ...buildItems.map((item) => item.knownWeightGrams)];

    const total: BuildTotals = {
      unknownPrices: prices.filter((value) => value === undefined).length,
      unknownWeights: weights.filter((value) => value === undefined).length,
    };

    if (prices.every((value) => value !== undefined)) {
      total.price = prices.reduce<number>((sum, value) => sum + (value ?? 0), 0);
    }
    if (weights.every((value) => value !== undefined)) {
      total.weight = weights.reduce<number>((sum, value) => sum + (value ?? 0), 0);
    }

    return total;
  }, [buildItems]);

  function selectAccessory(id: string) {
    setSelectedAccessoryId(id);
    void Haptics.selectionAsync();
  }

  function addSelected(includeRequired: boolean) {
    if (blocked) return;
    const additions = includeRequired
      ? [selectedAccessory, ...requiredProducts]
      : [selectedAccessory];

    setBuildItems((current) => {
      const existing = new Set(current.map((item) => item.id));
      return [...current, ...additions.filter((item) => !existing.has(item.id))];
    });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function removeFromBuild(id: string) {
    setBuildItems((current) => current.filter((item) => item.id !== id));
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function clearBuild() {
    setBuildItems([]);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  async function saveCurrentBuild() {
    const record: SavedBuild = {
      id: String(Date.now()),
      name: `Build ${savedBuilds.length + 1}`,
      componentIds: buildItems.map((item) => item.id),
      engineVersion: ENGINE_VERSION,
      savedAt: new Date().toISOString(),
    };
    const next = [record, ...savedBuilds];
    setSavedBuilds(next);
    await AsyncStorage.setItem(SAVED_BUILDS_KEY, JSON.stringify(next));
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  const value = useMemo<FitmentContextValue>(
    () => ({
      selectedAccessory,
      evaluation,
      requiredProducts,
      buildItems,
      savedBuilds,
      totals,
      blocked,
      selectAccessory,
      addSelected,
      removeFromBuild,
      clearBuild,
      saveCurrentBuild,
    }),
    [
      selectedAccessory,
      evaluation,
      requiredProducts,
      buildItems,
      savedBuilds,
      totals,
      blocked,
    ],
  );

  return <FitmentContext.Provider value={value}>{children}</FitmentContext.Provider>;
}

export function useFitment(): FitmentContextValue {
  const context = useContext(FitmentContext);
  if (!context) throw new Error("useFitment must be used inside FitmentProvider");
  return context;
}
