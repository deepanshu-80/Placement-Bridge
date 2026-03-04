import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Basic auth setup (since user requested login/register pages)
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.use(session({
    secret: process.env.SESSION_SECRET || 'super-secret',
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (username, password, done) => {
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return done(null, false, { message: "Invalid credentials" });
    }
    return done(null, user);
  }));

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  // Auth Routes
  app.get(api.users.me.path, (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    res.json(req.user);
  });

  app.post(api.users.register.path, async (req, res) => {
    try {
      const input = api.users.register.input.parse(req.body);
      const existing = await storage.getUserByUsername(input.username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(input);
      req.login(user, (err) => {
        if (err) throw err;
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.post(api.users.login.path, passport.authenticate('local'), (req, res) => {
    res.json(req.user);
  });

  app.post(api.users.logout.path, (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Error logging out" });
      res.json({ message: "Logged out" });
    });
  });

  // Jobs Routes
  app.get(api.jobs.list.path, async (req, res) => {
    const jobs = await storage.getJobs();
    res.json(jobs);
  });

  app.get(api.jobs.get.path, async (req, res) => {
    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  });

  app.post(api.jobs.create.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'employer') {
      return res.status(403).json({ message: "Only employers can create jobs" });
    }
    try {
      const input = api.jobs.create.input.parse(req.body);
      const job = await storage.createJob({ ...input, employerId: (req.user as any).id });
      res.status(201).json(job);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal error" });
    }
  });

  // Applications Routes
  app.get(api.applications.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    const user = req.user as any;
    let apps;
    if (user.role === 'student') {
      apps = await storage.getApplicationsForStudent(user.id);
    } else {
      apps = await storage.getApplicationsForEmployer(user.id);
    }
    res.json(apps);
  });

  app.post(api.applications.create.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'student') {
      return res.status(403).json({ message: "Only students can apply" });
    }
    try {
      const input = api.applications.create.input.parse(req.body);
      const app = await storage.createApplication({ jobId: input.jobId, studentId: (req.user as any).id });
      res.status(201).json(app);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.patch(api.applications.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'employer') {
      return res.status(403).json({ message: "Only employers can update status" });
    }
    try {
      const input = api.applications.updateStatus.input.parse(req.body);
      const app = await storage.updateApplicationStatus(Number(req.params.id), input.status);
      if (!app) return res.status(404).json({ message: "Application not found" });
      res.json(app);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal error" });
    }
  });

  // Q&A Routes
  app.get(api.qa.list.path, async (req, res) => {
    const questions = await storage.getQuestions();
    res.json(questions);
  });

  app.post(api.qa.createQuestion.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    const user = req.user as any;
    const input = api.qa.createQuestion.input.parse(req.body);
    const q = await storage.createQuestion({ ...input, authorId: user.id });
    res.status(201).json(q);
  });

  app.post(api.qa.createAnswer.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    const user = req.user as any;
    const input = api.qa.createAnswer.input.parse(req.body);
    const a = await storage.createAnswer({ ...input, authorId: user.id });
    res.status(201).json(a);
  });

  // Resources Routes
  app.get(api.resources.list.path, async (req, res) => {
    const resources = await storage.getResources();
    res.json(resources);
  });

  app.post(api.resources.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    const user = req.user as any;
    const input = api.resources.create.input.parse(req.body);
    const r = await storage.createResource({ ...input, authorId: user.id });
    res.status(201).json(r);
  });

  // Admin Routes
  app.get(api.admin.listPendingVerifications.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }
    const verifications = await storage.getPendingVerifications();
    res.json(verifications);
  });

  app.post(api.admin.approveVerification.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }
    await storage.approveVerification(Number(req.params.id));
    res.json({ success: true });
  });

  return httpServer;
}
