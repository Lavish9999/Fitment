import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { evaluateCompatibility } from "@fitment/compatibility-engine";
import type { CatalogVariant, CompatibilityEvaluation, DimensionCheck } from "@fitment/domain";

import { useCatalog } from "../catalog/CatalogProvider";

export const ENGINE_VERSION = "0.3.0-phase1";
const CURRENT_BUILD_KEY = "fitment.mobile.current-build.v3";
const SAVED_BUILDS_KEY = "fitment.mobile.saved-builds.v3";
const SELECTED_HOST_KEY = "fitment.mobile.selected-host.v1";

const previewDimensionChecks: DimensionCheck[] = [
  {
    code: "CONTROL_CLEARANCE",
    label: "Control clearance",
    result: "UNKNOWN",
    critical: false,
    explanation: "Control clearance has not been physically verified for this preview combination.",
    evidenceSourceIds: [],
  },
];

export interface SavedEvaluationSnapshot {
  accessoryId: string;
  status: CompatibilityEvaluation["status"];
  confidenceScore: number;
  engineVersion: string;
}

export interface SavedBuild {
  id: string;
  name: string;
  hostId: string;
  componentIds: string[];
  engineVersion: string;
  catalogRevision: number;
  evaluations: SavedEvaluationSnapshot[];
  savedAt: string;
  updatedAt: string;
}

interface PersistedCurrentBuild {
  hostId: string;
  componentIds: string[];
}

interface BuildTotals {
  price?: number;
  weight?: number;
  unknownPrices: number;
  unknownWeights: number;
}

interface FitmentContextValue {
  firearms: CatalogVariant[];
  accessories: CatalogVariant[];
  selectedHost: CatalogVariant;
  selectedAccessory: CatalogVariant;
  evaluation: CompatibilityEvaluation;
  evaluations: ReadonlyMap<string, CompatibilityEvaluation>;
  requiredProducts: CatalogVariant[];
  buildItems: CatalogVariant[];
  savedBuilds: SavedBuild[];
  totals: BuildTotals;
  blocked: boolean;
  catalogRevision: number;
  catalogMode: "PREVIEW" | "PRODUCTION";
  catalogSource: string;
  catalogError: Error | null;
  catalogRefreshing: boolean;
  selectHost: (id: string) => void;
  selectAccessory: (id: string) => void;
  addSelected: (includeRequired: boolean) => void;
  removeFromBuild: (id: string) => void;
  clearBuild: () => void;
  saveCurrentBuild: () => void;
  loadBuild: (id: string) => void;
  renameBuild: (id: string, name: string) => void;
  duplicateBuild: (id: string) => void;
  deleteBuild: (id: string) => void;
  refreshCatalog: () => Promise<void>;
  productById: (id: string) => CatalogVariant | undefined;
}

const FitmentContext = createContext<FitmentContextValue | null>(null);

export function FitmentProvider({ children }: { children: ReactNode }) {
  const {
    catalog,
    productsById,
    source,
    isRefreshing,
    error,
    refresh,
  } = useCatalog();
  const defaultHost = catalog.firearms[0];
  const defaultAccessory = catalog.accessories[0];

  const [selectedHostId, setSelectedHostId] = useState(defaultHost.id);
  const [selectedAccessoryId, setSelectedAccessoryId] = useState(defaultAccessory.id);
  const [buildItems, setBuildItems] = useState<CatalogVariant[]>([]);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const selectedHost =
    catalog.firearms.find((item) => item.id === selectedHostId) ?? defaultHost;
  const selectedAccessory =
    catalog.accessories.find((item) => item.id === selectedAccessoryId) ?? defaultAccessory;

  const evaluations = useMemo(
    () =>
      new Map(
        catalog.accessories.map((accessory) => [
          accessory.id,
          evaluateCompatibility({
            host: selectedHost,
            accessory,
            adapters: catalog.adapters,
            exclusions: catalog.exclusions,
            evidenceSources: catalog.evidenceSources,
            adapterGraphCompleteness: "PARTIAL",
            engineVersion: ENGINE_VERSION,
            dimensionChecks: accessory.id.includes("demo") ? previewDimensionChecks : [],
          }),
        ]),
      ),
    [catalog, selectedHost],
  );

  const evaluation = evaluations.get(selectedAccessory.id) ?? evaluations.get(defaultAccessory.id)!;

  const requiredProducts = useMemo(
    () =>
      evaluation.requiredComponents
        .map((component) => productsById.get(component.productVariantId))
        .filter((item): item is CatalogVariant => Boolean(item)),
    [evaluation, productsById],
  );

  const blocked =
    evaluation.status === "NOT_COMPATIBLE" || evaluation.status === "CONFLICT_DETECTED";

  useEffect(() => {
    async function restore() {
      const [selectedHostRaw, currentRaw, savedRaw] = await Promise.all([
        AsyncStorage.getItem(SELECTED_HOST_KEY),
        AsyncStorage.getItem(CURRENT_BUILD_KEY),
        AsyncStorage.getItem(SAVED_BUILDS_KEY),
      ]);

      try {
        const restoredHostId =
          selectedHostRaw && catalog.firearms.some((host) => host.id === selectedHostRaw)
            ? selectedHostRaw
            : defaultHost.id;
        setSelectedHostId(restoredHostId);

        if (currentRaw) {
          const parsed = JSON.parse(currentRaw) as PersistedCurrentBuild | string[];
          const current = Array.isArray(parsed)
            ? { hostId: restoredHostId, componentIds: parsed }
            : parsed;
          if (catalog.firearms.some((host) => host.id === current.hostId)) {
            setSelectedHostId(current.hostId);
          }
          if (Array.isArray(current.componentIds)) {
            setBuildItems(
              current.componentIds
                .map((id) => productsById.get(id))
                .filter((item): item is CatalogVariant => Boolean(item)),
            );
          }
        }

        if (savedRaw) {
          const saved = JSON.parse(savedRaw) as Array<Partial<SavedBuild> & { componentIds?: string[] }>;
          if (Array.isArray(saved)) {
            setSavedBuilds(
              saved
                .filter((build) => build.id && Array.isArray(build.componentIds))
                .map((build, index) => ({
                  id: build.id!,
                  name: build.name ?? `Build ${index + 1}`,
                  hostId:
                    build.hostId && catalog.firearms.some((host) => host.id === build.hostId)
                      ? build.hostId
                      : restoredHostId,
                  componentIds: build.componentIds ?? [],
                  engineVersion: build.engineVersion ?? ENGINE_VERSION,
                  catalogRevision: build.catalogRevision ?? catalog.revision,
                  evaluations: build.evaluations ?? [],
                  savedAt: build.savedAt ?? new Date().toISOString(),
                  updatedAt: build.updatedAt ?? build.savedAt ?? new Date().toISOString(),
                })),
            );
          }
        }
      } finally {
        setHydrated(true);
      }
    }

    void restore();
  }, [catalog, defaultHost.id, productsById]);

  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem(SELECTED_HOST_KEY, selectedHost.id);
  }, [hydrated, selectedHost.id]);

  useEffect(() => {
    if (!hydrated) return;
    const current: PersistedCurrentBuild = {
      hostId: selectedHost.id,
      componentIds: buildItems.map((item) => item.id),
    };
    void AsyncStorage.setItem(CURRENT_BUILD_KEY, JSON.stringify(current));
  }, [buildItems, hydrated, selectedHost.id]);

  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem(SAVED_BUILDS_KEY, JSON.stringify(savedBuilds));
  }, [savedBuilds, hydrated]);

  const totals = useMemo<BuildTotals>(() => {
    const prices = [selectedHost.knownPriceCents, ...buildItems.map((item) => item.knownPriceCents)];
    const weights = [selectedHost.knownWeightGrams, ...buildItems.map((item) => item.knownWeightGrams)];

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
  }, [buildItems, selectedHost]);

  function selectHost(id: string) {
    const next = catalog.firearms.find((host) => host.id === id);
    if (!next || next.id === selectedHost.id) return;
    setSelectedHostId(next.id);
    setBuildItems([]);
    void Haptics.selectionAsync();
  }

  function selectAccessory(id: string) {
    if (!catalog.accessories.some((item) => item.id === id)) return;
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

  function currentEvaluationSnapshots(): SavedEvaluationSnapshot[] {
    return buildItems
      .map((item) => {
        const itemEvaluation = evaluations.get(item.id);
        return itemEvaluation
          ? {
              accessoryId: item.id,
              status: itemEvaluation.status,
              confidenceScore: itemEvaluation.confidenceScore,
              engineVersion: itemEvaluation.engineVersion,
            }
          : undefined;
      })
      .filter((item): item is SavedEvaluationSnapshot => Boolean(item));
  }

  function saveCurrentBuild() {
    const now = new Date().toISOString();
    setSavedBuilds((current) => {
      const record: SavedBuild = {
        id: String(Date.now()),
        name: `${selectedHost.family} Build ${current.length + 1}`,
        hostId: selectedHost.id,
        componentIds: buildItems.map((item) => item.id),
        engineVersion: ENGINE_VERSION,
        catalogRevision: catalog.revision,
        evaluations: currentEvaluationSnapshots(),
        savedAt: now,
        updatedAt: now,
      };
      return [record, ...current];
    });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function loadBuild(id: string) {
    const build = savedBuilds.find((item) => item.id === id);
    if (!build) return;
    if (catalog.firearms.some((host) => host.id === build.hostId)) {
      setSelectedHostId(build.hostId);
    }
    setBuildItems(
      build.componentIds
        .map((componentId) => productsById.get(componentId))
        .filter((item): item is CatalogVariant => Boolean(item)),
    );
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function renameBuild(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSavedBuilds((current) =>
      current.map((build) =>
        build.id === id ? { ...build, name: trimmed, updatedAt: new Date().toISOString() } : build,
      ),
    );
  }

  function duplicateBuild(id: string) {
    setSavedBuilds((current) => {
      const sourceBuild = current.find((build) => build.id === id);
      if (!sourceBuild) return current;
      const now = new Date().toISOString();
      return [
        {
          ...sourceBuild,
          id: String(Date.now()),
          name: `${sourceBuild.name} copy`,
          savedAt: now,
          updatedAt: now,
        },
        ...current,
      ];
    });
    void Haptics.selectionAsync();
  }

  function deleteBuild(id: string) {
    setSavedBuilds((current) => current.filter((build) => build.id !== id));
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  const value = useMemo<FitmentContextValue>(
    () => ({
      firearms: catalog.firearms,
      accessories: catalog.accessories,
      selectedHost,
      selectedAccessory,
      evaluation,
      evaluations,
      requiredProducts,
      buildItems,
      savedBuilds,
      totals,
      blocked,
      catalogRevision: catalog.revision,
      catalogMode: catalog.mode,
      catalogSource: source,
      catalogError: error,
      catalogRefreshing: isRefreshing,
      selectHost,
      selectAccessory,
      addSelected,
      removeFromBuild,
      clearBuild,
      saveCurrentBuild,
      loadBuild,
      renameBuild,
      duplicateBuild,
      deleteBuild,
      refreshCatalog: refresh,
      productById: (id) => productsById.get(id),
    }),
    [
      catalog,
      selectedHost,
      selectedAccessory,
      evaluation,
      evaluations,
      requiredProducts,
      buildItems,
      savedBuilds,
      totals,
      blocked,
      source,
      error,
      isRefreshing,
      refresh,
      productsById,
    ],
  );

  return <FitmentContext.Provider value={value}>{children}</FitmentContext.Provider>;
}

export function useFitment(): FitmentContextValue {
  const context = useContext(FitmentContext);
  if (!context) throw new Error("useFitment must be used inside FitmentProvider");
  return context;
}
