import { describe, it, expect } from "bun:test";
import app from "../app";

const date = Date.now();
const email = `abc${date}@gmail.com`;
const password = "Prince";

describe("Auth API Testing", () => {

  it("Register - success", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name: "Prince",
      }),
    });

    expect(res.status).toBe(201);
  });

  it("Register - missing field", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `m${Date.now()}@gmail.com`,
      }),
    });

    expect(res.status).toBe(400);
  });

  it("Register - duplicate email", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name: "Duplicate",
      }),
    });

    expect(res.status).toBe(409);
  });

  it("Register - invalid email format", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "wrong-email",
        password,
        name: "Test",
      }),
    });

    expect(res.status).toBe(400);
  });

  it("Login - success", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    expect(res.status).toBe(200);
  });

  it("Login - wrong password", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "WrongPass" }),
    });

    expect(res.status).toBe(401);
  });

  it("Login - non existing email", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `notfound${Date.now()}@gmail.com`,
        password,
      }),
    });

    expect(res.status).toBe(401);
  });

  it("Refresh - success", async () => {
    const loginRes = await app.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const setCookie = loginRes.headers.get("set-cookie");
    const refreshCookie = setCookie?.split(";")[0] ?? "";

    const refreshRes = await app.request("/auth/refresh", {
      method: "POST",
      headers: { Cookie: refreshCookie },
    });

    expect(refreshRes.status).toBe(200);

    const body = await refreshRes.json();
    expect(typeof body.accessToken).toBe("string");
  });

  it("Refresh - missing cookie", async () => {
    const res = await app.request("/auth/refresh", {
      method: "POST",
    });

    expect(res.status).toBe(401);
  });

});