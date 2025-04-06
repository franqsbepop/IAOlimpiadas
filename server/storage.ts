import { 
  users, 
  learningPaths, 
  modules, 
  userProgress, 
  challenges, 
  challengeSubmissions, 
  leaderboard,
  type User, 
  type InsertUser,
  type LearningPath,
  type InsertLearningPath,
  type Module,
  type InsertModule,
  type UserProgress,
  type InsertUserProgress,
  type Challenge,
  type InsertChallenge,
  type ChallengeSubmission,
  type InsertChallengeSubmission,
  type Leaderboard,
  type InsertLeaderboard
} from "@shared/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Learning path operations
  getLearningPath(id: number): Promise<LearningPath | undefined>;
  getAllLearningPaths(): Promise<LearningPath[]>;
  createLearningPath(path: InsertLearningPath): Promise<LearningPath>;
  updateLearningPath(id: number, path: Partial<InsertLearningPath>): Promise<LearningPath | undefined>;
  deleteLearningPath(id: number): Promise<boolean>;

  // Module operations
  getModule(id: number): Promise<Module | undefined>;
  getModulesByLearningPath(learningPathId: number): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: number, module: Partial<InsertModule>): Promise<Module | undefined>;
  deleteModule(id: number): Promise<boolean>;

  // User progress operations
  getUserProgress(userId: number, learningPathId: number): Promise<UserProgress | undefined>;
  getAllUserProgress(userId: number): Promise<UserProgress[]>;
  createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Challenge operations
  getChallenge(id: number): Promise<Challenge | undefined>;
  getAllChallenges(): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: number, challenge: Partial<InsertChallenge>): Promise<Challenge | undefined>;
  deleteChallenge(id: number): Promise<boolean>;
  incrementChallengeParticipants(id: number): Promise<void>;

  // Challenge submission operations
  getChallengeSubmission(id: number): Promise<ChallengeSubmission | undefined>;
  getChallengeSubmissionsByUser(userId: number): Promise<ChallengeSubmission[]>;
  getChallengeSubmissionsByChallenge(challengeId: number): Promise<ChallengeSubmission[]>;
  createChallengeSubmission(submission: InsertChallengeSubmission): Promise<ChallengeSubmission>;
  updateChallengeSubmissionStatus(id: number, status: string, score?: number): Promise<ChallengeSubmission | undefined>;

  // Leaderboard operations
  getLeaderboard(limit?: number): Promise<(Leaderboard & { user: User })[]>;
  getWeeklyLeaderboard(limit?: number): Promise<(Leaderboard & { user: User })[]>;
  updateLeaderboardEntry(userId: number, points: number, challengeCompleted?: boolean, medal?: boolean): Promise<Leaderboard | undefined>;
  getLeaderboardEntry(userId: number): Promise<Leaderboard | undefined>;
  createLeaderboardEntry(entry: InsertLeaderboard): Promise<Leaderboard>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private learningPaths: Map<number, LearningPath>;
  private modules: Map<number, Module>;
  private userProgress: Map<string, UserProgress>;
  private challenges: Map<number, Challenge>;
  private challengeSubmissions: Map<number, ChallengeSubmission>;
  private leaderboard: Map<number, Leaderboard>;
  
  private userIdCounter: number;
  private learningPathIdCounter: number;
  private moduleIdCounter: number;
  private userProgressIdCounter: number;
  private challengeIdCounter: number;
  private submissionIdCounter: number;
  private leaderboardIdCounter: number;

  constructor() {
    this.users = new Map();
    this.learningPaths = new Map();
    this.modules = new Map();
    this.userProgress = new Map();
    this.challenges = new Map();
    this.challengeSubmissions = new Map();
    this.leaderboard = new Map();
    
    this.userIdCounter = 1;
    this.learningPathIdCounter = 1;
    this.moduleIdCounter = 1;
    this.userProgressIdCounter = 1;
    this.challengeIdCounter = 1;
    this.submissionIdCounter = 1;
    this.leaderboardIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // Initialize with sample data
  private initializeData() {
    // Learning paths
    const learningPaths: InsertLearningPath[] = [
      {
        title: "Fundamentos de IA",
        description: "Compreenda os princípios básicos da IA, algoritmos de aprendizado de máquina e suas aplicações práticas.",
        level: "Para Iniciantes",
        category: "AI Fundamentals",
        totalModules: 12,
        estimatedHours: 20,
        primaryColor: "hsl(216, 90%, 60%)",
        icon: "fa-robot",
        imageUrl: null
      },
      {
        title: "Matemática para IA",
        description: "Aprenda os fundamentos matemáticos essenciais para IA: álgebra linear, cálculo, probabilidade e estatística.",
        level: "Para Matemáticos",
        category: "Mathematics",
        totalModules: 15,
        estimatedHours: 25,
        primaryColor: "hsl(160, 84%, 39%)",
        icon: "fa-brain",
        imageUrl: null
      },
      {
        title: "IA em Biociências",
        description: "Explore aplicações de IA em genômica, bioinformática, modelagem de proteínas e descoberta de medicamentos.",
        level: "Para Biólogos",
        category: "Domain Specific",
        totalModules: 10,
        estimatedHours: 18,
        primaryColor: "hsl(270, 86%, 64%)",
        icon: "fa-dna",
        imageUrl: null
      }
    ];
    
    learningPaths.forEach(path => this.createLearningPath(path));
    
    // Challenges
    const challenges: InsertChallenge[] = [
      {
        title: "Classificação de Imagens",
        description: "Implemente um classificador para identificar espécies de plantas em imagens. Use o conjunto de dados disponibilizado.",
        difficulty: "Médio",
        category: "Computer Vision",
        tags: ["Python", "TensorFlow", "Computer Vision"],
        startDate: new Date(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        icon: "fa-code",
        primaryColor: null
      },
      {
        title: "Previsão de Séries Temporais",
        description: "Desenvolva um modelo para prever o consumo de energia em Portugal. Use dados históricos dos últimos 5 anos.",
        difficulty: "Difícil",
        category: "Time Series",
        tags: ["Python", "Pandas", "Time Series"],
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        icon: "fa-chart-line",
        primaryColor: null
      },
      {
        title: "Análise de Sentimentos",
        description: "Crie um modelo para analisar sentimentos em comentários de clientes de e-commerce em português.",
        difficulty: "Fácil",
        category: "NLP",
        tags: ["Python", "NLP", "BERT"],
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        icon: "fa-comments",
        primaryColor: null
      }
    ];
    
    challenges.forEach(challenge => this.createChallenge(challenge));
    
    // Create some modules for the first learning path
    const modules: InsertModule[] = [
      {
        learningPathId: 1,
        title: "Introdução à IA",
        description: "Conheça os fundamentos da Inteligência Artificial",
        content: "Conteúdo detalhado sobre os conceitos básicos de IA.",
        order: 1,
        estimatedMinutes: 45,
      },
      {
        learningPathId: 1,
        title: "Aprendizado de Máquina",
        description: "Compreenda os tipos e aplicações do ML",
        content: "Conteúdo sobre algoritmos supervisionados e não supervisionados.",
        order: 2,
        estimatedMinutes: 60,
      },
      {
        learningPathId: 1,
        title: "Redes Neurais",
        description: "Entenda o funcionamento das redes neurais",
        content: "Conteúdo detalhado sobre neurônios artificiais, camadas e funções de ativação.",
        order: 3,
        estimatedMinutes: 90,
      }
    ];
    
    modules.forEach(module => this.createModule(module));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Learning path operations
  async getLearningPath(id: number): Promise<LearningPath | undefined> {
    return this.learningPaths.get(id);
  }

  async getAllLearningPaths(): Promise<LearningPath[]> {
    return Array.from(this.learningPaths.values());
  }

  async createLearningPath(path: InsertLearningPath): Promise<LearningPath> {
    const id = this.learningPathIdCounter++;
    const learningPath: LearningPath = { ...path, id };
    this.learningPaths.set(id, learningPath);
    return learningPath;
  }

  async updateLearningPath(id: number, path: Partial<InsertLearningPath>): Promise<LearningPath | undefined> {
    const existingPath = this.learningPaths.get(id);
    if (!existingPath) return undefined;
    
    const updatedPath = { ...existingPath, ...path };
    this.learningPaths.set(id, updatedPath);
    return updatedPath;
  }

  async deleteLearningPath(id: number): Promise<boolean> {
    return this.learningPaths.delete(id);
  }

  // Module operations
  async getModule(id: number): Promise<Module | undefined> {
    return this.modules.get(id);
  }

  async getModulesByLearningPath(learningPathId: number): Promise<Module[]> {
    return Array.from(this.modules.values())
      .filter(module => module.learningPathId === learningPathId)
      .sort((a, b) => a.order - b.order);
  }

  async createModule(module: InsertModule): Promise<Module> {
    const id = this.moduleIdCounter++;
    const newModule: Module = { ...module, id };
    this.modules.set(id, newModule);
    return newModule;
  }

  async updateModule(id: number, module: Partial<InsertModule>): Promise<Module | undefined> {
    const existingModule = this.modules.get(id);
    if (!existingModule) return undefined;
    
    const updatedModule = { ...existingModule, ...module };
    this.modules.set(id, updatedModule);
    return updatedModule;
  }

  async deleteModule(id: number): Promise<boolean> {
    return this.modules.delete(id);
  }

  // User progress operations
  async getUserProgress(userId: number, learningPathId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-${learningPathId}`;
    return this.userProgress.get(key);
  }

  async getAllUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId);
  }

  async createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const key = `${progress.userId}-${progress.learningPathId}`;
    const existing = this.userProgress.get(key);
    
    if (existing) {
      const updated: UserProgress = { ...existing, ...progress };
      this.userProgress.set(key, updated);
      return updated;
    } else {
      const id = this.userProgressIdCounter++;
      const now = new Date();
      const newProgress: UserProgress = { ...progress, id, lastAccessedAt: now };
      this.userProgress.set(key, newProgress);
      return newProgress;
    }
  }

  // Challenge operations
  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const id = this.challengeIdCounter++;
    const newChallenge: Challenge = { ...challenge, id, participants: 0 };
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }

  async updateChallenge(id: number, challenge: Partial<InsertChallenge>): Promise<Challenge | undefined> {
    const existingChallenge = this.challenges.get(id);
    if (!existingChallenge) return undefined;
    
    const updatedChallenge = { ...existingChallenge, ...challenge };
    this.challenges.set(id, updatedChallenge);
    return updatedChallenge;
  }

  async deleteChallenge(id: number): Promise<boolean> {
    return this.challenges.delete(id);
  }

  async incrementChallengeParticipants(id: number): Promise<void> {
    const challenge = this.challenges.get(id);
    if (challenge) {
      challenge.participants = (challenge.participants || 0) + 1;
      this.challenges.set(id, challenge);
    }
  }

  // Challenge submission operations
  async getChallengeSubmission(id: number): Promise<ChallengeSubmission | undefined> {
    return this.challengeSubmissions.get(id);
  }

  async getChallengeSubmissionsByUser(userId: number): Promise<ChallengeSubmission[]> {
    return Array.from(this.challengeSubmissions.values())
      .filter(submission => submission.userId === userId);
  }

  async getChallengeSubmissionsByChallenge(challengeId: number): Promise<ChallengeSubmission[]> {
    return Array.from(this.challengeSubmissions.values())
      .filter(submission => submission.challengeId === challengeId);
  }

  async createChallengeSubmission(submission: InsertChallengeSubmission): Promise<ChallengeSubmission> {
    const id = this.submissionIdCounter++;
    const now = new Date();
    const newSubmission: ChallengeSubmission = { ...submission, id, submittedAt: now };
    this.challengeSubmissions.set(id, newSubmission);
    return newSubmission;
  }

  async updateChallengeSubmissionStatus(id: number, status: string, score?: number): Promise<ChallengeSubmission | undefined> {
    const submission = this.challengeSubmissions.get(id);
    if (!submission) return undefined;
    
    const updated: ChallengeSubmission = { 
      ...submission, 
      status, 
      ...(score !== undefined ? { score } : {}) 
    };
    
    this.challengeSubmissions.set(id, updated);
    return updated;
  }

  // Leaderboard operations
  async getLeaderboard(limit?: number): Promise<(Leaderboard & { user: User })[]> {
    const entries = Array.from(this.leaderboard.values())
      .sort((a, b) => b.totalPoints - a.totalPoints);
    
    const limited = limit ? entries.slice(0, limit) : entries;
    
    return limited.map(entry => {
      const user = this.users.get(entry.userId);
      return {
        ...entry,
        user: user!,
      };
    });
  }

  async getWeeklyLeaderboard(limit?: number): Promise<(Leaderboard & { user: User })[]> {
    const entries = Array.from(this.leaderboard.values())
      .sort((a, b) => b.weeklyPoints - a.weeklyPoints);
    
    const limited = limit ? entries.slice(0, limit) : entries;
    
    return limited.map(entry => {
      const user = this.users.get(entry.userId);
      return {
        ...entry,
        user: user!,
      };
    });
  }

  async updateLeaderboardEntry(userId: number, points: number, challengeCompleted: boolean = false, medal: boolean = false): Promise<Leaderboard | undefined> {
    const entry = await this.getLeaderboardEntry(userId);
    
    if (!entry) return undefined;
    
    const updated: Leaderboard = {
      ...entry,
      totalPoints: entry.totalPoints + points,
      weeklyPoints: entry.weeklyPoints + points,
      challengesCompleted: challengeCompleted ? entry.challengesCompleted + 1 : entry.challengesCompleted,
      medals: medal ? entry.medals + 1 : entry.medals,
    };
    
    this.leaderboard.set(entry.id, updated);
    return updated;
  }

  async getLeaderboardEntry(userId: number): Promise<Leaderboard | undefined> {
    return Array.from(this.leaderboard.values()).find(
      (entry) => entry.userId === userId,
    );
  }

  async createLeaderboardEntry(entry: InsertLeaderboard): Promise<Leaderboard> {
    const id = this.leaderboardIdCounter++;
    const newEntry: Leaderboard = { ...entry, id };
    this.leaderboard.set(id, newEntry);
    return newEntry;
  }
}

export const storage = new MemStorage();
