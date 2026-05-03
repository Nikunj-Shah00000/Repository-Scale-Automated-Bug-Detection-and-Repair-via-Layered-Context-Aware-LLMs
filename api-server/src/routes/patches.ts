import { Router } from "express";
import { db } from "@workspace/db";
import { patchesTable, bugsTable } from "@workspace/db";
import { eq, and, SQL } from "drizzle-orm";
import { CreatePatchBody, UpdatePatchBody, ListPatchesQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/patches", async (req, res) => {
  const query = ListPatchesQueryParams.safeParse(req.query);
  const params = query.success ? query.data : {};

  const conditions: SQL[] = [];
  if (params.bugId) conditions.push(eq(patchesTable.bugId, Number(params.bugId)));
  if (params.status) conditions.push(eq(patchesTable.status, params.status));

  const patches = await db
    .select({
      id: patchesTable.id,
      bugId: patchesTable.bugId,
      bugTitle: bugsTable.title,
      diffCode: patchesTable.diffCode,
      explanation: patchesTable.explanation,
      status: patchesTable.status,
      confidence: patchesTable.confidence,
      agentId: patchesTable.agentId,
      contextUsed: patchesTable.contextUsed,
      testsGenerated: patchesTable.testsGenerated,
      createdAt: patchesTable.createdAt,
    })
    .from(patchesTable)
    .leftJoin(bugsTable, eq(patchesTable.bugId, bugsTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(patchesTable.createdAt);

  res.json(patches.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })));
});

router.post("/patches", async (req, res) => {
  const parsed = CreatePatchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [patch] = await db.insert(patchesTable).values(parsed.data).returning();
  // Increment bug patch count
  await db.execute(
    db.update(bugsTable)
      .set({ status: "in_progress" })
      .where(eq(bugsTable.id, parsed.data.bugId))
      .getSQL()
  );
  const bug = await db.select().from(bugsTable).where(eq(bugsTable.id, patch.bugId)).then(r => r[0]);
  res.status(201).json({ ...patch, bugTitle: bug?.title ?? null, createdAt: patch.createdAt.toISOString() });
});

router.get("/patches/:id", async (req, res) => {
  const id = Number(req.params.id);
  const results = await db
    .select({
      id: patchesTable.id,
      bugId: patchesTable.bugId,
      bugTitle: bugsTable.title,
      diffCode: patchesTable.diffCode,
      explanation: patchesTable.explanation,
      status: patchesTable.status,
      confidence: patchesTable.confidence,
      agentId: patchesTable.agentId,
      contextUsed: patchesTable.contextUsed,
      testsGenerated: patchesTable.testsGenerated,
      createdAt: patchesTable.createdAt,
    })
    .from(patchesTable)
    .leftJoin(bugsTable, eq(patchesTable.bugId, bugsTable.id))
    .where(eq(patchesTable.id, id));

  if (!results[0]) {
    res.status(404).json({ error: "Patch not found" });
    return;
  }
  const patch = results[0];
  res.json({ ...patch, createdAt: patch.createdAt.toISOString() });
});

router.patch("/patches/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = UpdatePatchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [patch] = await db.update(patchesTable).set(parsed.data).where(eq(patchesTable.id, id)).returning();
  if (!patch) {
    res.status(404).json({ error: "Patch not found" });
    return;
  }
  // Update bug status if applied
  if (parsed.data.status === "applied") {
    await db.update(bugsTable).set({ status: "patched" }).where(eq(bugsTable.id, patch.bugId));
  }
  const bug = await db.select().from(bugsTable).where(eq(bugsTable.id, patch.bugId)).then(r => r[0]);
  res.json({ ...patch, bugTitle: bug?.title ?? null, createdAt: patch.createdAt.toISOString() });
});

export default router;
