import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertLearningPathSchema,
  insertModuleSchema,
  insertUserProgressSchema,
  insertChallengeSchema,
  insertChallengeSubmissionSchema,
  insertLeaderboardSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for users
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const user = await storage.createUser(userData);
      
      // Create initial leaderboard entry
      await storage.createLeaderboardEntry({
        userId: user.id,
        totalPoints: 0,
        challengesCompleted: 0,
        medals: 0,
        weeklyPoints: 0
      });
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });
  
  // Login route
  app.post("/api/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // Don't return the password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // API routes for learning paths
  app.get("/api/learning-paths", async (_req: Request, res: Response) => {
    const learningPaths = await storage.getAllLearningPaths();
    res.json(learningPaths);
  });

  app.get("/api/learning-paths/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid learning path ID" });
    }

    const learningPath = await storage.getLearningPath(id);
    if (!learningPath) {
      return res.status(404).json({ message: "Learning path not found" });
    }

    res.json(learningPath);
  });

  app.post("/api/learning-paths", async (req: Request, res: Response) => {
    try {
      const learningPathData = insertLearningPathSchema.parse(req.body);
      const learningPath = await storage.createLearningPath(learningPathData);
      res.status(201).json(learningPath);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid learning path data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create learning path" });
      }
    }
  });

  app.put("/api/learning-paths/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid learning path ID" });
    }

    try {
      const learningPathData = insertLearningPathSchema.partial().parse(req.body);
      const updatedLearningPath = await storage.updateLearningPath(id, learningPathData);
      
      if (!updatedLearningPath) {
        return res.status(404).json({ message: "Learning path not found" });
      }
      
      res.json(updatedLearningPath);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid learning path data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update learning path" });
      }
    }
  });

  app.delete("/api/learning-paths/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid learning path ID" });
    }

    const deleted = await storage.deleteLearningPath(id);
    if (!deleted) {
      return res.status(404).json({ message: "Learning path not found" });
    }

    res.status(204).end();
  });

  // API routes for modules
  app.get("/api/learning-paths/:id/modules", async (req: Request, res: Response) => {
    const learningPathId = parseInt(req.params.id);
    if (isNaN(learningPathId)) {
      return res.status(400).json({ message: "Invalid learning path ID" });
    }

    const modules = await storage.getModulesByLearningPath(learningPathId);
    res.json(modules);
  });

  app.get("/api/modules/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid module ID" });
    }

    const module = await storage.getModule(id);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.json(module);
  });

  app.post("/api/modules", async (req: Request, res: Response) => {
    try {
      const moduleData = insertModuleSchema.parse(req.body);
      const module = await storage.createModule(moduleData);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid module data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create module" });
      }
    }
  });

  // API routes for user progress
  app.get("/api/users/:userId/progress", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const progress = await storage.getAllUserProgress(userId);
    res.json(progress);
  });

  app.get("/api/users/:userId/progress/:pathId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const pathId = parseInt(req.params.pathId);
    
    if (isNaN(userId) || isNaN(pathId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const progress = await storage.getUserProgress(userId, pathId);
    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.json(progress);
  });

  app.post("/api/user-progress", async (req: Request, res: Response) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createOrUpdateUserProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update progress" });
      }
    }
  });

  // API routes for challenges
  app.get("/api/challenges", async (_req: Request, res: Response) => {
    const challenges = await storage.getAllChallenges();
    res.json(challenges);
  });

  app.get("/api/challenges/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }

    const challenge = await storage.getChallenge(id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json(challenge);
  });

  app.post("/api/challenges", async (req: Request, res: Response) => {
    try {
      const challengeData = insertChallengeSchema.parse(req.body);
      const challenge = await storage.createChallenge(challengeData);
      res.status(201).json(challenge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid challenge data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create challenge" });
      }
    }
  });

  // API routes for challenge submissions
  app.post("/api/challenge-submissions", async (req: Request, res: Response) => {
    try {
      const submissionData = insertChallengeSubmissionSchema.parse(req.body);
      
      // Increment challenge participants
      await storage.incrementChallengeParticipants(submissionData.challengeId);
      
      const submission = await storage.createChallengeSubmission(submissionData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid submission data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create submission" });
      }
    }
  });

  app.get("/api/users/:userId/submissions", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const submissions = await storage.getChallengeSubmissionsByUser(userId);
    res.json(submissions);
  });

  app.get("/api/challenges/:challengeId/submissions", async (req: Request, res: Response) => {
    const challengeId = parseInt(req.params.challengeId);
    if (isNaN(challengeId)) {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }

    const submissions = await storage.getChallengeSubmissionsByChallenge(challengeId);
    res.json(submissions);
  });

  // API routes for leaderboard
  app.get("/api/leaderboard", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const leaderboard = await storage.getLeaderboard(limit);
    res.json(leaderboard);
  });

  app.get("/api/leaderboard/weekly", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const leaderboard = await storage.getWeeklyLeaderboard(limit);
    res.json(leaderboard);
  });

  const httpServer = createServer(app);
  return httpServer;
}
