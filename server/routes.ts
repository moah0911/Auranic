import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { randomUUID } from "crypto";
import { insertImageAnalysisSchema } from "@shared/schema";
import { storage } from "./storage";
import { analyzeImage } from "./lib/openai";
import { setupAuth } from "./auth";
import { syncSchema } from "./db";

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed.') as any);
    }
  }
});

// Authentication middleware
function isAuthenticated(req: Request, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // Sync database schema
  await syncSchema();
  
  // API endpoint for image analysis (authenticated users)
  app.post('/api/analyze', isAuthenticated, upload.single('image'), async (req, res) => {
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
        isPublic: false // Default to private
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

  // API endpoint for guest image analysis (no authentication required)
  app.post('/api/analyze/guest', upload.single('image'), async (req, res) => {
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
        createdAt: new Date()
      });
    } catch (error: any) {
      console.error('Error processing image:', error);
      return res.status(500).json({ 
        message: error.message || "Error processing image" 
      });
    }
  });

  // Get user's analysis history
  app.get('/api/analyses', isAuthenticated, async (req, res) => {
    try {
      const analyses = await storage.getUserAnalyses(req.user.id);
      return res.status(200).json(analyses);
    } catch (error: any) {
      console.error('Error fetching analyses:', error);
      return res.status(500).json({
        message: error.message || "Error fetching analyses"
      });
    }
  });

  // Toggle public/private status of an analysis
  app.post('/api/analyses/:id/toggle-public', isAuthenticated, async (req, res) => {
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

  // Get public analyses
  app.get('/api/analyses/public', async (req, res) => {
    try {
      // Get limit from query parameter, default to 10
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const analyses = await storage.getPublicAnalyses(limit);
      return res.status(200).json(analyses);
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
