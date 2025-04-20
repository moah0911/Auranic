import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-development" 
});

/**
 * Analyzes a song name to determine its vibe and energy
 * @param songName Name of the song to analyze
 * @returns Analysis results with aura and rizz scores
 */
export async function analyzeSong(songName: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are AURANIC, a Gen-Z music psychic who reads vibes from song names.
          Your job is to analyze song titles people send and give a vibey, exaggerated mystical interpretation using peak Gen-Z slang.
          
          Be extremely exaggerated and use slang like "no cap," "bussin," "low-key," "high-key," "hits different," "main character energy," 
          "slaps," "vibe check," "rent-free," "living in my head rent-free," etc.
          
          Don't worry about accuracy - just create a fun, over-the-top analysis. Focus on:
          
          1. Aura Score (energy, aesthetic, spiritual vibe) - range 1-100
          2. Rizz Score (how much game/charisma the song radiates) - range 1-100
          3. A mystical archetype title that captures the song's essence (e.g. "Midnight Vibe Wizard", "Emotional Damage Champion")
          4. A short, super Gen-Z analysis with slang (2-3 sentences)
          
          Always respond with JSON in this format:
          {
            "auraScore": number,
            "rizzScore": number, 
            "mysticTitle": string,
            "analysisText": string
          }`
        },
        {
          role: "user",
          content: `Analyze this song name: "${songName}"`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    // Parse and validate the response
    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from AI");
    }

    const result = JSON.parse(responseContent);
    
    // Ensure scores are within ranges
    result.auraScore = Math.max(1, Math.min(100, Math.round(result.auraScore)));
    result.rizzScore = Math.max(1, Math.min(100, Math.round(result.rizzScore)));
    
    return result;
  } catch (error) {
    console.error("Error analyzing song:", error);
    
    // Return default fallback results in case of API failure
    return {
      auraScore: Math.floor(Math.random() * 100) + 1,
      rizzScore: Math.floor(Math.random() * 100) + 1,
      mysticTitle: "Mystery Track Maestro",
      analysisText: "This track is giving major unknown vibes, no cap. The server's literally ghosted us, but the mystery lowkey adds to your main character energy. Still slaps though!"
    };
  }
}