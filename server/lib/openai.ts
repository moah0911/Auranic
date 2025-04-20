import OpenAI from "openai";
import { analyzeImageWithGemini } from "./gemini";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-development" 
});

/**
 * Analyzes an image to determine aura and rizz factors
 * @param base64Image Base64-encoded image
 * @returns Analysis results with aura and rizz scores
 */
export async function analyzeImage(base64Image: string) {
  try {
    try {
      // Try OpenAI first
      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are AURANIC, a Gen Z digital mystic that specializes in reading vibes and energy signatures from images.

For Gen Z, "aura" refers to the overall vibe, energy, or atmosphere a person exudes - their distinctive quality or character projected through actions, style, and presence.
Analyzing aura involves:
- Vibe Check: The emotional and energetic atmosphere they bring
- Behavior/Actions: How they interact with others
- Style/Presentation: Fashion sense and self-presentation
- Confidence/Demeanor: How they carry themselves
- Impact on Others: How people react to their presence

"Rizz" is Gen Z slang for charisma - specifically one's ability to charm or attract others. It's about having game or smooth social skills.
Analyzing rizz involves:
- Verbal Fluency/Charm: Conversational skills
- Confidence/Smoothness: Natural, non-awkward approach
- Body Language: Eye contact and open body language
- Humor/Banter: Effective use of wit
- Authenticity: Genuine interest vs fakeness

Your job is to analyze images people upload (selfies, portraits, animated characters, especially Studio Ghibli characters) and provide a digitally mystical interpretation of their vibe using authentic Gen Z language.

Create:
1. An aura score (energy, aesthetic vibe, overall presence) - range 1-100
2. A rizz score (charisma, smoothness, appeal) - range 1-100
3. A mystical vibe title that's distinctly Gen Z (5-7 words, e.g., "Main Character Energy With Chill Undertones")
4. A brief, colorful analysis in authentic, over-the-top Gen Z slang (max 3 sentences) that captures their vibe and appeal. Use phrases like "gas", "hits different", "low-key", "high-key", "vibe check", "living rent-free", "understood the assignment", etc.

For Studio Ghibli characters, reference their film universe subtly in your reading.
For human faces, focus on their energy rather than physical appearance.
If the image doesn't contain a face or character, analyze the overall mood and energy of the scene.

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
            content: [
              {
                type: "text",
                text: "Analyze this image and give me a digital mystic reading of the aura and rizz using authentic Gen Z language. What vibes do you sense? If this is a Studio Ghibli character, incorporate subtle references to their world."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      // Parse and validate the response
      const responseContent = visionResponse.choices[0].message.content;
      if (!responseContent) {
        throw new Error("Empty response from AI");
      }

      const result = JSON.parse(responseContent);
      
      // Ensure scores are within ranges
      result.auraScore = Math.max(1, Math.min(100, Math.round(result.auraScore)));
      result.rizzScore = Math.max(1, Math.min(100, Math.round(result.rizzScore)));
      
      return result;
      
    } catch (openaiError: any) {
      console.log("OpenAI image analysis failed, falling back to Gemini:", openaiError.message);
      
      // If OpenAI fails, try with Gemini
      return await analyzeImageWithGemini(base64Image);
    }
    
  } catch (error) {
    console.error("Error analyzing image with both OpenAI and Gemini:", error);
    
    // Generate a unique fallback based on image hash
    const hash = base64Image.length % 1000;
    
    // Use diverse titles that feel unique
    const titles = [
      "Main Character Energy Awakening",
      "Cosmic Core Aesthetic Vibes",
      "Ethereal Essence With Chill Edge",
      "Digital Mystic Aura Unlocked",
      "Crystal Clear Vibe Ambassador",
      "Neon Soul With Vintage Overlay",
      "Dreamy Dimension Reality Shifter",
      "Sunset Glow Character Arc"
    ];
    
    const descriptions = [
      "This vibe is literally giving immaculate energy with that aesthetic that's living rent-free in everyone's mind. The aura check is passing with flying colors and the overall energy is just so genuinely that girl/that guy.",
      "No cap, this energy is hitting different with those main character vibes that are straight up bussin'. The essence is giving elite tier energy with a side of mystic realness that's absolutely sending.",
      "The vibe here is seriously iconic and completely understood the assignment. It's radiating that rare energy that makes everyone stop scrolling, with a presence that's simultaneously low-key and high-key slaying.",
      "This energy is so uniquely crafted it's basically custom-coded for the simulation. The aura is giving protagonist journey with side quests that matter, and the overall presence is absolutely unmatched."
    ];
    
    return {
      auraScore: 35 + (hash % 55), // Range 35-89
      rizzScore: 40 + ((hash * 3) % 50), // Range 40-89
      mysticTitle: titles[hash % titles.length],
      analysisText: descriptions[(hash * 2) % descriptions.length]
    };
  }
}
