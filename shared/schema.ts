import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  institution: text("institution"),
  role: text("role").default("student"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  institution: true,
  role: true,
  avatarUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Learning Paths
export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  level: text("level").notNull(),
  category: text("category").notNull(),
  totalModules: integer("total_modules").notNull(),
  estimatedHours: integer("estimated_hours").notNull(),
  primaryColor: text("primary_color"),
  icon: text("icon").notNull(),
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).pick({
  title: true,
  description: true,
  imageUrl: true,
  level: true,
  category: true,
  totalModules: true,
  estimatedHours: true,
  primaryColor: true,
  icon: true,
});

export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type LearningPath = typeof learningPaths.$inferSelect;

// Modules for learning paths
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  learningPathId: integer("learning_path_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
});

export const insertModuleSchema = createInsertSchema(modules).pick({
  learningPathId: true,
  title: true,
  description: true,
  content: true,
  order: true,
  estimatedMinutes: true,
});

export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

// User progress
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  learningPathId: integer("learning_path_id").notNull(),
  completedModules: integer("completed_modules").notNull().default(0),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  isCompleted: boolean("is_completed").default(false),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  learningPathId: true,
  completedModules: true,
  isCompleted: true,
});

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

// Challenges
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  participants: integer("participants").default(0),
  icon: text("icon").notNull(),
  primaryColor: text("primary_color"),
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  difficulty: true,
  category: true,
  tags: true,
  startDate: true,
  endDate: true,
  icon: true,
  primaryColor: true,
});

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

// Challenge submissions
export const challengeSubmissions = pgTable("challenge_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  score: integer("score"),
  status: text("status").notNull().default("pending"),
  solution: text("solution").notNull(),
});

export const insertChallengeSubmissionSchema = createInsertSchema(challengeSubmissions).pick({
  userId: true,
  challengeId: true,
  score: true,
  status: true,
  solution: true,
});

export type InsertChallengeSubmission = z.infer<typeof insertChallengeSubmissionSchema>;
export type ChallengeSubmission = typeof challengeSubmissions.$inferSelect;

// Leaderboard
export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  totalPoints: integer("total_points").notNull().default(0),
  challengesCompleted: integer("challenges_completed").notNull().default(0),
  medals: integer("medals").notNull().default(0),
  weeklyPoints: integer("weekly_points").notNull().default(0),
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).pick({
  userId: true,
  totalPoints: true,
  challengesCompleted: true,
  medals: true,
  weeklyPoints: true,
});

export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type Leaderboard = typeof leaderboard.$inferSelect;
