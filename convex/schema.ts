import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tides: defineTable({
    timestamp: v.number(), // Unix timestamp (ms)
    type: v.string(), // "height" or "extreme"
    height: v.number(), // Meter
    status: v.optional(v.string()), // "high" or "low" (only for extremes)
    location: v.string(), // "Regneville-sur-Mer"
  }).index("by_timestamp", ["timestamp"]),
});
