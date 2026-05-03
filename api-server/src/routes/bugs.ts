import { Router } from "express";
import { db } from "@workspace/db";
import { bugsTable, repositoriesTable } from "@workspace/db";
import { eq, and, SQL } from "drizzle-orm";
import { CreateBugBody, UpdateBugBody, ListBugsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/bugs", async (req, res) => {
  const query = ListBugsQueryParams.safeParse(req.query);
  const params = query.success ? query.data : {};

  const conditions: SQL[] = [];
  if (params.repositoryId) conditions.push(eq(bugsTable.repositoryId, Number(params.repositoryId)));
  if (params.severity) conditions.push(eq(bugsTable.severity, params.severity));
  if (params.status) conditions.push(eq(bugsTable.status, params.status));
  if (params.language) conditions.push(eq(bugsTable.language, params.language));

  const bugs = await db
    .select({
      id: bugsTable.id,
      repositoryId: bugsTable.repositoryId,
      repositoryName: repositoriesTable.name,
      title: bugsTable.title,
      description: bugsTable.description,
      severity: bugsTable.severity,
      status: bugsTable.status,
      language: bugsTable.language,
      filePath: bugsTable.filePath,
      lineNumber: bugsTable.lineNumber,
      contextLevel: bugsTable.contextLevel,
      bugType: bugsTable.bugType,
      patchCount: bugsTable.patchCount,
      detectedAt: bugsTable.detectedAt,
    })
    .from(bugsTable)
    .leftJoin(repositoriesTable, eq(bugsTable.repositoryId, repositoriesTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(bugsTable.detectedAt);

  res.json(bugs.map(b => ({ ...b, detectedAt: b.detectedAt.toISOString() })));
});

router.post("/bugs", async (req, res) => {
  const parsed = CreateBugBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [bug] = await db.insert(bugsTable).values(parsed.data).returning();
  // Update repo bug count
  await db.execute(
    db.update(repositoriesTable)
      .set({ bugCount: db.select({ count: repositoriesTable.bugCount }).from(repositoriesTable) as unknown as number })
      .where(eq(repositoriesTable.id, parsed.data.repositoryId))
      .getSQL()
  );
  const repo = await db.select().from(repositoriesTable).where(eq(repositoriesTable.id, bug.repositoryId)).then(r => r[0]);
  res.status(201).json({ ...bug, repositoryName: repo?.name ?? null, detectedAt: bug.detectedAt.toISOString() });
});

router.get("/bugs/:id", async (req, res) => {
  const id = Number(req.params.id);
  const results = await db
    .select({
      id: bugsTable.id,
      repositoryId: bugsTable.repositoryId,
      repositoryName: repositoriesTable.name,
      title: bugsTable.title,
      description: bugsTable.description,
      severity: bugsTable.severity,
      status: bugsTable.status,
      language: bugsTable.language,
      filePath: bugsTable.filePath,
      lineNumber: bugsTable.lineNumber,
      contextLevel: bugsTable.contextLevel,
      bugType: bugsTable.bugType,
      patchCount: bugsTable.patchCount,
      detectedAt: bugsTable.detectedAt,
    })
    .from(bugsTable)
    .leftJoin(repositoriesTable, eq(bugsTable.repositoryId, repositoriesTable.id))
    .where(eq(bugsTable.id, id));

  if (!results[0]) {
    res.status(404).json({ error: "Bug not found" });
    return;
  }
  const bug = results[0];
  res.json({ ...bug, detectedAt: bug.detectedAt.toISOString() });
});

router.patch("/bugs/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = UpdateBugBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [bug] = await db.update(bugsTable).set(parsed.data).where(eq(bugsTable.id, id)).returning();
  if (!bug) {
    res.status(404).json({ error: "Bug not found" });
    return;
  }
  const repo = await db.select().from(repositoriesTable).where(eq(repositoriesTable.id, bug.repositoryId)).then(r => r[0]);
  res.json({ ...bug, repositoryName: repo?.name ?? null, detectedAt: bug.detectedAt.toISOString() });
});

router.delete("/bugs/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(bugsTable).where(eq(bugsTable.id, id));
  res.status(204).send();
});

export default router;
