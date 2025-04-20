import { pgTable, text, serial, integer, boolean, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  imageAnalyses: many(imageAnalyses)
}));

// Image Analysis model
export const imageAnalyses = pgTable("image_analyses", {
  id: serial("id").primaryKey(),
  imageId: text("image_id").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  auraScore: integer("aura_score").notNull(),
  rizzScore: integer("rizz_score").notNull(),
  mysticTitle: text("mystic_title").notNull(),
  analysisText: text("analysis_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isPublic: boolean("is_public").default(false).notNull()
});

// Image Analysis relations
export const imageAnalysesRelations = relations(imageAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [imageAnalyses.userId],
    references: [users.id]
  })
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  uuid: true,
  createdAt: true
});

export const insertImageAnalysisSchema = createInsertSchema(imageAnalyses).omit({
  id: true,
  createdAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ImageAnalysis = typeof imageAnalyses.$inferSelect;
export type InsertImageAnalysis = z.infer<typeof insertImageAnalysisSchema>;
