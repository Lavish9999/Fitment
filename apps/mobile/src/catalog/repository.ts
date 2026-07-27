import { phase1Catalog, type CatalogDataset } from "@fitment/catalog";

import { isSupabaseConfigured } from "../lib/supabase";

export interface CatalogRepository {
  getCatalog(): Promise<CatalogDataset>;
  source: "LOCAL_PREVIEW" | "SUPABASE";
}

class LocalPreviewCatalogRepository implements CatalogRepository {
  readonly source = "LOCAL_PREVIEW" as const;

  async getCatalog(): Promise<CatalogDataset> {
    return phase1Catalog;
  }
}

// The remote repository is intentionally not activated until the catalog
// migrations are applied and database integration tests prove the row shape.
// Keeping this boundary explicit prevents partially mapped Supabase rows from
// silently becoming compatibility claims.
export const catalogRepository: CatalogRepository = new LocalPreviewCatalogRepository();

export const catalogConnectionState = isSupabaseConfigured
  ? "SUPABASE_CONFIGURED_LOCAL_CATALOG_ACTIVE"
  : "LOCAL_PREVIEW";
