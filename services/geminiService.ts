import { GoogleGenAI } from "@google/genai";
import { DailyEntry } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const STRICT_SYSTEM_INSTRUCTION = `
You are the kernel of the "IronWill OS". Your role is to analyze the user's daily data with extreme strictness.
Tone: Factual, Blunt, Cold, Analytical. NO MOTIVATION. NO INSPIRATION.
Focus: Evidence, Consistency, Discipline, Pattern Recognition.
If the user is weak, tell them. If they performed well, acknowledge stats only.
`;

export const analyzeDailyLog = async (entry: DailyEntry): Promise<{
  feedback: string;
  directives: string[];
  learning: string;
  todaysDirection: string;
  pressure: 'LOW' | 'MEDIUM' | 'HIGH';
}> => {
  if (!process.env.API_KEY) {
    return {
      feedback: "AI Key missing. Analysis unavailable.",
      directives: ["Fix API Key", "Track manually", "No excuses"],
      learning: "Read documentation.",
      todaysDirection: "Configuration Required.",
      pressure: "LOW"
    };
  }

  const prompt = `
    Analyze this daily log:
    Date: ${entry.date}
    Namaz: ${entry.namaz}/5
    Study: ${entry.studyMinutes} min
    Exercise: ${entry.exercise}
    Screen Time: ${entry.screenTimeMinutes} min (IG: ${entry.instagramMinutes}, YT: ${entry.youtubeMinutes})
    Creation vs Consumption: ${entry.minutesCreated} / ${entry.minutesConsumed}
    Deep Thought: ${entry.deepThought}
    Excuse: ${entry.internalExcuse}
    Decisions: Good (${entry.goodDecision}), Bad (${entry.badDecision} - cost: ${entry.badDecisionCost})
    
    Tasks:
    1. Identify discipline gaps and time theft.
    2. Provide 3 strict improvement points for tomorrow.
    3. Suggest 1 learning resource (topic only).
    4. Generate "Today's Direction" (1 sentence, action-oriented, no quotes).
    5. Determine Pressure Level (LOW/MEDIUM/HIGH) based on performance (Poor performance = HIGH pressure to correct).
    
    Output JSON format:
    {
      "feedback": "string (max 50 words)",
      "directives": ["string", "string", "string"],
      "learning": "string",
      "todaysDirection": "string",
      "pressure": "LOW" | "MEDIUM" | "HIGH"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: STRICT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Analysis Failed", error);
    return {
      feedback: "Analysis failed due to network.",
      directives: ["Resume protocol", "Check connection", "Stay focused"],
      learning: "None",
      todaysDirection: "Maintain course.",
      pressure: "MEDIUM"
    };
  }
};

export const analyzeIdentity = async (base64Image: string, entryContext: Partial<DailyEntry>): Promise<{
  match: boolean;
  observations: string;
}> => {
  if (!process.env.API_KEY) return { match: true, observations: "AI Offline" };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
          { text: `
            Look at this face. Compare it to a standard of high discipline and alertness.
            Context: The user claims to want to become a top 1% performer.
            Does this face show fatigue, weakness, or softness? Or focus and strength?
            Be extremely blunt.
            
            Return JSON:
            {
              "match": boolean (true if looks disciplined),
              "observations": "string (max 20 words, blunt)"
            }
          `}
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Identity Analysis Failed", error);
    return { match: false, observations: "Could not verify identity." };
  }
};