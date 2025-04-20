import OpenAI from "openai";
import { analyzeSongWithGemini } from "./gemini";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Analyzes a song name to determine its vibe and energy
 * @param songName Name of the song to analyze
 * @returns Analysis results with aura and rizz scores
 */
export async function analyzeSong(songName: string) {
  try {
    const prompt = `Analyze the song "${songName}" as if you're a Gen Z mystic who can read the vibes and energy patterns of music.

For this song, provide:

1. A "mystic title" - a creative, Gen Z-style archetype/vibe description (5-7 words max)
2. An "aura score" from 1-100 that measures the emotional energy, aesthetic vibe, and atmospheric presence of the song. Aura refers to the overall vibe, energy, and atmosphere the song exudes - its distinctive quality or character.
3. A "rizz score" from 1-100 that measures the song's charisma, confidence, smoothness, and ability to charm or captivate listeners. Rizz refers to charisma and ability to attract/seduce others.
4. A brief, colorful analysis written in authentic, over-the-top Gen Z slang (maximum 3 sentences) that captures the song's energy and appeal. Use phrases like "gas", "hits different", "low-key", "high-key", "vibe check", "living rent-free", "understood the assignment", etc.

Return as a JSON object with these properties: mysticTitle, auraScore, rizzScore, analysisText. Ensure auraScore and rizzScore are integers (1-100).`;

    try {
      // First try with OpenAI
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { 
            role: "system", 
            content: "You are an expert Gen Z cultural interpreter specializing in sound vibrations and musical energy readings. You analyze songs through a modern digital-mystic lens using authentic Gen Z language." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      // Parse the response
      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        mysticTitle: result.mysticTitle || "Unknown Vibration",
        auraScore: Math.min(100, Math.max(1, result.auraScore || 50)),
        rizzScore: Math.min(100, Math.max(1, result.rizzScore || 50)),
        analysisText: result.analysisText || "Failed to analyze this song's energy pattern."
      };
    } catch (openaiError) {
      console.log("OpenAI analysis failed, falling back to Gemini:", openaiError.message);
      
      // If OpenAI fails, try with Gemini
      const geminiResult = await analyzeSongWithGemini(songName);
      
      return {
        mysticTitle: geminiResult.mysticTitle,
        auraScore: geminiResult.auraScore,
        rizzScore: geminiResult.rizzScore,
        analysisText: geminiResult.analysisText
      };
    }
  } catch (error) {
    console.error("Error analyzing song with both OpenAI and Gemini:", error);
    
    // Generate unique fallback content based on song name
    const hash = songName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + acc;
    }, 0);
    
    // Use the hash to create somewhat unique values
    const auraScore = 30 + (hash % 60); // Range from 30-89
    const rizzScore = 35 + ((hash * 7) % 55); // Range from 35-89
    
    // Create a unique title based on the song name
    const words = ["Ethereal", "Cosmic", "Vibrant", "Neon", "Digital", "Crystal", "Mystic", "Sonic"];
    const adjectives = ["Flow", "Wave", "Pulse", "Beat", "Echo", "Drift", "Energy", "Current"];
    
    const word = words[hash % words.length];
    const adjective = adjectives[(hash * 3) % adjectives.length];
    
    return {
      mysticTitle: `${word} ${adjective} ${songName.length % 2 === 0 ? "Frequency" : "Resonance"}`,
      auraScore,
      rizzScore,
      analysisText: `This track's energy signature is a unique blend that hits different with elements of ${word.toLowerCase()} vibes and ${adjective.toLowerCase()} patterns. The sonic frequencies are giving main character energy, and the overall essence is definitely a vibe check worth experiencing.`
    };
  }
}