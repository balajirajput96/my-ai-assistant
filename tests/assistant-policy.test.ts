import { describe, expect, it } from "vitest";

import { createInitialStore } from "../hooks/use-assistant-store";
import { selectManagedModelFromCatalog } from "../server/assistant-policy";
import { clearChatRateLimitsForTest, consumeChatRequest } from "../server/assistant-rate-limit";

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

  it("limits anonymous chat bursts and resets after its time window", () => {
    clearChatRateLimitsForTest();
    const timestamp = 10_000;
    for (let request = 0; request < 20; request += 1) {
      expect(consumeChatRequest("test-client", timestamp)).toBe(true);
    }
    expect(consumeChatRequest("test-client", timestamp)).toBe(false);
    expect(consumeChatRequest("test-client", timestamp + 60_000)).toBe(true);
  });
});
