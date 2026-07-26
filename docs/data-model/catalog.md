# Catalog data model

A marketing product and an exact product variant are separate records. Compatibility evaluates exact variant revisions.

Core relationships:

- manufacturer → product family → product → product variant;
- product variant → firearm extension when applicable;
- product variant ↔ interface through directional `product_interfaces`;
- adapter variant → input interface → output interface;
- evidence source → field source or compatibility claim;
- build → build items → immutable snapshots;
- evaluation → engine version + catalog revision + complete result payload.

Normalized columns are required for values used in filtering or compatibility. JSONB is limited to secondary category attributes, source payload preservation, positions, and immutable calculated output.
