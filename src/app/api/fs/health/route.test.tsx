import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "@/app/api/fs/health/route";

describe("/api/fs/health", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns 200 with healthy status", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.healthy).toBe(true);
    expect(body.status).toBe("ok");
    expect(typeof body.timestamp).toBe("string");
  });

  it("returns JSON with correct structure", async () => {
    const response = await GET();
    const body = await response.json();

    expect(body).toHaveProperty("healthy");
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("timestamp");
    expect(Object.keys(body)).toHaveLength(3);
  });
});
