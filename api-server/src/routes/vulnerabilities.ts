import { Router } from "express";
import { db } from "@workspace/db";
import { vulnerabilitiesTable } from "@workspace/db";
import { eq, and, SQL } from "drizzle-orm";
import { UpdateVulnerabilityBody, ListVulnerabilitiesQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/vulnerabilities", async (req, res) => {
  const query = ListVulnerabilitiesQueryParams.safeParse(req.query);
  const params = query.success ? query.data : {};

  const conditions: SQL[] = [];
  if (params.severity) conditions.push(eq(vulnerabilitiesTable.severity, params.severity));
  if (params.status) conditions.push(eq(vulnerabilitiesTable.status, params.status));

  const vulns = await db
    .select()
    .from(vulnerabilitiesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(vulnerabilitiesTable.detectedAt);

  res.json(vulns.map(v => ({ ...v, detectedAt: v.detectedAt.toISOString() })));
});

router.get("/vulnerabilities/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [vuln] = await db.select().from(vulnerabilitiesTable).where(eq(vulnerabilitiesTable.id, id));
  if (!vuln) {
    res.status(404).json({ error: "Vulnerability not found" });
    return;
  }
  res.json({ ...vuln, detectedAt: vuln.detectedAt.toISOString() });
});

router.patch("/vulnerabilities/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = UpdateVulnerabilityBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [vuln] = await db.update(vulnerabilitiesTable).set(parsed.data).where(eq(vulnerabilitiesTable.id, id)).returning();
  if (!vuln) {
    res.status(404).json({ error: "Vulnerability not found" });
    return;
  }
  res.json({ ...vuln, detectedAt: vuln.detectedAt.toISOString() });
});

export default router;
