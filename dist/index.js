// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  learningPaths;
  modules;
  userProgress;
  challenges;
  challengeSubmissions;
  leaderboard;
  userIdCounter;
  learningPathIdCounter;
  moduleIdCounter;
  userProgressIdCounter;
  challengeIdCounter;
  submissionIdCounter;
  leaderboardIdCounter;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.learningPaths = /* @__PURE__ */ new Map();
    this.modules = /* @__PURE__ */ new Map();
    this.userProgress = /* @__PURE__ */ new Map();
    this.challenges = /* @__PURE__ */ new Map();
    this.challengeSubmissions = /* @__PURE__ */ new Map();
    this.leaderboard = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.learningPathIdCounter = 1;
    this.moduleIdCounter = 1;
    this.userProgressIdCounter = 1;
    this.challengeIdCounter = 1;
    this.submissionIdCounter = 1;
    this.leaderboardIdCounter = 1;
    this.initializeData();
  }
  // Initialize with sample data
  initializeData() {
    const learningPaths2 = [
      {
        title: "Fundamentos de IA",
        description: "Compreenda os princ\xEDpios b\xE1sicos da IA, algoritmos de aprendizagem autom\xE1tica e as suas aplica\xE7\xF5es pr\xE1ticas.",
        level: "Para Iniciantes",
        category: "AI Fundamentals",
        totalModules: 12,
        estimatedHours: 20,
        primaryColor: "hsl(216, 90%, 60%)",
        icon: "fa-robot",
        imageUrl: null
      },
      {
        title: "Matem\xE1tica para IA",
        description: "Aprenda os fundamentos matem\xE1ticos essenciais para IA: \xE1lgebra linear, c\xE1lculo, probabilidade e estat\xEDstica.",
        level: "Para Matem\xE1ticos",
        category: "Mathematics",
        totalModules: 15,
        estimatedHours: 25,
        primaryColor: "hsl(160, 84%, 39%)",
        icon: "fa-brain",
        imageUrl: null
      },
      {
        title: "PyTorch para IA",
        description: "Aprenda a desenvolver modelos de IA utilizando o PyTorch, uma das frameworks mais populares para aprendizagem profunda.",
        level: "Interm\xE9dio",
        category: "Deep Learning",
        totalModules: 12,
        estimatedHours: 22,
        primaryColor: "hsl(32, 100%, 50%)",
        icon: "fa-fire",
        imageUrl: null
      },
      {
        title: "Embeddings e Representa\xE7\xF5es",
        description: "Explore como transformar dados em representa\xE7\xF5es vetoriais para aplica\xE7\xF5es de IA, incluindo NLP e sistemas de recomenda\xE7\xE3o.",
        level: "Avan\xE7ado",
        category: "NLP",
        totalModules: 10,
        estimatedHours: 18,
        primaryColor: "hsl(270, 86%, 64%)",
        icon: "fa-network-wired",
        imageUrl: null
      },
      {
        title: "IA em Bioci\xEAncias",
        description: "Explore aplica\xE7\xF5es de IA em gen\xF3mica, bioinform\xE1tica, modela\xE7\xE3o de prote\xEDnas e descoberta de medicamentos.",
        level: "Para Bi\xF3logos",
        category: "Domain Specific",
        totalModules: 10,
        estimatedHours: 18,
        primaryColor: "hsl(150, 86%, 34%)",
        icon: "fa-dna",
        imageUrl: null
      }
    ];
    learningPaths2.forEach((path3) => this.createLearningPath(path3));
    const challenges2 = [
      {
        title: "Classifica\xE7\xE3o de Imagens",
        description: "Implemente um classificador para identificar esp\xE9cies de plantas em imagens. Use o conjunto de dados disponibilizado.",
        difficulty: "M\xE9dio",
        category: "Computer Vision",
        tags: ["Python", "TensorFlow", "Computer Vision"],
        startDate: /* @__PURE__ */ new Date(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3),
        // 5 days from now
        icon: "fa-code",
        primaryColor: null
      },
      {
        title: "Previs\xE3o de S\xE9ries Temporais",
        description: "Desenvolva um modelo para prever o consumo de energia em Portugal. Use dados hist\xF3ricos dos \xFAltimos 5 anos.",
        difficulty: "Dif\xEDcil",
        category: "Time Series",
        tags: ["Python", "Pandas", "Time Series"],
        startDate: /* @__PURE__ */ new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1e3),
        // 3 days from now
        icon: "fa-chart-line",
        primaryColor: null
      },
      {
        title: "An\xE1lise de Sentimentos",
        description: "Crie um modelo para analisar sentimentos em coment\xE1rios de clientes de e-commerce em portugu\xEAs.",
        difficulty: "F\xE1cil",
        category: "NLP",
        tags: ["Python", "NLP", "BERT"],
        startDate: /* @__PURE__ */ new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3),
        // 7 days from now
        icon: "fa-comments",
        primaryColor: null
      }
    ];
    challenges2.forEach((challenge) => this.createChallenge(challenge));
    const modules2 = [
      {
        learningPathId: 1,
        title: "Introdu\xE7\xE3o \xE0 IA",
        description: "Conhe\xE7a os fundamentos da Intelig\xEAncia Artificial",
        content: "Conte\xFAdo detalhado sobre os conceitos b\xE1sicos de IA.",
        order: 1,
        estimatedMinutes: 45
      },
      {
        learningPathId: 1,
        title: "Aprendizagem Autom\xE1tica",
        description: "Compreenda os tipos e aplica\xE7\xF5es da aprendizagem autom\xE1tica",
        content: "Conte\xFAdo sobre algoritmos supervisionados e n\xE3o supervisionados.",
        order: 2,
        estimatedMinutes: 60
      },
      {
        learningPathId: 1,
        title: "Redes Neuronais",
        description: "Entenda o funcionamento das redes neuronais",
        content: "Conte\xFAdo detalhado sobre neur\xF3nios artificiais, camadas e fun\xE7\xF5es de ativa\xE7\xE3o.",
        order: 3,
        estimatedMinutes: 90
      },
      {
        learningPathId: 3,
        title: "Introdu\xE7\xE3o ao PyTorch",
        description: "Aprenda os fundamentos do PyTorch para IA",
        content: "Neste m\xF3dulo, exploramos os conceitos b\xE1sicos do PyTorch, uma das bibliotecas mais populares para desenvolvimento de IA. Aprender\xE1 sobre tensores, opera\xE7\xF5es b\xE1sicas, autograd e como construir modelos simples. Baseado no tutorial introdut\xF3rio oficial do PyTorch.",
        order: 1,
        estimatedMinutes: 60
      },
      {
        learningPathId: 3,
        title: "Tensores e Opera\xE7\xF5es",
        description: "Manipula\xE7\xE3o de dados em PyTorch",
        content: "Aprofunde os seus conhecimentos sobre tensores, a estrutura fundamental de dados no PyTorch. Aprender\xE1 a criar, manipular e realizar opera\xE7\xF5es em tensores, essenciais para o desenvolvimento de modelos de aprendizagem autom\xE1tica.",
        order: 2,
        estimatedMinutes: 45
      },
      {
        learningPathId: 3,
        title: "Constru\xE7\xE3o de Modelos Neuronais",
        description: "Implementa\xE7\xE3o pr\xE1tica de redes neuronais com PyTorch",
        content: "Neste m\xF3dulo, aprender\xE1 a construir redes neuronais completas usando PyTorch. Cobriremos desde redes simples at\xE9 arquiteturas mais complexas, incluindo CNN e RNN, com exemplos pr\xE1ticos e exerc\xEDcios.",
        order: 3,
        estimatedMinutes: 90
      },
      {
        learningPathId: 2,
        title: "\xC1lgebra Linear para IA",
        description: "Fundamentos de vetores, matrizes e opera\xE7\xF5es",
        content: "Este m\xF3dulo cobre os conceitos essenciais de \xE1lgebra linear necess\xE1rios para compreender algoritmos de IA: vetores, matrizes, opera\xE7\xF5es matriciais, autovalores e autovetores. Baseado no curr\xEDculo da DeepLearning.AI.",
        order: 1,
        estimatedMinutes: 75
      },
      {
        learningPathId: 2,
        title: "C\xE1lculo para Otimiza\xE7\xE3o",
        description: "Derivadas, gradientes e otimiza\xE7\xE3o",
        content: "Neste m\xF3dulo, exploramos como o c\xE1lculo \xE9 utilizado para otimizar modelos de IA. Aprender\xE1 sobre derivadas, gradientes, regra da cadeia e m\xE9todos de otimiza\xE7\xE3o como gradiente descendente.",
        order: 2,
        estimatedMinutes: 90
      },
      {
        learningPathId: 2,
        title: "Probabilidade e Estat\xEDstica",
        description: "Conceitos probabil\xEDsticos para modelos de IA",
        content: "Estudo da teoria da probabilidade e estat\xEDstica aplicada \xE0 IA, incluindo distribui\xE7\xF5es, infer\xEAncia bayesiana, teste de hip\xF3teses e intervalos de confian\xE7a. Essencial para compreender modelos probabil\xEDsticos.",
        order: 3,
        estimatedMinutes: 80
      },
      {
        learningPathId: 4,
        title: "Introdu\xE7\xE3o a Embeddings",
        description: "Fundamentos da representa\xE7\xE3o vetorial de dados",
        content: "Este m\xF3dulo introduz o conceito de embeddings, t\xE9cnicas para representar dados complexos como texto, imagens ou \xE1udio em espa\xE7os vetoriais de alta dimens\xE3o. Baseado na documenta\xE7\xE3o da Cohere.",
        order: 1,
        estimatedMinutes: 50
      },
      {
        learningPathId: 4,
        title: "Embeddings de Texto",
        description: "Representa\xE7\xE3o sem\xE2ntica de linguagem natural",
        content: "Aprenda como transformar texto em vetores densos que capturam significado sem\xE2ntico. Este m\xF3dulo aborda modelos como Word2Vec, GloVe e embeddings contextuais modernos baseados em transformers.",
        order: 2,
        estimatedMinutes: 70
      },
      {
        learningPathId: 4,
        title: "Aplica\xE7\xF5es de Embeddings",
        description: "Casos de uso pr\xE1tico para embeddings",
        content: "Explore aplica\xE7\xF5es pr\xE1ticas de embeddings em sistemas de IA: pesquisa sem\xE2ntica, sistemas de recomenda\xE7\xE3o, clustering, detec\xE7\xE3o de anomalias e an\xE1lise de sentimentos. Inclui exemplos pr\xE1ticos com a API da Cohere.",
        order: 3,
        estimatedMinutes: 65
      }
    ];
    modules2.forEach((module) => this.createModule(module));
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const user = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  async getAllUsers() {
    return Array.from(this.users.values());
  }
  // Learning path operations
  async getLearningPath(id) {
    return this.learningPaths.get(id);
  }
  async getAllLearningPaths() {
    return Array.from(this.learningPaths.values());
  }
  async createLearningPath(path3) {
    const id = this.learningPathIdCounter++;
    const learningPath = { ...path3, id };
    this.learningPaths.set(id, learningPath);
    return learningPath;
  }
  async updateLearningPath(id, path3) {
    const existingPath = this.learningPaths.get(id);
    if (!existingPath) return void 0;
    const updatedPath = { ...existingPath, ...path3 };
    this.learningPaths.set(id, updatedPath);
    return updatedPath;
  }
  async deleteLearningPath(id) {
    return this.learningPaths.delete(id);
  }
  // Module operations
  async getModule(id) {
    return this.modules.get(id);
  }
  async getModulesByLearningPath(learningPathId) {
    return Array.from(this.modules.values()).filter((module) => module.learningPathId === learningPathId).sort((a, b) => a.order - b.order);
  }
  async createModule(module) {
    const id = this.moduleIdCounter++;
    const newModule = { ...module, id };
    this.modules.set(id, newModule);
    return newModule;
  }
  async updateModule(id, module) {
    const existingModule = this.modules.get(id);
    if (!existingModule) return void 0;
    const updatedModule = { ...existingModule, ...module };
    this.modules.set(id, updatedModule);
    return updatedModule;
  }
  async deleteModule(id) {
    return this.modules.delete(id);
  }
  // User progress operations
  async getUserProgress(userId, learningPathId) {
    const key = `${userId}-${learningPathId}`;
    return this.userProgress.get(key);
  }
  async getAllUserProgress(userId) {
    return Array.from(this.userProgress.values()).filter((progress) => progress.userId === userId);
  }
  async createOrUpdateUserProgress(progress) {
    const key = `${progress.userId}-${progress.learningPathId}`;
    const existing = this.userProgress.get(key);
    if (existing) {
      const updated = { ...existing, ...progress };
      this.userProgress.set(key, updated);
      return updated;
    } else {
      const id = this.userProgressIdCounter++;
      const now = /* @__PURE__ */ new Date();
      const newProgress = { ...progress, id, lastAccessedAt: now };
      this.userProgress.set(key, newProgress);
      return newProgress;
    }
  }
  // Challenge operations
  async getChallenge(id) {
    return this.challenges.get(id);
  }
  async getAllChallenges() {
    return Array.from(this.challenges.values());
  }
  async createChallenge(challenge) {
    const id = this.challengeIdCounter++;
    const newChallenge = { ...challenge, id, participants: 0 };
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }
  async updateChallenge(id, challenge) {
    const existingChallenge = this.challenges.get(id);
    if (!existingChallenge) return void 0;
    const updatedChallenge = { ...existingChallenge, ...challenge };
    this.challenges.set(id, updatedChallenge);
    return updatedChallenge;
  }
  async deleteChallenge(id) {
    return this.challenges.delete(id);
  }
  async incrementChallengeParticipants(id) {
    const challenge = this.challenges.get(id);
    if (challenge) {
      challenge.participants = (challenge.participants || 0) + 1;
      this.challenges.set(id, challenge);
    }
  }
  // Challenge submission operations
  async getChallengeSubmission(id) {
    return this.challengeSubmissions.get(id);
  }
  async getChallengeSubmissionsByUser(userId) {
    return Array.from(this.challengeSubmissions.values()).filter((submission) => submission.userId === userId);
  }
  async getChallengeSubmissionsByChallenge(challengeId) {
    return Array.from(this.challengeSubmissions.values()).filter((submission) => submission.challengeId === challengeId);
  }
  async createChallengeSubmission(submission) {
    const id = this.submissionIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const newSubmission = { ...submission, id, submittedAt: now };
    this.challengeSubmissions.set(id, newSubmission);
    return newSubmission;
  }
  async updateChallengeSubmissionStatus(id, status, score) {
    const submission = this.challengeSubmissions.get(id);
    if (!submission) return void 0;
    const updated = {
      ...submission,
      status,
      ...score !== void 0 ? { score } : {}
    };
    this.challengeSubmissions.set(id, updated);
    return updated;
  }
  // Leaderboard operations
  async getLeaderboard(limit) {
    const entries = Array.from(this.leaderboard.values()).sort((a, b) => b.totalPoints - a.totalPoints);
    const limited = limit ? entries.slice(0, limit) : entries;
    return limited.map((entry) => {
      const user = this.users.get(entry.userId);
      return {
        ...entry,
        user
      };
    });
  }
  async getWeeklyLeaderboard(limit) {
    const entries = Array.from(this.leaderboard.values()).sort((a, b) => b.weeklyPoints - a.weeklyPoints);
    const limited = limit ? entries.slice(0, limit) : entries;
    return limited.map((entry) => {
      const user = this.users.get(entry.userId);
      return {
        ...entry,
        user
      };
    });
  }
  async updateLeaderboardEntry(userId, points, challengeCompleted = false, medal = false) {
    const entry = await this.getLeaderboardEntry(userId);
    if (!entry) return void 0;
    const updated = {
      ...entry,
      totalPoints: entry.totalPoints + points,
      weeklyPoints: entry.weeklyPoints + points,
      challengesCompleted: challengeCompleted ? entry.challengesCompleted + 1 : entry.challengesCompleted,
      medals: medal ? entry.medals + 1 : entry.medals
    };
    this.leaderboard.set(entry.id, updated);
    return updated;
  }
  async getLeaderboardEntry(userId) {
    return Array.from(this.leaderboard.values()).find(
      (entry) => entry.userId === userId
    );
  }
  async createLeaderboardEntry(entry) {
    const id = this.leaderboardIdCounter++;
    const newEntry = { ...entry, id };
    this.leaderboard.set(id, newEntry);
    return newEntry;
  }
};
var storage = new MemStorage();

// server/routes.ts
import { z } from "zod";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  institution: text("institution"),
  role: text("role").default("student"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  institution: true,
  role: true,
  avatarUrl: true
});
var learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  level: text("level").notNull(),
  category: text("category").notNull(),
  totalModules: integer("total_modules").notNull(),
  estimatedHours: integer("estimated_hours").notNull(),
  primaryColor: text("primary_color"),
  icon: text("icon").notNull()
});
var insertLearningPathSchema = createInsertSchema(learningPaths).pick({
  title: true,
  description: true,
  imageUrl: true,
  level: true,
  category: true,
  totalModules: true,
  estimatedHours: true,
  primaryColor: true,
  icon: true
});
var modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  learningPathId: integer("learning_path_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull()
});
var insertModuleSchema = createInsertSchema(modules).pick({
  learningPathId: true,
  title: true,
  description: true,
  content: true,
  order: true,
  estimatedMinutes: true
});
var userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  learningPathId: integer("learning_path_id").notNull(),
  completedModules: integer("completed_modules").notNull().default(0),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  isCompleted: boolean("is_completed").default(false)
});
var insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  learningPathId: true,
  completedModules: true,
  isCompleted: true
});
var challenges = pgTable("challenges", {
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
  primaryColor: text("primary_color")
});
var insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  difficulty: true,
  category: true,
  tags: true,
  startDate: true,
  endDate: true,
  icon: true,
  primaryColor: true
});
var challengeSubmissions = pgTable("challenge_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  score: integer("score"),
  status: text("status").notNull().default("pending"),
  solution: text("solution").notNull()
});
var insertChallengeSubmissionSchema = createInsertSchema(challengeSubmissions).pick({
  userId: true,
  challengeId: true,
  score: true,
  status: true,
  solution: true
});
var leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  totalPoints: integer("total_points").notNull().default(0),
  challengesCompleted: integer("challenges_completed").notNull().default(0),
  medals: integer("medals").notNull().default(0),
  weeklyPoints: integer("weekly_points").notNull().default(0)
});
var insertLeaderboardSchema = createInsertSchema(leaderboard).pick({
  userId: true,
  totalPoints: true,
  challengesCompleted: true,
  medals: true,
  weeklyPoints: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const user = await storage.createUser(userData);
      await storage.createLeaderboardEntry({
        userId: user.id,
        totalPoints: 0,
        challengesCompleted: 0,
        medals: 0,
        weeklyPoints: 0
      });
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
  app2.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  app2.get("/api/learning-paths", async (_req, res) => {
    const learningPaths2 = await storage.getAllLearningPaths();
    res.json(learningPaths2);
  });
  app2.get("/api/learning-paths/:id", async (req, res) => {
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
  app2.post("/api/learning-paths", async (req, res) => {
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
  app2.put("/api/learning-paths/:id", async (req, res) => {
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
  app2.delete("/api/learning-paths/:id", async (req, res) => {
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
  app2.get("/api/learning-paths/:id/modules", async (req, res) => {
    const learningPathId = parseInt(req.params.id);
    if (isNaN(learningPathId)) {
      return res.status(400).json({ message: "Invalid learning path ID" });
    }
    const modules2 = await storage.getModulesByLearningPath(learningPathId);
    res.json(modules2);
  });
  app2.get("/api/modules/:id", async (req, res) => {
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
  app2.post("/api/modules", async (req, res) => {
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
  app2.get("/api/users/:userId/progress", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const progress = await storage.getAllUserProgress(userId);
    res.json(progress);
  });
  app2.get("/api/users/:userId/progress/:pathId", async (req, res) => {
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
  app2.post("/api/user-progress", async (req, res) => {
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
  app2.get("/api/challenges", async (_req, res) => {
    const challenges2 = await storage.getAllChallenges();
    res.json(challenges2);
  });
  app2.get("/api/challenges/:id", async (req, res) => {
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
  app2.post("/api/challenges", async (req, res) => {
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
  app2.post("/api/challenge-submissions", async (req, res) => {
    try {
      const submissionData = insertChallengeSubmissionSchema.parse(req.body);
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
  app2.get("/api/users/:userId/submissions", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const submissions = await storage.getChallengeSubmissionsByUser(userId);
    res.json(submissions);
  });
  app2.get("/api/challenges/:challengeId/submissions", async (req, res) => {
    const challengeId = parseInt(req.params.challengeId);
    if (isNaN(challengeId)) {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }
    const submissions = await storage.getChallengeSubmissionsByChallenge(challengeId);
    res.json(submissions);
  });
  app2.get("/api/leaderboard", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
    const leaderboard2 = await storage.getLeaderboard(limit);
    res.json(leaderboard2);
  });
  app2.get("/api/leaderboard/weekly", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
    const leaderboard2 = await storage.getWeeklyLeaderboard(limit);
    res.json(leaderboard2);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
