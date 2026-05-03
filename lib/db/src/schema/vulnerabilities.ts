import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const vulnerabilitiesTable = pgTable("vulnerabilities", {
  id: serial("id").primaryKey(),
  bugId: integer("bug_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  cveId: text("cve_id"),
  severity: text("severity").notNull(),
  status: text("status").notNull().default("open"),
  category: text("category").notNull(),
  repositoryName: text("repository_name").notNull(),
  detectedAt: timestamp("detected_at").notNull().defaultNow(),
});

export const insertVulnerabilitySchema = createInsertSchema(vulnerabilitiesTable).omit({ id: true, detectedAt: true });
export type InsertVulnerability = z.infer<typeof insertVulnerabilitySchema>;
export type Vulnerability = typeof vulnerabilitiesTable.$inferSelect;
