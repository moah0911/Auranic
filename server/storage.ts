import { 
  imageAnalyses, 
  songAnalyses,
  users, 
  type ImageAnalysis, 
  type InsertImageAnalysis,
  type SongAnalysis,
  type InsertSongAnalysis,
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
  getUserImageAnalyses(userId: number): Promise<ImageAnalysis[]>;
  getPublicImageAnalyses(limit?: number): Promise<ImageAnalysis[]>;
  
  // Song analysis methods
  getSongAnalysis(id: number): Promise<SongAnalysis | undefined>;
  getSongAnalysisBySongId(songId: string): Promise<SongAnalysis | undefined>;
  createSongAnalysis(analysis: InsertSongAnalysis): Promise<SongAnalysis>;
  getUserSongAnalyses(userId: number): Promise<SongAnalysis[]>;
  getPublicSongAnalyses(limit?: number): Promise<SongAnalysis[]>;
  
  // Combined methods (for backward compatibility)
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

  // USER METHODS
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
  
  // IMAGE ANALYSIS METHODS
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
  
  async getUserImageAnalyses(userId: number): Promise<ImageAnalysis[]> {
    return db
      .select()
      .from(imageAnalyses)
      .where(eq(imageAnalyses.userId, userId))
      .orderBy(desc(imageAnalyses.createdAt));
  }
  
  async getPublicImageAnalyses(limit = 10): Promise<ImageAnalysis[]> {
    return db
      .select()
      .from(imageAnalyses)
      .where(eq(imageAnalyses.isPublic, true))
      .orderBy(desc(imageAnalyses.createdAt))
      .limit(limit);
  }
  
  // SONG ANALYSIS METHODS
  async getSongAnalysis(id: number): Promise<SongAnalysis | undefined> {
    const [analysis] = await db.select().from(songAnalyses).where(eq(songAnalyses.id, id));
    return analysis;
  }
  
  async getSongAnalysisBySongId(songId: string): Promise<SongAnalysis | undefined> {
    const [analysis] = await db.select().from(songAnalyses).where(eq(songAnalyses.songId, songId));
    return analysis;
  }
  
  async createSongAnalysis(insertAnalysis: InsertSongAnalysis): Promise<SongAnalysis> {
    const [analysis] = await db
      .insert(songAnalyses)
      .values(insertAnalysis)
      .returning();
    
    return analysis;
  }
  
  async getUserSongAnalyses(userId: number): Promise<SongAnalysis[]> {
    return db
      .select()
      .from(songAnalyses)
      .where(eq(songAnalyses.userId, userId))
      .orderBy(desc(songAnalyses.createdAt));
  }
  
  async getPublicSongAnalyses(limit = 10): Promise<SongAnalysis[]> {
    return db
      .select()
      .from(songAnalyses)
      .where(eq(songAnalyses.isPublic, true))
      .orderBy(desc(songAnalyses.createdAt))
      .limit(limit);
  }
  
  // COMBINED METHODS (for backward compatibility)
  async getUserAnalyses(userId: number): Promise<ImageAnalysis[]> {
    // This is a legacy method that now only returns image analyses
    // Use getUserImageAnalyses and getUserSongAnalyses separately for both types
    return this.getUserImageAnalyses(userId);
  }
  
  async getPublicAnalyses(limit = 10): Promise<ImageAnalysis[]> {
    // This is a legacy method that now only returns image analyses
    // Use getPublicImageAnalyses and getPublicSongAnalyses separately for both types
    return this.getPublicImageAnalyses(limit);
  }
}

export const storage = new DatabaseStorage();
