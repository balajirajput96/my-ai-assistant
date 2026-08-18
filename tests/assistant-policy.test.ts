import { describe, expect, it } from "vitest";

import { createInitialStore } from "../hooks/use-assistant-store";
import { selectManagedModelFromCatalog } from "../server/assistant-policy";

describe("assistant policy", () => {
  it("prefers the economical managed model when it is available", () => {
    expect(selectManagedModelFromCatalog([{ id: "claude-sonnet-4-6" }, { id: "gpt-5-mini" }])).toBe("gpt-5-mini");
  });

  it("uses an available managed catalog fallback without inventing a model id", () => {
    expect(selectManagedModelFromCatalog([{ id: "claude-haiku-4-5" }, { id: "gpt-5" }])).toBe("gpt-5");
  });

  it("rejects an empty managed catalog", () => {
    expect(() => selectManagedModelFromCatalog([])).toThrow("No managed AI model is available.");
  });

  it("starts with privacy-preserving local storage defaults", () => {
    const store = createInitialStore();
    expect(store.settings.memoryEnabled).toBe(true);
    expect(store.settings.providerMode).toBe("managed");
    expect(store.conversations).toEqual([]);
    expect(store.routines.some((routine) => routine.riskLevel === "medium" && routine.enabled)).toBe(false);
  });
});
