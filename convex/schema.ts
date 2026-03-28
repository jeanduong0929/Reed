import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    displayName: v.optional(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
