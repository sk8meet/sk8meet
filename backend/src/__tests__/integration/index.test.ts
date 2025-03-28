import request from "supertest";
import app from "../../index";
import { describe, expect, it } from "@jest/globals";

describe("Express Application", () => {
  // Test /api/hello endpoint
  it("GET /api/hello should return greeting message", async () => {
    const response = await request(app)
      .get("/api/hello")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual({
      message: "Hello from Sk8Meet API!",
    });
  });

  // Test /health endpoint
  it("GET /health should return health check status", async () => {
    const response = await request(app)
      .get("/health")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("status", "OK");
    expect(response.body).toHaveProperty("timestamp");

    // Validate timestamp format
    expect(() => new Date(response.body.timestamp)).not.toThrow();
  });
});
