"use client";

import { useEffect, useMemo, useState } from "react";
import {
  demoAccessories,
  demoAdapters,
  demoEvidence,
  demoExclusions,
  demoHost,
  demoProductsById,
} from "@fitment/catalog";
import { evaluateCompatibility } from "@fitment/compatibility-engine";
import type { CatalogVariant } from "@fitment/domain";

interface SavedBuild {
  id: string;
  name: string;
  hostId: string;
  componentIds: string[];
  savedAt: string;
  engineVersion: string;
}

const ENGINE_VERSION = "0.1.0-demo";
const STORAGE_KEY = "fitment.demo.saved-builds";

function money(cents?: number): string {
  return cents === undefined ? "Unknown" : new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function BuilderDemo() {
  const [selectedAccessoryId, setSelectedAccessoryId] = useState(demoAccessories[0]?.id ?? "");
  const [buildItems, setBuildItems] = useState<CatalogVariant[]>([]);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const selectedAccessory =
    demoAccessories.find((product) => product.id === selectedAccessoryId) ?? demoAccessories[0];

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setSavedBuilds(JSON.parse(raw) as SavedBuild[]);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const evaluation = useMemo(() => {
    if (!selectedAccessory) return undefined;
    return evaluateCompatibility({
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
          explanation: "Control clearance has not been physically verified for this demo combination.",
          evidenceSourceIds: [],
        },
      ],
    });
  }, [selectedAccessory]);

  const totals = useMemo(() => {
    const prices = [demoHost.knownPriceCents, ...buildItems.map((item) => item.knownPriceCents)];
    const weights = [demoHost.knownWeightGrams, ...buildItems.map((item) => item.knownWeightGrams)];
    return {
      knownPriceCents: prices.every((value) => value !== undefined)
        ? prices.reduce<number>((sum, value) => sum + (value ?? 0), 0)
        : undefined,
      knownWeightGrams: weights.every((value) => value !== undefined)
        ? weights.reduce<number>((sum, value) => sum + (value ?? 0), 0)
        : undefined,
      unknownPriceItems: prices.filter((value) => value === undefined).length,
      unknownWeightItems: weights.filter((value) => value === undefined).length,
    };
  }, [buildItems]);

  function addSelected(includeRequired: boolean): void {
    if (!selectedAccessory || !evaluation) return;
    if (["NOT_COMPATIBLE", "CONFLICT_DETECTED"].includes(evaluation.status)) return;

    const required = includeRequired
      ? evaluation.requiredComponents
          .map((item) => demoProductsById.get(item.productVariantId))
          .filter((item): item is CatalogVariant => Boolean(item))
      : [];
    const additions = [selectedAccessory, ...required];

    setBuildItems((current) => {
      const existing = new Set(current.map((item) => item.id));
      return [...current, ...additions.filter((item) => !existing.has(item.id))];
    });
  }

  function saveDemoBuild(): void {
    const record: SavedBuild = {
      id: crypto.randomUUID(),
      name: `Demo build ${savedBuilds.length + 1}`,
      hostId: demoHost.id,
      componentIds: buildItems.map((item) => item.id),
      savedAt: new Date().toISOString(),
      engineVersion: ENGINE_VERSION,
    };
    const next = [record, ...savedBuilds];
    setSavedBuilds(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <div className="builderGrid">
      <section className="panel">
        <h2>1. Exact host</h2>
        <div className="hostCard">
          <span>{demoHost.manufacturer}</span>
          <strong>{demoHost.exactModel}</strong>
          <small>Variant ID: {demoHost.id}</small>
        </div>
        <h2>2. Select component</h2>
        <label className="fieldLabel" htmlFor="component">Accessory</label>
        <select
          id="component"
          value={selectedAccessoryId}
          onChange={(event) => setSelectedAccessoryId(event.target.value)}
        >
          {demoAccessories.map((product) => (
            <option key={product.id} value={product.id}>
              {product.manufacturer} — {product.exactModel}
            </option>
          ))}
        </select>
        {selectedAccessory ? (
          <div className="specList">
            <div><span>Category</span><strong>{selectedAccessory.category}</strong></div>
            <div><span>Product price</span><strong>{money(selectedAccessory.knownPriceCents)}</strong></div>
            <div><span>Known weight</span><strong>{selectedAccessory.knownWeightGrams ?? "Unknown"} g</strong></div>
          </div>
        ) : null}
      </section>

      <section className="panel inspector" aria-live="polite">
        <div className="panelTitleRow">
          <h2>3. Compatibility</h2>
          {evaluation ? <span className={`status status-${evaluation.status}`}>{evaluation.status}</span> : null}
        </div>
        {evaluation ? (
          <>
            <p className="summary">{evaluation.summary}</p>
            <div className="confidence"><span>Confidence</span><strong>{evaluation.confidenceScore}/100</strong></div>
            <h3>Required components</h3>
            {evaluation.requiredComponents.length > 0 ? (
              <ul>{evaluation.requiredComponents.map((item) => <li key={item.productVariantId}>{item.productVariantId}: {item.reason}</li>)}</ul>
            ) : <p className="muted">No additional component is currently identified.</p>}
            <h3>Unknowns</h3>
            {evaluation.unknowns.length > 0 ? <ul>{evaluation.unknowns.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="muted">No unresolved checks in this evaluation.</p>}
            <h3>Evidence</h3>
            {evaluation.evidenceSources.length > 0 ? (
              <ul>{evaluation.evidenceSources.map((source) => <li key={source.id}>{source.title} — {source.kind}</li>)}</ul>
            ) : <p className="muted">No source records are attached.</p>}
            <div className="addActions">
              <button
                className="primaryButton buttonReset"
                onClick={() => addSelected(true)}
                disabled={["NOT_COMPATIBLE", "CONFLICT_DETECTED"].includes(evaluation.status)}
              >
                {evaluation.requiredComponents.length > 0
                  ? "Add component + required items"
                  : evaluation.status === "UNKNOWN"
                    ? "Add as unresolved"
                    : "Add component to build"}
              </button>
              {evaluation.requiredComponents.length > 0 ? (
                <button
                  className="secondaryButton buttonReset"
                  onClick={() => addSelected(false)}
                  disabled={["NOT_COMPATIBLE", "CONFLICT_DETECTED"].includes(evaluation.status)}
                >
                  Add component only
                </button>
              ) : null}
            </div>
            {evaluation.status === "UNKNOWN" ? (
              <p className="finePrint">This adds an unresolved planning item; it does not convert the result into a compatibility claim.</p>
            ) : null}
          </>
        ) : null}
      </section>

      <section className="panel buildPanel">
        <div className="panelTitleRow"><h2>4. Build</h2><span>{buildItems.length} components</span></div>
        {buildItems.length > 0 ? (
          <ul className="buildItems">
            {buildItems.map((item) => (
              <li key={item.id}>
                <div><strong>{item.exactModel}</strong><span>{money(item.knownPriceCents)}</span></div>
                <button onClick={() => setBuildItems((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button>
              </li>
            ))}
          </ul>
        ) : <p className="emptyState">No components added yet. Review a compatibility result first.</p>}
        <div className="totals">
          <div><span>Known build price</span><strong>{money(totals.knownPriceCents)}</strong></div>
          <div><span>Known configured weight</span><strong>{totals.knownWeightGrams ?? "Unknown"} g</strong></div>
          <div><span>Unknown price items</span><strong>{totals.unknownPriceItems}</strong></div>
          <div><span>Unknown weight items</span><strong>{totals.unknownWeightItems}</strong></div>
        </div>
        <button className="secondaryButton buttonReset" onClick={saveDemoBuild}>Save local demo snapshot</button>
        <p className="finePrint">Authenticated cloud persistence is represented in the database migration and is the next wiring step. Local demo saves never claim cloud sync.</p>
      </section>

      <section className="panel savedPanel">
        <h2>Saved local snapshots</h2>
        {savedBuilds.length > 0 ? (
          <ul>{savedBuilds.map((build) => <li key={build.id}><strong>{build.name}</strong><span>{build.componentIds.length} components · engine {build.engineVersion}</span></li>)}</ul>
        ) : <p className="emptyState">No local snapshots yet.</p>}
      </section>
    </div>
  );
}
