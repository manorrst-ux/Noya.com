import { describe, expect, it } from "vitest";
import { createShortScript } from "./script";

describe("createShortScript", () => {
  it("returns a bounded original short structure", async () => {
    const result = await createShortScript("test topic", { summary: "A verified summary", sources: [], claims: [] });
    expect(result.hook).toContain("test topic");
    expect(result.estimatedSeconds).toBeLessThanOrEqual(60);
    expect(result.cta.length).toBeGreaterThan(0);
  });
});
