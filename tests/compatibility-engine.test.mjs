import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCompatibility, findVerifiedAdapterPath } from "../.test-dist/packages/compatibility-engine/src/index.js";
import { demoAccessories, demoAdapters, demoEvidence, demoExclusions, demoHost } from "../.test-dist/packages/catalog/src/demo.js";

const engineVersion = "test-1";

function evaluate(accessory, overrides = {}) {
  return evaluateCompatibility({
    host: demoHost,
    accessory,
    adapters: demoAdapters,
    exclusions: demoExclusions,
    evidenceSources: demoEvidence,
    adapterGraphCompleteness: "PARTIAL",
    engineVersion,
    ...overrides,
  });
}

test("direct interface match remains evidence-limited", () => {
  const result = evaluate(demoAccessories[1]);
  assert.equal(result.status, "UNKNOWN");
  assert.equal(result.directMatches[0], "GLOCK_UNIVERSAL_RAIL");
  assert.ok(result.confidenceScore < 70);
});

test("one-adapter path is discovered and surfaced as required", () => {
  const result = evaluate(demoAccessories[0]);
  assert.equal(result.status, "UNKNOWN");
  assert.equal(result.adapterPath[0], "adapter-mos-to-rmr-demo");
  assert.equal(result.requiredComponents[0].productVariantId, "adapter-mos-to-rmr-demo");
});

test("manufacturer-grade evidence can produce verified direct status", () => {
  const source = {
    id: "manufacturer",
    kind: "MANUFACTURER_DOCUMENTATION",
    title: "Manufacturer application chart",
    exactCombinationVerified: true,
    reviewedAt: "2026-07-26T00:00:00.000Z",
  };
  const host = {
    ...demoHost,
    provides: [{ interfaceId: "PICATINNY_1913", location: "rail", evidenceSourceId: source.id, verificationStatus: "VERIFIED" }],
    dataCompleteness: "COMPLETE_FOR_SCOPE",
  };
  const accessory = {
    ...demoAccessories[1],
    requires: [{ interfaceId: "PICATINNY_1913", location: "clamp", evidenceSourceId: source.id, verificationStatus: "VERIFIED" }],
    dataCompleteness: "COMPLETE_FOR_SCOPE",
  };
  const result = evaluateCompatibility({
    host,
    accessory,
    adapters: [],
    exclusions: [],
    evidenceSources: [source],
    adapterGraphCompleteness: "VERIFIED_FOR_SCOPE",
    engineVersion,
  });
  assert.equal(result.status, "VERIFIED_DIRECT");
  assert.ok(result.confidenceScore >= 85);
});

test("explicit exclusion fails closed", () => {
  const accessory = demoAccessories[1];
  const result = evaluate(accessory, {
    exclusions: [{ id: "exclude-1", hostVariantId: demoHost.id, accessoryVariantId: accessory.id, reason: "Exact variant is excluded by the application chart.", evidenceSourceIds: [demoEvidence[0].id] }],
  });
  assert.equal(result.status, "NOT_COMPATIBLE");
  assert.match(result.summary, /excluded/i);
});

test("critical unknown becomes needs measurement", () => {
  const source = {
    id: "manufacturer",
    kind: "MANUFACTURER_DOCUMENTATION",
    title: "Manufacturer specification",
    exactCombinationVerified: false,
    reviewedAt: "2026-07-26T00:00:00.000Z",
  };
  const host = { ...demoHost, provides: [{ interfaceId: "X", location: "rail", evidenceSourceId: source.id, verificationStatus: "VERIFIED" }] };
  const accessory = { ...demoAccessories[1], requires: [{ interfaceId: "X", location: "mount", evidenceSourceId: source.id, verificationStatus: "VERIFIED" }] };
  const result = evaluateCompatibility({
    host,
    accessory,
    adapters: [],
    exclusions: [],
    evidenceSources: [source],
    adapterGraphCompleteness: "PARTIAL",
    engineVersion,
    dimensionChecks: [{ code: "CLEARANCE", label: "Clearance", result: "UNKNOWN", critical: true, explanation: "Exact control clearance is unverified.", evidenceSourceIds: [] }],
  });
  assert.equal(result.status, "NEEDS_MEASUREMENT");
  assert.ok(result.confidenceScore <= 69);
});

test("critical failed rating produces conflict", () => {
  const result = evaluate(demoAccessories[1], {
    ratingChecks: [{ code: "RATING", label: "Manufacturer rating", result: "FAIL", critical: true, explanation: "Manufacturer restriction is violated.", evidenceSourceIds: [] }],
  });
  assert.equal(result.status, "CONFLICT_DETECTED");
});

test("partial adapter graph returns unknown, not a fabricated incompatibility", () => {
  const result = evaluate(demoAccessories[0], { adapters: [] });
  assert.equal(result.status, "UNKNOWN");
  assert.match(result.unknowns.join(" "), /incomplete/i);
});

test("fully reviewed closed scope may return not compatible", () => {
  const host = { ...demoHost, dataCompleteness: "COMPLETE_FOR_SCOPE" };
  const accessory = { ...demoAccessories[0], dataCompleteness: "COMPLETE_FOR_SCOPE" };
  const result = evaluateCompatibility({
    host,
    accessory,
    adapters: [],
    exclusions: [],
    evidenceSources: demoEvidence,
    adapterGraphCompleteness: "VERIFIED_FOR_SCOPE",
    engineVersion,
  });
  assert.equal(result.status, "NOT_COMPATIBLE");
});

test("adapter search protects against circular graphs", () => {
  const path = findVerifiedAdapterPath(
    ["A"],
    "C",
    [
      { adapterProductVariantId: "ab", inputInterfaceId: "A", outputInterfaceId: "B", confidenceScore: 90, verified: true, evidenceSourceIds: [], restrictions: [] },
      { adapterProductVariantId: "ba", inputInterfaceId: "B", outputInterfaceId: "A", confidenceScore: 90, verified: true, evidenceSourceIds: [], restrictions: [] },
      { adapterProductVariantId: "bc", inputInterfaceId: "B", outputInterfaceId: "C", confidenceScore: 90, verified: true, evidenceSourceIds: [], restrictions: [] },
    ],
    3,
  );
  assert.deepEqual(path?.edges.map((edge) => edge.adapterProductVariantId), ["ab", "bc"]);
});
