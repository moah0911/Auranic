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
  imageAnalyses: many(imageAnalyses),
  songAnalyses: many(songAnalyses)
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
  isPublic: boolean("is_public").default(false).notNull(),
  contentType: text("content_type").default("image").notNull() // To differentiate from song analyses
});

// Image Analysis relations
export const imageAnalysesRelations = relations(imageAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [imageAnalyses.userId],
    references: [users.id]
  })
}));

// Song Analysis model
export const songAnalyses = pgTable("song_analyses", {
  id: serial("id").primaryKey(),
  songId: text("song_id").notNull().unique(),
  songName: text("song_name").notNull(),
  userId: integer("user_id").references(() => users.id),
  auraScore: integer("aura_score").notNull(),
  rizzScore: integer("rizz_score").notNull(),
  mysticTitle: text("mystic_title").notNull(),
  analysisText: text("analysis_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  contentType: text("content_type").default("song").notNull() // To differentiate from image analyses
});

// Song Analysis relations
export const songAnalysesRelations = relations(songAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [songAnalyses.userId],
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

export const insertSongAnalysisSchema = createInsertSchema(songAnalyses).omit({
  id: true,
  createdAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ImageAnalysis = typeof imageAnalyses.$inferSelect;
export type InsertImageAnalysis = z.infer<typeof insertImageAnalysisSchema>;

export type SongAnalysis = typeof songAnalyses.$inferSelect;
export type InsertSongAnalysis = z.infer<typeof insertSongAnalysisSchema>;
