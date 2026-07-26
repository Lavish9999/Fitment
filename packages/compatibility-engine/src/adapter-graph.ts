import type { AdapterConnection } from "../../domain/src/index.js";

export interface AdapterPathResult {
  edges: AdapterConnection[];
  totalPriceCents: number | null;
  totalWeightGrams: number | null;
}

function sumKnown(values: Array<number | undefined>): number | undefined {
  return values.every((value) => value !== undefined)
    ? values.reduce<number>((total, value) => total + (value ?? 0), 0)
    : undefined;
}

function rankPath(path: AdapterConnection[]): [number, number, number] {
  const price = sumKnown(path.map((edge) => edge.priceCents)) ?? Number.MAX_SAFE_INTEGER;
  const weight = sumKnown(path.map((edge) => edge.weightGrams)) ?? Number.MAX_SAFE_INTEGER;
  return [path.length, price, weight];
}

function isBetter(candidate: AdapterConnection[], current?: AdapterConnection[]): boolean {
  if (!current) return true;
  const a = rankPath(candidate);
  const b = rankPath(current);
  return a[0] < b[0] || (a[0] === b[0] && (a[1] < b[1] || (a[1] === b[1] && a[2] < b[2])));
}

export function findVerifiedAdapterPath(
  startInterfaces: string[],
  targetInterface: string,
  adapters: AdapterConnection[],
  maxHops: number,
): AdapterPathResult | undefined {
  const queue: Array<{ current: string; path: AdapterConnection[]; visited: Set<string> }> =
    startInterfaces.map((current) => ({ current, path: [], visited: new Set([current]) }));
  let best: AdapterConnection[] | undefined;

  while (queue.length > 0) {
    const next = queue.shift();
    if (!next) break;
    if (next.path.length >= maxHops) continue;

    for (const edge of adapters) {
      if (!edge.verified || edge.inputInterfaceId !== next.current) continue;
      if (next.visited.has(edge.outputInterfaceId)) continue;

      const path = [...next.path, edge];
      if (edge.outputInterfaceId === targetInterface) {
        if (isBetter(path, best)) best = path;
        continue;
      }

      queue.push({
        current: edge.outputInterfaceId,
        path,
        visited: new Set([...next.visited, edge.outputInterfaceId]),
      });
    }
  }

  if (!best) return undefined;
  return {
    edges: best,
    totalPriceCents: sumKnown(best.map((edge) => edge.priceCents)) ?? null,
    totalWeightGrams: sumKnown(best.map((edge) => edge.weightGrams)) ?? null,
  };
}
