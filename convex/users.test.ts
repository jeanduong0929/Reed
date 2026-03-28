// @vitest-environment edge-runtime
/// <reference types="vite/client" />

import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";

import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

describe("users", () => {
  test("getCurrentUser returns null when unauthenticated", async () => {
    const t = convexTest({ schema, modules });

    await expect(t.query(api.users.getCurrentUser, {})).resolves.toBeNull();
  });

  test("syncUser rejects unauthenticated callers", async () => {
    const t = convexTest({ schema, modules });

    await expect(t.mutation(api.users.syncUser, {})).rejects.toThrow(
      "Not authenticated",
    );
  });

  test("syncUser inserts the Clerk identity on first sign in", async () => {
    const t = convexTest({ schema, modules });
    const authed = t.withIdentity({
      tokenIdentifier: "token|alice",
      email: "alice@example.com",
      name: "Alice Example",
      pictureUrl: "https://example.com/alice.png",
    });

    const userId = await authed.mutation(api.users.syncUser, {});
    const currentUser = await authed.query(api.users.getCurrentUser, {});

    expect(currentUser).toMatchObject({
      _id: userId,
      tokenIdentifier: "token|alice",
      email: "alice@example.com",
      displayName: "Alice Example",
      image: "https://example.com/alice.png",
    });
  });

  test("syncUser reuses the existing user document for the same identity", async () => {
    const t = convexTest({ schema, modules });
    const authed = t.withIdentity({
      tokenIdentifier: "token|alice",
      email: "alice@example.com",
      name: "Alice Example",
    });

    const firstUserId = await authed.mutation(api.users.syncUser, {});
    const secondUserId = await authed.mutation(api.users.syncUser, {});

    const users = await t.query(async (ctx) => {
      const results = [];
      for await (const user of ctx.db.query("users")) {
        results.push(user);
      }
      return results;
    });

    expect(secondUserId).toBe(firstUserId);
    expect(users).toHaveLength(1);
  });
});
