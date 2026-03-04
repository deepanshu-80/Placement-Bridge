import { db } from "./db";
import { 
  users, jobs, applications, questions, answers, resources,
  type User, type InsertUser,
  type Job, type InsertJob,
  type Application, type InsertApplication,
  type JobResponse, type ApplicationResponse
} from "@shared/schema";
import { eq, inArray } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Jobs
  getJobs(): Promise<JobResponse[]>;
  getJob(id: number): Promise<JobResponse | undefined>;
  getJobsByEmployer(employerId: number): Promise<JobResponse[]>;
  createJob(job: InsertJob): Promise<Job>;

  // Applications
  getApplicationsForStudent(studentId: number): Promise<ApplicationResponse[]>;
  getApplicationsForEmployer(employerId: number): Promise<ApplicationResponse[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;

  // Q&A
  getQuestions(): Promise<any[]>;
  createQuestion(q: any): Promise<any>;
  createAnswer(a: any): Promise<any>;

  // Resources
  getResources(): Promise<any[]>;
  createResource(r: any): Promise<any>;

  // Admin
  getPendingVerifications(): Promise<any[]>;
  approveVerification(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Jobs
  async getJobs(): Promise<JobResponse[]> {
    const rows = await db.query.jobs.findMany({
      with: {
        employer: true,
      },
      orderBy: (jobs, { desc }) => [desc(jobs.postedAt)]
    });
    return rows as JobResponse[];
  }

  async getJob(id: number): Promise<JobResponse | undefined> {
    const job = await db.query.jobs.findFirst({
      where: eq(jobs.id, id),
      with: {
        employer: true,
      }
    });
    return job as JobResponse | undefined;
  }

  async getJobsByEmployer(employerId: number): Promise<JobResponse[]> {
    const rows = await db.query.jobs.findMany({
      where: eq(jobs.employerId, employerId),
      with: {
        employer: true,
      },
      orderBy: (jobs, { desc }) => [desc(jobs.postedAt)]
    });
    return rows as JobResponse[];
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }

  // Applications
  async getApplicationsForStudent(studentId: number): Promise<ApplicationResponse[]> {
    const rows = await db.query.applications.findMany({
      where: eq(applications.studentId, studentId),
      with: {
        job: {
          with: {
            employer: true
          }
        },
      },
      orderBy: (applications, { desc }) => [desc(applications.appliedAt)]
    });
    return rows as ApplicationResponse[];
  }

  async getApplicationsForEmployer(employerId: number): Promise<ApplicationResponse[]> {
    const employersJobs = await db.select({ id: jobs.id }).from(jobs).where(eq(jobs.employerId, employerId));
    const jobIds = employersJobs.map(j => j.id);

    if (jobIds.length === 0) return [];

    const rows = await db.query.applications.findMany({
      where: inArray(applications.jobId, jobIds),
      with: {
        job: true,
        student: true,
      },
      orderBy: (applications, { desc }) => [desc(applications.appliedAt)]
    });
    return rows as ApplicationResponse[];
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db.insert(applications).values(insertApplication).returning();
    return application;
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const [application] = await db.update(applications)
      .set({ status })
      .where(eq(applications.id, id))
      .returning();
    return application;
  }

  // Q&A
  async getQuestions(): Promise<any[]> {
    return await db.query.questions.findMany({
      with: {
        author: true,
        answers: {
          with: {
            author: true
          }
        }
      },
      orderBy: (q, { desc }) => [desc(q.createdAt)]
    });
  }

  async createQuestion(q: any): Promise<any> {
    const [res] = await db.insert(questions).values(q).returning();
    return res;
  }

  async createAnswer(a: any): Promise<any> {
    const [res] = await db.insert(answers).values(a).returning();
    return res;
  }

  // Resources
  async getResources(): Promise<any[]> {
    return await db.query.resources.findMany({
      with: { author: true },
      orderBy: (r, { desc }) => [desc(r.createdAt)]
    });
  }

  async createResource(r: any): Promise<any> {
    const [res] = await db.insert(resources).values(r).returning();
    return res;
  }

  async getPendingVerifications(): Promise<any[]> {
    return await db.query.verificationRequests.findMany({
      where: eq(verificationRequests.status, 'pending'),
      with: {
        user: true
      }
    });
  }

  async approveVerification(id: number): Promise<void> {
    const [req] = await db.select().from(verificationRequests).where(eq(verificationRequests.id, id));
    if (req) {
      await db.update(verificationRequests).set({ status: 'approved' }).where(eq(verificationRequests.id, id));
      await db.update(users).set({ isVerified: true }).where(eq(users.id, req.userId));
    }
  }
}

export const storage = new DatabaseStorage();
