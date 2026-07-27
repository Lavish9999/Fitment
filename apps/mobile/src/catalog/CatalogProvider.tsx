import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";

import { phase1Catalog, phase1ProductsById, type CatalogDataset } from "@fitment/catalog";
import type { CatalogVariant } from "@fitment/domain";

import { catalogConnectionState, catalogRepository } from "./repository";

interface CatalogContextValue {
  catalog: CatalogDataset;
  productsById: ReadonlyMap<string, CatalogVariant>;
  source: typeof catalogConnectionState;
  isRefreshing: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const query = useQuery({
    queryKey: ["catalog", phase1Catalog.id, phase1Catalog.revision],
    queryFn: () => catalogRepository.getCatalog(),
    initialData: phase1Catalog,
  });

  const catalog = query.data;
  const productsById =
    catalog === phase1Catalog
      ? phase1ProductsById
      : new Map(
          [...catalog.firearms, ...catalog.accessories, ...catalog.requiredComponents].map((product) => [
            product.id,
            product,
          ]),
        );

  return (
    <CatalogContext.Provider
      value={{
        catalog,
        productsById,
        source: catalogConnectionState,
        isRefreshing: query.isFetching,
        error: query.error instanceof Error ? query.error : null,
        refresh: async () => {
          await query.refetch();
        },
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used inside CatalogProvider");
  return context;
}
