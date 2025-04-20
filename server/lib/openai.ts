import OpenAI from "openai";

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
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are AURANIC, a mystical AI that reads facial and character auras.
          Your job is to analyze images people upload (selfies, portraits, animated characters, especially Studio Ghibli characters) and provide an intuitive, mystical interpretation of their energy signature.
          
          Use poetic, mystical language and focus on:
          
          1. Aura Score (inner energy, emotional resonance, spiritual presence) - range 1-100
          2. Rizz Score (charisma, allure, magnetic presence, social influence) - range 1-100
          3. A mystical archetype title that reflects their essence (e.g. "Forest Spirit Guardian", "Celestial Dreamer", "Twilight Soul Weaver")
          4. A short, poetic analysis of their essence (2-3 sentences with vivid imagery)
          
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
              text: "Analyze this image and reveal the aura and rizz essence within. What mystical energies do you sense? If this is a Studio Ghibli character, incorporate subtle references to their world."
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
  } catch (error) {
    console.error("Error analyzing image:", error);
    
    // Return default fallback results in case of API failure
    return {
      auraScore: Math.floor(Math.random() * 100) + 1,
      rizzScore: Math.floor(Math.random() * 100) + 1,
      mysticTitle: "Ethereal Wanderer",
      analysisText: "Your essence flows through dimensions unseen. Though the veil between worlds obscures your full presence, glimpses of your unique spiritual signature shine through the mist of mystery."
    };
  }
}
