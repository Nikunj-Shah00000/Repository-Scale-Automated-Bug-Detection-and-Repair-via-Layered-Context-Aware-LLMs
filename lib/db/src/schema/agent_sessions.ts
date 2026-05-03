import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { bugsTable } from "./bugs";

export const agentSessionsTable = pgTable("agent_sessions", {
  id: serial("id").primaryKey(),
  bugId: integer("bug_id").notNull().references(() => bugsTable.id, { onDelete: "cascade" }),
  agents: jsonb("agents").notNull().default([]),
  status: text("status").notNull().default("initializing"),
  reasoningSteps: jsonb("reasoning_steps").notNull().default([]),
  consensus: text("consensus"),
  patchId: integer("patch_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAgentSessionSchema = createInsertSchema(agentSessionsTable).omit({ id: true, agents: true, status: true, reasoningSteps: true, consensus: true, patchId: true, createdAt: true });
export type InsertAgentSession = z.infer<typeof insertAgentSessionSchema>;
export type AgentSession = typeof agentSessionsTable.$inferSelect;
