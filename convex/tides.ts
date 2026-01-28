import { internalAction, internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const WORLDTIDES_API_KEY = "0cfc0fea-9de7-43b4-b7cb-a6881c6f8c7e";
const LAT = 49.017;
const LON = -1.55;
const LOCATION = "Regneville";

/**
 * Main function to fetch data once every 6 days.
 * Preserves credits by using a long interval and 15min resolution.
 */
export const fetchAndStoreTides = internalAction({
  args: {},
  handler: async (ctx) => {
    // 7 days of data with 15min resolution
    const url = `https://www.worldtides.info/api/v3?heights&extremes&lat=${LAT}&lon=${LON}&key=${WORLDTIDES_API_KEY}&days=7&datum=CD&step=900`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) throw new Error(`WorldTides error: ${data.error}`);

    const tasks = [];

    if (data.heights) {
      for (const h of data.heights) {
        tasks.push({
          timestamp: h.dt * 1000,
          type: "height",
          height: h.height,
          location: LOCATION,
        });
      }
    }

    if (data.extremes) {
      for (const e of data.extremes) {
        tasks.push({
          timestamp: e.dt * 1000,
          type: "extreme",
          height: e.height,
          status: e.type.toLowerCase(),
          location: LOCATION,
        });
      }
    }

    console.log(`API response: ${data.heights?.length || 0} heights, ${data.extremes?.length || 0} extremes`);
    await ctx.runMutation(internal.tides.storeTides, { data: tasks });
    console.log(`Successfully triggered storeTides with ${tasks.length} items`);
  },
});

/**
 * Internal storage with 5min tolerance to avoid duplicates.
 */
export const storeTides = internalMutation({
  args: {
    data: v.array(
      v.object({
        timestamp: v.number(),
        type: v.string(),
        height: v.number(),
        status: v.optional(v.string()),
        location: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.data) {
      if (item.type === "height") {
        // Precise matching for heights to avoid data compression
        const existing = await ctx.db
          .query("tides")
          .withIndex("by_timestamp", (q) => q.eq("timestamp", item.timestamp))
          .filter((q) => q.eq(q.field("type"), "height"))
          .first();

        if (existing) {
          await ctx.db.patch(existing._id, item);
        } else {
          await ctx.db.insert("tides", item);
        }
      } else {
        // Soft tolerance (1 min) only for extremes as their timing can jitter
        const TOLERANCE = 60 * 1000; 
        const existing = await ctx.db
          .query("tides")
          .withIndex("by_timestamp", (q) => 
            q.gte("timestamp", item.timestamp - TOLERANCE)
             .lte("timestamp", item.timestamp + TOLERANCE)
          )
          .filter((q) => q.eq(q.field("type"), "extreme"))
          .first();

        if (existing) {
          // If status changed (unlikely for the same peak), skip or update
          if (existing.status !== item.status) {
            await ctx.db.insert("tides", item);
          } else {
            await ctx.db.patch(existing._id, item);
          }
        } else {
          await ctx.db.insert("tides", item);
        }
      }
    }
  },
});

// Calibration offsets for Coutainville (relative to Regnéville data)
// Update these values to calibrate the entire site.
const CALIBRATION = {
  HEIGHT: 0.0, // in meters (ex: +0.2 or -0.1)
  TIME: -20,      // in minutes (ex: +15 if the tide arrives later at Coutainville)
};

export const getTides = query({
  args: { from: v.number(), to: v.number() },
  handler: async (ctx, args) => {
    const timeShift = CALIBRATION.TIME * 60 * 1000;
    
    // We fetch a range that accounts for the time shift to ensure we don't miss data
    const tides = await ctx.db
      .query("tides")
      .withIndex("by_timestamp", (q) =>
        q.gte("timestamp", args.from - timeShift).lte("timestamp", args.to - timeShift)
      )
      .collect();

    // Apply calibration to all returned data
    if (tides.length > 0) {
      console.log(`[Calibration] Appliquée: ${CALIBRATION.TIME}min, ${CALIBRATION.HEIGHT}m sur ${tides.length} points.`);
    }
    return tides.map(t => ({
      ...t,
      timestamp: t.timestamp + timeShift,
      height: t.height + CALIBRATION.HEIGHT
    }));
  },
});
