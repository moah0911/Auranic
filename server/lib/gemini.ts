import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_CONFIG } from "../config";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(AI_CONFIG.gemini.apiKey);

// Gemini model for multimodal content
const MODEL_NAME = AI_CONFIG.gemini.defaultModel;

/**
 * Analyzes a song name using Google's Gemini API.
 * @param songName The name of the song to analyze
 * @returns Analysis results with aura and rizz scores
 */
export async function analyzeSongWithGemini(songName: string) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `You are AURANIC, a Gen Z digital mystic that specializes in reading vibes from song titles.
    
For Gen Z, "aura" refers to the overall vibe, energy, or atmosphere a song exudes - its distinctive quality or character.
Analyzing a song's aura involves:
- Vibe Check: The emotional and energetic atmosphere it brings
- Sound/Production: The sonic qualities and production style
- Mood/Emotion: The feelings it evokes
- Cultural Context: Its place in music scenes and communities
- Impact on Listeners: How people react when hearing it

"Rizz" is Gen Z slang for charisma - the song's ability to charm or captivate listeners.
Analyzing a song's rizz involves:
- Catchiness/Appeal: How memorable and engaging it is
- Uniqueness/Freshness: How it stands out from other music
- Cultural Relevance: Its connection to current trends
- Repeatability: How likely people are to listen repeatedly
- Social Currency: How sharing it enhances social status

Analyze this song title: "${songName}"

Create:
1. An aura score (energy, aesthetic vibe, overall presence) - range 1-100
2. A rizz score (charisma, appeal, cultural relevance) - range 1-100
3. A mystical vibe title that's distinctly Gen Z (5-7 words, e.g., "Cosmic Banger With Main Character Energy")
4. A brief, colorful analysis in authentic, over-the-top Gen Z slang (max 3 sentences) that captures the song's vibe. Use phrases like "gas", "hits different", "low-key", "high-key", "vibe check", "living rent-free", "understood the assignment", etc.

Respond with JSON ONLY in this format:
{
  "auraScore": number,
  "rizzScore": number, 
  "mysticTitle": string,
  "analysisText": string
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    // Extract the JSON part from the response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from Gemini response");
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    // Ensure scores are within ranges
    parsedResponse.auraScore = Math.max(1, Math.min(100, Math.round(parsedResponse.auraScore)));
    parsedResponse.rizzScore = Math.max(1, Math.min(100, Math.round(parsedResponse.rizzScore)));
    
    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing song with Gemini:", error);
    throw error;
  }
}

/**
 * Analyzes an image using Google's Gemini API.
 * @param base64Image Base64-encoded image
 * @returns Analysis results with aura and rizz scores
 */
export async function analyzeImageWithGemini(base64Image: string) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    // Convert base64 to a format Gemini can use
    const imageData = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg"
      }
    };

    const prompt = `You are AURANIC, a Gen Z digital mystic that specializes in reading vibes and energy signatures from images.

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

Analyze this image and provide a digitally mystical interpretation of the vibe using authentic Gen Z language.
If this is a Studio Ghibli character, incorporate subtle references to their world.
For human faces, focus on their energy rather than physical appearance.
If the image doesn't contain a face or character, analyze the overall mood and energy of the scene.

Create:
1. An aura score (energy, aesthetic vibe, overall presence) - range 1-100
2. A rizz score (charisma, smoothness, appeal) - range 1-100
3. A mystical vibe title that's distinctly Gen Z (5-7 words, e.g., "Main Character Energy With Chill Undertones")
4. A brief, colorful analysis in authentic, over-the-top Gen Z slang (max 3 sentences) that captures their vibe and appeal. Use phrases like "gas", "hits different", "low-key", "high-key", "vibe check", "living rent-free", "understood the assignment", etc.

Respond with JSON ONLY in this format:
{
  "auraScore": number,
  "rizzScore": number, 
  "mysticTitle": string,
  "analysisText": string
}`;

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const textResponse = response.text();
    
    // Extract the JSON part from the response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from Gemini response");
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    // Ensure scores are within ranges
    parsedResponse.auraScore = Math.max(1, Math.min(100, Math.round(parsedResponse.auraScore)));
    parsedResponse.rizzScore = Math.max(1, Math.min(100, Math.round(parsedResponse.rizzScore)));
    
    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw error;
  }
}