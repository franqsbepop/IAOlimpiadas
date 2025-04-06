// Re-export types from schema.ts for frontend use
import type {
  User as SchemaUser,
  LearningPath as SchemaLearningPath,
  Module as SchemaModule,
  UserProgress as SchemaUserProgress,
  Challenge as SchemaChallenge,
  ChallengeSubmission as SchemaChallengeSubmission,
  Leaderboard as SchemaLeaderboard
} from "@shared/schema";

// User type without password for frontend
export type User = Omit<SchemaUser, "password">;

// Re-export other types
export type LearningPath = SchemaLearningPath;
export type Module = SchemaModule;
export type UserProgress = SchemaUserProgress;
export type Challenge = SchemaChallenge;
export type ChallengeSubmission = SchemaChallengeSubmission;
export type Leaderboard = SchemaLeaderboard;

// Leaderboard entry with user data
export interface LeaderboardEntry extends Leaderboard {
  user: User;
}

// Feature card data
export interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}
