import {
  genrateAccessToken,
  genrateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { describe, it, expect } from "bun:test";

describe("getToken Testing", () => {
  it("Access token testing", async () => {
    const token = await genrateAccessToken({
      id: "4564654654",
      role: "USER",
    });
    expect(typeof token).toBe("string");
    const payload = verifyAccessToken(token);
    expect(payload.id).toBe("4564654654");
    expect(payload.role).toBe("USER");
  });

  it("Refresh token testing", async () => {
    const token = await genrateRefreshToken({
      id: "4564654654",
      role: "USER",
    });
    expect(typeof token).toBe("string");
    const payload = verifyRefreshToken(token);
    expect(payload.id).toBe("4564654654");
    expect(payload.role).toBe("USER");
  });

  it("Access token should fail with refresh verifier", async () => {
    const token = await genrateAccessToken({
      id: "4564654654",
      role: "USER",
    });
    expect(() => verifyRefreshToken(token)).toThrow();
  });

  it("Refresh token should fail with access verifier", async () => {
    const token = await genrateRefreshToken({
      id: "4564654654",
      role: "USER",
    });
    expect(() => verifyAccessToken(token)).toThrow();
  });

  it("Invalid token should throw", () => {
    expect(() => verifyAccessToken("not-a-jwt")).toThrow();
  });
});
