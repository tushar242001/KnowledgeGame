import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using a lightweight schema to ensure we get valid JSON back
const questionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      text: { type: Type.STRING, description: "The trivia question text." },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of 4 possible answers.",
      },
      correctAnswerIndex: {
        type: Type.INTEGER,
        description: "The zero-based index of the correct answer in the options array.",
      },
      explanation: {
        type: Type.STRING,
        description: "A short, interesting fact explaining the answer.",
      },
    },
    required: ["text", "options", "correctAnswerIndex", "explanation"],
  },
};

export const generateQuestions = async (topic: string, count: number): Promise<Question[]> => {
  try {
    const model = "gemini-2.5-flash"; // Fast and capable for this task
    const prompt = `Generate ${count} engaging and challenging trivia questions about "${topic}". 
    Ensure the questions are diverse in difficulty but fair. 
    There must be exactly 4 options per question.
    The output must be a JSON array.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        systemInstruction: "You are a trivia master game show host. Generate fun, accurate, and concise trivia questions.",
      },
    });

    const data = JSON.parse(response.text || "[]");
    
    // Add unique IDs
    return data.map((q: any, index: number) => ({
      ...q,
      id: `q-${Date.now()}-${index}`,
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate questions. Please try again.");
  }
};