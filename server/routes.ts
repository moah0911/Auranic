import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { randomUUID } from "crypto";
import { insertImageAnalysisSchema, insertSongAnalysisSchema, imageAnalyses, songAnalyses } from "@shared/schema";
import { storage } from "./storage";
import { analyzeImage } from "./lib/openai";
import { analyzeSong } from "./lib/song-analysis";
import { setupAuth } from "./auth";
import { syncSchema, db } from "./db";
import { eq } from "drizzle-orm";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req: any, file: any, cb: any) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed.'));
    }
  }
});

// Authentication middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Try to sync database schema, but continue even if it fails
  try {
    await syncSchema();
  } catch (error) {
    console.warn('Failed to sync database schema, but continuing startup:', error);
    console.warn('Some database operations may fail until a proper DATABASE_URL is configured.');
  }

  // API endpoint for image analysis (authenticated users)
  app.post('/api/analyze/image', isAuthenticated, upload.single('image'), async (req: any, res: Response) => {
    try {
      // Ensure file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Generate a unique ID for this analysis
      const imageId = randomUUID();

      // Convert file buffer to base64 for OpenAI Vision API
      const base64Image = req.file.buffer.toString('base64');

      // Analyze the image using OpenAI Vision API
      const analysis = await analyzeImage(base64Image);

      // Create the analysis record
      const analysisData = {
        imageId,
        userId: req.user.id, // Link analysis to user
        auraScore: analysis.auraScore,
        rizzScore: analysis.rizzScore,
        mysticTitle: analysis.mysticTitle,
        analysisText: analysis.analysisText,
        isPublic: false, // Default to private
        contentType: "image"
      };

      // Validate data
      const validatedData = insertImageAnalysisSchema.parse(analysisData);

      // Save to database
      const savedAnalysis = await storage.createImageAnalysis(validatedData);

      return res.status(200).json(savedAnalysis);
    } catch (error: any) {
      console.error('Error processing image:', error);
      return res.status(500).json({
        message: error.message || "Error processing image"
      });
    }
  });

  // API endpoint for song analysis (authenticated users)
  app.post('/api/analyze/song', isAuthenticated, async (req: any, res: Response) => {
    try {
      // Ensure song name was provided
      const { songName } = req.body;
      if (!songName) {
        return res.status(400).json({ message: "No song name provided" });
      }

      // Generate a unique ID for this analysis
      const songId = randomUUID();

      // Analyze the song name using OpenAI API
      const analysis = await analyzeSong(songName);

      // Create the analysis record
      const analysisData = {
        songId,
        songName,
        userId: req.user.id, // Link analysis to user
        auraScore: analysis.auraScore,
        rizzScore: analysis.rizzScore,
        mysticTitle: analysis.mysticTitle,
        analysisText: analysis.analysisText,
        isPublic: false, // Default to private
        contentType: "song"
      };

      // Validate data
      const validatedData = insertSongAnalysisSchema.parse(analysisData);

      // Save to database
      const savedAnalysis = await storage.createSongAnalysis(validatedData);

      return res.status(200).json(savedAnalysis);
    } catch (error: any) {
      console.error('Error processing song:', error);
      return res.status(500).json({
        message: error.message || "Error processing song"
      });
    }
  });

  // API endpoint for guest image analysis (no authentication required)
  app.post('/api/analyze/image/guest', upload.single('image'), async (req: any, res: Response) => {
    try {
      // Ensure file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Generate a unique ID for this analysis
      const imageId = randomUUID();

      // Convert file buffer to base64 for OpenAI Vision API
      const base64Image = req.file.buffer.toString('base64');

      // Analyze the image using OpenAI Vision API
      const analysis = await analyzeImage(base64Image);

      // For guest analysis, we don't need to store it in the database
      // Just return the results directly
      return res.status(200).json({
        imageId,
        auraScore: analysis.auraScore,
        rizzScore: analysis.rizzScore,
        mysticTitle: analysis.mysticTitle,
        analysisText: analysis.analysisText,
        contentType: "image",
        createdAt: new Date()
      });
    } catch (error: any) {
      console.error('Error processing image:', error);
      return res.status(500).json({
        message: error.message || "Error processing image"
      });
    }
  });

  // API endpoint for guest song analysis (no authentication required)
  app.post('/api/analyze/song/guest', async (req, res) => {
    try {
      // Ensure song name was provided
      const { songName } = req.body;
      if (!songName) {
        return res.status(400).json({ message: "No song name provided" });
      }

      // Generate a unique ID for this analysis
      const songId = randomUUID();

      // Analyze the song name using OpenAI API
      const analysis = await analyzeSong(songName);

      // For guest analysis, we don't need to store it in the database
      // Just return the results directly
      return res.status(200).json({
        songId,
        songName,
        auraScore: analysis.auraScore,
        rizzScore: analysis.rizzScore,
        mysticTitle: analysis.mysticTitle,
        analysisText: analysis.analysisText,
        contentType: "song",
        createdAt: new Date()
      });
    } catch (error: any) {
      console.error('Error processing song:', error);
      return res.status(500).json({
        message: error.message || "Error processing song"
      });
    }
  });

  // Get user's analysis history (includes both image and song analyses)
  app.get('/api/analyses', isAuthenticated, async (req: any, res: Response) => {
    try {
      const imageAnalyses = await storage.getUserImageAnalyses(req.user.id);
      const songAnalyses = await storage.getUserSongAnalyses(req.user.id);

      // Combine and sort by createdAt (newest first)
      const allAnalyses = [...imageAnalyses, ...songAnalyses].sort((a, b) =>
        b.createdAt.getTime() - a.createdAt.getTime()
      );

      return res.status(200).json(allAnalyses);
    } catch (error: any) {
      console.error('Error fetching analyses:', error);
      return res.status(500).json({
        message: error.message || "Error fetching analyses"
      });
    }
  });

  // Toggle public/private status of an image analysis
  app.post('/api/analyses/image/:id/toggle-public', isAuthenticated, async (req: any, res: Response) => {
    try {
      const analysisId = parseInt(req.params.id);
      const analysis = await storage.getImageAnalysis(analysisId);

      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      if (analysis.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Toggle isPublic status
      const updatedAnalysis = await db
        .update(imageAnalyses)
        .set({ isPublic: !analysis.isPublic })
        .where(eq(imageAnalyses.id, analysisId))
        .returning()
        .then(rows => rows[0]);

      return res.status(200).json(updatedAnalysis);
    } catch (error: any) {
      console.error('Error toggling public status:', error);
      return res.status(500).json({
        message: error.message || "Error updating analysis"
      });
    }
  });

  // Toggle public/private status of a song analysis
  app.post('/api/analyses/song/:id/toggle-public', isAuthenticated, async (req: any, res: Response) => {
    try {
      const analysisId = parseInt(req.params.id);
      const analysis = await storage.getSongAnalysis(analysisId);

      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      if (analysis.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Toggle isPublic status
      const updatedAnalysis = await db
        .update(songAnalyses)
        .set({ isPublic: !analysis.isPublic })
        .where(eq(songAnalyses.id, analysisId))
        .returning()
        .then(rows => rows[0]);

      return res.status(200).json(updatedAnalysis);
    } catch (error: any) {
      console.error('Error toggling public status:', error);
      return res.status(500).json({
        message: error.message || "Error updating analysis"
      });
    }
  });

  // Get public analyses (includes both image and song analyses)
  app.get('/api/analyses/public', async (req, res) => {
    try {
      // Get limit from query parameter, default to 10
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const imageAnalyses = await storage.getPublicImageAnalyses(limit);
      const songAnalyses = await storage.getPublicSongAnalyses(limit);

      // Combine and sort by createdAt (newest first)
      const allAnalyses = [...imageAnalyses, ...songAnalyses].sort((a, b) =>
        b.createdAt.getTime() - a.createdAt.getTime()
      ).slice(0, limit);

      return res.status(200).json(allAnalyses);
    } catch (error: any) {
      console.error('Error fetching public analyses:', error);
      return res.status(500).json({
        message: error.message || "Error fetching public analyses"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
