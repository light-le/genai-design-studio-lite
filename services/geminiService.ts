import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

// Initialize the client safely
const getClient = () => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const proofreadText = async (text: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return text;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Proofread and improve the following text for clarity and grammar. Return ONLY the corrected text, no explanations or quotes:\n\n"${text}"`,
    });
    
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to original text if AI fails
    return text;
  }
};
