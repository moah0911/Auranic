import OpenAI from "openai";

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

    // Call the OpenAI API
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
  } catch (error) {
    console.error("Error analyzing song:", error);
    // Return default values if analysis fails
    return {
      mysticTitle: "Enigmatic Resonance",
      auraScore: 50,
      rizzScore: 50,
      analysisText: "This track has mysterious vibes that couldn't be fully decoded. The energy patterns are complex but intriguing."
    };
  }
}