import { describe, it, expect } from "bun:test";
import app from "../../app";

describe("Admin Route testing", () => {
  let userObj: { accessToken: string } = { accessToken: "" };
  const testUserId = "699f188c6bf7707a6f625208";

  it("Login Admin", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "prince@example5.com",
        password: "password123",
      }),
    });

    const data = (await res.json()) as any;
    userObj = data;

    expect(res.status).toBe(200);
    expect(data.message).toBe("Login successful");
    expect(typeof data.accessToken).toBe("string");
    expect(data.accessToken.length).toBeGreaterThan(0);
    expect(data.user).toBeObject();
    expect(typeof data.user.id).toBe("string");
    expect(typeof data.user.email).toBe("string");
    expect(data.user.role).toBe("ADMIN");
  });

  it("Wronge email  for  Admin access", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "prince@example45.com",
        password: "password123",
      }),
    });

    const data = (await res.json()) as any;

    expect(res.status).toBe(401);
    expect(data.message).toBe("Invalid email or password");
  });

  it("get all users", async () => {
    const res = await app.request("/admin/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userObj.accessToken}`,
      },
    });

    const data = (await res.json()) as any;

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it("Delete user", async () => {
    const res = await app.request(`/admin/users/${testUserId}/delete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userObj.accessToken}`,
      },
    });

    const data = (await res.json()) as any;

    expect(res.status).toBe(200);
    expect(data.message).toBe("successfully received ID");
    expect(data.id).toBe(testUserId);
    expect(data.ur).toBeObject();
    expect(data.ur.isDeleted).toBe(true);
  });

  it("Restore user", async () => {
    const res = await app.request(`/admin/users/${testUserId}/restore`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userObj.accessToken}`,
      },
    });

    const data = (await res.json()) as any;

    expect(res.status).toBe(200);
    expect(data.message).toBe("accout restore successfully");
    expect(data.res).toBeObject();
    expect(data.res.isDeleted).toBe(false);
  });

  it("update user", async () => {
    const res = await app.request(`/admin/users/${testUserId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userObj.accessToken}`,
      },
      body: JSON.stringify({
        name: "New Name",
        isActive: true,
        isDelete: false,
        isVerified: true,
      }),
    });

    const data = (await res.json()) as any;

    expect(res.status).toBe(200);
    expect(data.message).toBe("working");
    expect(data.res).toBeObject();
    expect(data.res.name).toBe("New Name");
    expect(data.res.isActive).toBe(true);
    expect(data.res.isVerified).toBe(true);
  });

  it("update user role to ADMIN", async () => {
    const res = await app.request(`/admin/users/${testUserId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userObj.accessToken}`,
      },
      body: JSON.stringify({
        role: "ADMIN",
      }),
    });

    const data = (await res.json()) as any;

    expect(res.status).toBe(200);
    expect(data.message).toBe("Role updated");
    expect(data.preRole).toBe("ADMIN");
    expect(data.res.role).toBe("ADMIN");
  });

  it("update user role to USER", async () => {
    const res = await app.request(`/admin/users/${testUserId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userObj.accessToken}`,
      },
      body: JSON.stringify({
        role: "USER",
      }),
    });

    const data = (await res.json()) as any;

    expect(res.status).toBe(200);
    expect(data.message).toBe("Role updated");
    expect(data.preRole).toBe("USER");
    expect(data.res.role).toBe("USER");
  });

  it("user stats", async () => {
    const res = await app.request("/admin/users/stats", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userObj.accessToken}`,
      },
    });

    const data = (await res.json()) as any;

    expect(res.status).toBe(200);
    expect(data.message).toBe("all stats");
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
    expect(typeof data.data[0].total).toBe("number");
    expect(typeof data.data[0].Active).toBe("number");
    expect(typeof data.data[0].delete).toBe("number");
    expect(typeof data.data[0].verify).toBe("number");
  });
});
