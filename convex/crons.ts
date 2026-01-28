import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Fetch every 6 days to optimize credits (max 1-2 times per week as requested)
crons.interval(
  "fetch-tides",
  { hours: 144 }, // 6 days = 144 hours
  internal.tides.fetchAndStoreTides
);

export default crons;
