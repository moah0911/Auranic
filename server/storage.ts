import { 
  imageAnalyses, 
  users, 
  type ImageAnalysis, 
  type InsertImageAnalysis,
  type User, 
  type InsertUser 
} from "@shared/schema";
import { db, supabase } from "./db";
import { eq, desc } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// Hash password using scrypt
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Compare a supplied password to a stored hashed password
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Setup session store
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Image analysis methods
  getImageAnalysis(id: number): Promise<ImageAnalysis | undefined>;
  getImageAnalysisByImageId(imageId: string): Promise<ImageAnalysis | undefined>;
  createImageAnalysis(analysis: InsertImageAnalysis): Promise<ImageAnalysis>;
  getUserAnalyses(userId: number): Promise<ImageAnalysis[]>;
  getPublicAnalyses(limit?: number): Promise<ImageAnalysis[]>;
  
  // Auth utilities
  validateCredentials(username: string, password: string): Promise<User | null>;
  
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await hashPassword(insertUser.password);
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword
      })
      .returning();
    
    return user;
  }
  
  async validateCredentials(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const passwordsMatch = await comparePasswords(password, user.password);
    if (!passwordsMatch) return null;
    
    return user;
  }
  
  async getImageAnalysis(id: number): Promise<ImageAnalysis | undefined> {
    const [analysis] = await db.select().from(imageAnalyses).where(eq(imageAnalyses.id, id));
    return analysis;
  }
  
  async getImageAnalysisByImageId(imageId: string): Promise<ImageAnalysis | undefined> {
    const [analysis] = await db.select().from(imageAnalyses).where(eq(imageAnalyses.imageId, imageId));
    return analysis;
  }
  
  async createImageAnalysis(insertAnalysis: InsertImageAnalysis): Promise<ImageAnalysis> {
    const [analysis] = await db
      .insert(imageAnalyses)
      .values(insertAnalysis)
      .returning();
    
    return analysis;
  }
  
  async getUserAnalyses(userId: number): Promise<ImageAnalysis[]> {
    return db
      .select()
      .from(imageAnalyses)
      .where(eq(imageAnalyses.userId, userId))
      .orderBy(desc(imageAnalyses.createdAt));
  }
  
  async getPublicAnalyses(limit = 10): Promise<ImageAnalysis[]> {
    return db
      .select()
      .from(imageAnalyses)
      .where(eq(imageAnalyses.isPublic, true))
      .orderBy(desc(imageAnalyses.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
