import { pgTable, serial, text, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { bugsTable } from "./bugs";

export const patchesTable = pgTable("patches", {
  id: serial("id").primaryKey(),
  bugId: integer("bug_id").notNull().references(() => bugsTable.id, { onDelete: "cascade" }),
  diffCode: text("diff_code").notNull(),
  explanation: text("explanation").notNull(),
  status: text("status").notNull().default("pending"),
  confidence: real("confidence").notNull(),
  agentId: text("agent_id").notNull(),
  contextUsed: text("context_used").notNull(),
  testsGenerated: integer("tests_generated").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPatchSchema = createInsertSchema(patchesTable).omit({ id: true, createdAt: true });
export type InsertPatch = z.infer<typeof insertPatchSchema>;
export type Patch = typeof patchesTable.$inferSelect;
