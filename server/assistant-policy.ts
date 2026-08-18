export type ModelSummary = { id: string };

/**
 * Selects an economical managed model only from the live provider catalog.
 * No external or paid-provider fallback is considered here.
 */
export function selectManagedModelFromCatalog(models: ModelSummary[]): string {
  const preferred = models.find((model) => model.id === "gpt-5-mini");
  const fallback = models.find((model) => model.id.startsWith("gpt-")) ?? models[0];
  if (!preferred && !fallback) throw new Error("No managed AI model is available.");
  return (preferred ?? fallback).id;
}
