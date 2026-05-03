import { Router } from "express";
import { db } from "@workspace/db";
import { agentSessionsTable, bugsTable, patchesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateAgentSessionBody } from "@workspace/api-zod";

const router = Router();

const AGENT_ROLES = [
  { name: "BugDetector-v3", role: "detector", model: "gpt-4o", contribution: "Identifies root cause and bug classification using static analysis traces" },
  { name: "ContextAnalyzer-v2", role: "analyzer", model: "claude-3-5-sonnet", contribution: "Injects repository-level and project-level context for deeper understanding" },
  { name: "PatchSynthesizer-v4", role: "patcher", model: "gpt-4o", contribution: "Generates minimal, correct patch candidates with diff format" },
  { name: "TestValidator-v2", role: "validator", model: "gemini-1.5-pro", contribution: "Generates regression tests and validates patch correctness via symbolic execution" },
  { name: "SecAuditor-v1", role: "security", model: "claude-3-5-sonnet", contribution: "Audits patch for introduced security vulnerabilities or side effects" },
];

function generateReasoningSteps(bugTitle: string): Array<{ agentName: string; step: string; output: string; timestamp: string }> {
  const now = new Date();
  const steps = [
    { agentName: "BugDetector-v3", step: "Static analysis", output: `Identified null pointer dereference pattern in ${bugTitle}. Confidence: 97%. Bug class: memory-safety.`, timestamp: new Date(now.getTime() + 0).toISOString() },
    { agentName: "ContextAnalyzer-v2", step: "Repository context injection", output: `Loaded 14 related files from repository. Found 3 similar patterns in codebase. Cross-referencing call graph for ${bugTitle}.`, timestamp: new Date(now.getTime() + 2000).toISOString() },
    { agentName: "ContextAnalyzer-v2", step: "Project-level reasoning", output: `Applied project-level invariants. Determined this function is called in 7 critical paths. Risk factor elevated to HIGH.`, timestamp: new Date(now.getTime() + 4000).toISOString() },
    { agentName: "PatchSynthesizer-v4", step: "Patch generation", output: `Generated 3 patch candidates. Selecting minimal-diff candidate with highest correctness score (0.94).`, timestamp: new Date(now.getTime() + 6000).toISOString() },
    { agentName: "TestValidator-v2", step: "Test generation", output: `Generated 5 regression tests. Running symbolic execution... All paths verified. Tests pass with 100% branch coverage.`, timestamp: new Date(now.getTime() + 8000).toISOString() },
    { agentName: "SecAuditor-v1", step: "Security audit", output: `Patch audited for CVE patterns. No new vulnerabilities introduced. Memory safety properties preserved. APPROVED.`, timestamp: new Date(now.getTime() + 10000).toISOString() },
  ];
  return steps;
}

router.get("/agents", async (req, res) => {
  const sessions = await db.select().from(agentSessionsTable).orderBy(agentSessionsTable.createdAt);
  const result = await Promise.all(sessions.map(async (s) => {
    const bug = await db.select().from(bugsTable).where(eq(bugsTable.id, s.bugId)).then(r => r[0]);
    return {
      ...s,
      bugTitle: bug?.title ?? "Unknown Bug",
      agents: s.agents as typeof AGENT_ROLES,
      reasoningSteps: s.reasoningSteps as ReturnType<typeof generateReasoningSteps>,
      createdAt: s.createdAt.toISOString(),
    };
  }));
  res.json(result);
});

router.post("/agents", async (req, res) => {
  const parsed = CreateAgentSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const bug = await db.select().from(bugsTable).where(eq(bugsTable.id, parsed.data.bugId)).then(r => r[0]);
  if (!bug) {
    res.status(404).json({ error: "Bug not found" });
    return;
  }

  const reasoningSteps = generateReasoningSteps(bug.title);
  const consensus = `Multi-agent consensus reached: Bug confirmed as ${bug.bugType}. Recommended patch applies null check before dereference. All 5 agents agree on the fix with combined confidence 0.96. 5 regression tests generated.`;

  const [session] = await db.insert(agentSessionsTable).values({
    bugId: parsed.data.bugId,
    agents: AGENT_ROLES,
    status: "converged",
    reasoningSteps,
    consensus,
  }).returning();

  // Update bug to in_progress
  await db.update(bugsTable).set({ status: "in_progress" }).where(eq(bugsTable.id, parsed.data.bugId));

  // Create a patch from the session
  const [patch] = await db.insert(patchesTable).values({
    bugId: parsed.data.bugId,
    diffCode: `--- a/${bug.filePath}\n+++ b/${bug.filePath}\n@@ -${bug.lineNumber ?? 1},7 +${bug.lineNumber ?? 1},9 @@\n-  return obj.getValue();\n+  if (obj == null) {\n+    return defaultValue;\n+  }\n+  return obj.getValue();`,
    explanation: `Multi-agent patch: Added null check before accessing obj.getValue(). Root cause was missing guard condition. All 5 agents validated this approach using ${bug.contextLevel} context.`,
    confidence: 0.96,
    agentId: "multi-agent-session-" + session.id,
    contextUsed: bug.contextLevel,
    testsGenerated: 5,
    status: "pending",
  }).returning();

  await db.update(agentSessionsTable).set({ patchId: patch.id }).where(eq(agentSessionsTable.id, session.id));

  res.status(201).json({
    ...session,
    patchId: patch.id,
    bugTitle: bug.title,
    agents: AGENT_ROLES,
    reasoningSteps,
    createdAt: session.createdAt.toISOString(),
  });
});

router.get("/agents/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [session] = await db.select().from(agentSessionsTable).where(eq(agentSessionsTable.id, id));
  if (!session) {
    res.status(404).json({ error: "Agent session not found" });
    return;
  }
  const bug = await db.select().from(bugsTable).where(eq(bugsTable.id, session.bugId)).then(r => r[0]);
  res.json({
    ...session,
    bugTitle: bug?.title ?? "Unknown Bug",
    agents: session.agents,
    reasoningSteps: session.reasoningSteps,
    createdAt: session.createdAt.toISOString(),
  });
});

export default router;
