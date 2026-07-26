import test from "node:test";
import assert from "node:assert/strict";

import { phase1Catalog } from "../.test-dist/packages/catalog/src/phase1.js";
import { evaluateCompatibility } from "../.test-dist/packages/compatibility-engine/src/index.js";

const engineVersion = "phase1-test";

function evaluate(hostId, accessoryId) {
  const host = phase1Catalog.firearms.find((item) => item.id === hostId);
  const accessory = phase1Catalog.accessories.find((item) => item.id === accessoryId);
  assert.ok(host, `missing host ${hostId}`);
  assert.ok(accessory, `missing accessory ${accessoryId}`);
  return evaluateCompatibility({
    host,
    accessory,
    adapters: phase1Catalog.adapters,
    exclusions: phase1Catalog.exclusions,
    evidenceSources: phase1Catalog.evidenceSources,
    adapterGraphCompleteness: "PARTIAL",
    engineVersion,
  });
}

test("manufacturer-supported P365-XMACRO and ROMEOZero Elite evaluates as verified direct", () => {
  const result = evaluate(
    "firearm-sig-p365-xmacro-optics-ready",
    "optic-sig-romeozero-elite-1x24",
  );
  assert.equal(result.status, "VERIFIED_DIRECT");
  assert.deepEqual(result.directMatches, ["SHIELD_RMSC_FOOTPRINT"]);
  assert.ok(result.confidenceScore >= 85);
});

test("the same optic does not inherit compatibility when a different exact host is selected", () => {
  const result = evaluate("firearm-glock-g19-gen5-mos", "optic-sig-romeozero-elite-1x24");
  assert.equal(result.status, "UNKNOWN");
  assert.equal(result.directMatches.length, 0);
});

test("GLOCK MOS preview exposes the Trijicon plate path without overstating demo optic evidence", () => {
  const result = evaluate("firearm-glock-g19-gen5-mos", "optic-rmr-demo");
  assert.equal(result.status, "UNKNOWN");
  assert.deepEqual(result.adapterPath, ["adapter-glock-mos-plate-02-trijicon"]);
  assert.equal(result.requiredComponents[0]?.productVariantId, "adapter-glock-mos-plate-02-trijicon");
});
