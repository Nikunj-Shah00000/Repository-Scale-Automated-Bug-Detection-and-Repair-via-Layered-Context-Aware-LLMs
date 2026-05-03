import { Router } from "express";
import { db } from "@workspace/db";
import {
  repositoriesTable,
  bugsTable,
  patchesTable,
  vulnerabilitiesTable,
  agentSessionsTable,
  translationsTable,
  activityTable,
} from "@workspace/db";
import { eq, gte, count, sql } from "drizzle-orm";

const router = Router();

router.get("/dashboard/stats", async (req, res) => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [totalRepos] = await db.select({ count: count() }).from(repositoriesTable);
  const [totalBugs] = await db.select({ count: count() }).from(bugsTable);
  const [patchesApplied] = await db
    .select({ count: count() })
    .from(patchesTable)
    .where(eq(patchesTable.status, "applied"));
  const [openVulns] = await db
    .select({ count: count() })
    .from(vulnerabilitiesTable)
    .where(eq(vulnerabilitiesTable.status, "open"));
  const [totalPatches] = await db.select({ count: count() }).from(patchesTable);
  const [bugsThisWeek] = await db
    .select({ count: count() })
    .from(bugsTable)
    .where(gte(bugsTable.detectedAt, oneWeekAgo));
  const [patchesThisWeek] = await db
    .select({ count: count() })
    .from(patchesTable)
    .where(gte(patchesTable.createdAt, oneWeekAgo));
  const [activeSessions] = await db
    .select({ count: count() })
    .from(agentSessionsTable)
    .where(eq(agentSessionsTable.status, "converged"));
  const [translationJobs] = await db.select({ count: count() }).from(translationsTable);

  const total = Number(totalPatches.count);
  const applied = Number(patchesApplied.count);
  const successRate = total > 0 ? Math.round((applied / total) * 100) / 100 : 0;

  res.json({
    totalRepositories: Number(totalRepos.count),
    totalBugs: Number(totalBugs.count),
    patchesApplied: applied,
    openVulnerabilities: Number(openVulns.count),
    patchSuccessRate: successRate,
    bugsThisWeek: Number(bugsThisWeek.count),
    patchesThisWeek: Number(patchesThisWeek.count),
    activeAgentSessions: Number(activeSessions.count),
    translationJobs: Number(translationJobs.count),
  });
});

router.get("/dashboard/activity", async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const activity = await db
    .select()
    .from(activityTable)
    .orderBy(sql`${activityTable.timestamp} DESC`)
    .limit(limit);
  res.json(activity.map(a => ({ ...a, timestamp: a.timestamp.toISOString() })));
});

router.get("/dashboard/severity-breakdown", async (req, res) => {
  const rows = await db
    .select({ severity: bugsTable.severity, count: count() })
    .from(bugsTable)
    .groupBy(bugsTable.severity);

  const breakdown = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const row of rows) {
    if (row.severity in breakdown) {
      breakdown[row.severity as keyof typeof breakdown] = Number(row.count);
    }
  }
  res.json(breakdown);
});

router.get("/dashboard/language-breakdown", async (req, res) => {
  const rows = await db
    .select({ language: bugsTable.language, count: count() })
    .from(bugsTable)
    .groupBy(bugsTable.language);

  const patchedRows = await db
    .select({ language: bugsTable.language, count: count() })
    .from(bugsTable)
    .where(eq(bugsTable.status, "patched"))
    .groupBy(bugsTable.language);

  const patchedMap = Object.fromEntries(patchedRows.map(r => [r.language, Number(r.count)]));

  const result = rows.map(r => {
    const bugCount = Number(r.count);
    const patchedCount = patchedMap[r.language] ?? 0;
    return {
      language: r.language,
      bugCount,
      patchedCount,
      successRate: bugCount > 0 ? Math.round((patchedCount / bugCount) * 100) / 100 : 0,
    };
  });
  res.json(result);
});

export default router;
