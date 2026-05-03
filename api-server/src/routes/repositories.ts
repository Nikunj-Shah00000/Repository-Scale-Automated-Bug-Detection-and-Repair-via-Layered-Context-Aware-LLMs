import { Router } from "express";
import { db } from "@workspace/db";
import { repositoriesTable, insertRepositorySchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateRepositoryBody } from "@workspace/api-zod";

const router = Router();

router.get("/repositories", async (req, res) => {
  const repos = await db.select().from(repositoriesTable).orderBy(repositoriesTable.createdAt);
  res.json(repos);
});

router.post("/repositories", async (req, res) => {
  const parsed = CreateRepositoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [repo] = await db.insert(repositoriesTable).values(parsed.data).returning();
  res.status(201).json(repo);
});

router.get("/repositories/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [repo] = await db.select().from(repositoriesTable).where(eq(repositoriesTable.id, id));
  if (!repo) {
    res.status(404).json({ error: "Repository not found" });
    return;
  }
  res.json(repo);
});

router.delete("/repositories/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(repositoriesTable).where(eq(repositoriesTable.id, id));
  res.status(204).send();
});

export default router;
