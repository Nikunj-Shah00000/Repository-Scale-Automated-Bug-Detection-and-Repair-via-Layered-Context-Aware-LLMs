import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { repositoriesTable } from "./repositories";

export const bugsTable = pgTable("bugs", {
  id: serial("id").primaryKey(),
  repositoryId: integer("repository_id").notNull().references(() => repositoriesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull().default("detected"),
  language: text("language").notNull(),
  filePath: text("file_path").notNull(),
  lineNumber: integer("line_number"),
  contextLevel: text("context_level").notNull(),
  bugType: text("bug_type").notNull(),
  patchCount: integer("patch_count").notNull().default(0),
  detectedAt: timestamp("detected_at").notNull().defaultNow(),
});

export const insertBugSchema = createInsertSchema(bugsTable).omit({ id: true, patchCount: true, detectedAt: true });
export type InsertBug = z.infer<typeof insertBugSchema>;
export type Bug = typeof bugsTable.$inferSelect;
