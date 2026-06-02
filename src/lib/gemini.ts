import { GoogleGenAI } from "@google/genai";

declare const __GEMINI_API_KEY__: string;

/**
 * CLIENT SDK GEMINI KEY VARIABLE
 * =========================================================================
 * Put your Gemini API Key here to enable direct client-side execution.
 * This is ideal for standalone Android APK container runs where a local 
 * Node server is not executing on the device.
 * =========================================================================
 */
export const GEMINI_API_KEY_CLIENT = ""; 

/**
 * Returns true if direct client-side Gemini execution is supported
 * (either hardcoded, injected at build time, or saved in localStorage).
 */
export function hasDirectClientKey(): boolean {
  return !!(
    GEMINI_API_KEY_CLIENT ||
    (typeof __GEMINI_API_KEY__ !== "undefined" && __GEMINI_API_KEY__) ||
    ((import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    localStorage.getItem("GEMINI_API_KEY_CLIENT")
  );
}

/**
 * Runs a Gemini Chat completion directly on the client.
 * Perfect for mobile builds (Capacitor/Android) and standalone browser demos.
 */
export async function runClientSideChat(
  messages: { role: string; text: string }[],
  context: any
): Promise<string> {
  // Resolve key prioritizing:
  // 1. Hardcoded GEMINI_API_KEY_CLIENT variable above
  // 2. Vite define-injected build-time __GEMINI_API_KEY__ variable 
  // 3. import.meta.env.VITE_GEMINI_API_KEY from .env
  // 4. LocalStorage fallback 'GEMINI_API_KEY_CLIENT'
  let apiKey = GEMINI_API_KEY_CLIENT;

  if (!apiKey && typeof __GEMINI_API_KEY__ !== "undefined") {
    apiKey = __GEMINI_API_KEY__;
  }

  if (!apiKey) {
    apiKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY as string) || "";
  }

  if (!apiKey) {
    apiKey = localStorage.getItem("GEMINI_API_KEY_CLIENT") || "";
  }

  if (!apiKey || apiKey.trim() === "" || apiKey === "PASTE_YOUR_API_KEY_HERE") {
    throw new Error(
      "AeroBot Client-Side API Key is missing. To enable direct native Android AI features, please set the 'GEMINI_API_KEY_CLIENT' variable in '/src/lib/gemini.ts' with your Gemini API key."
    );
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Map role formats
  const formattedContents = messages.map((m: any) => ({
    role: m.role === "assistant" || m.role === "model" ? "model" : "user",
    parts: [{ text: m.text }]
  }));

  // Create a comprehensive prompt context injection
  const contextSummary = context ? 
    `USER SYSTEM STATE SNAPSHOT:\n${JSON.stringify(context, null, 2)}\n\n` : '';

  const systemInstruction = 
    `You are AeroBot, a helpful, friendly, and practical routine coach and productivity companion embedded inside AeroFlow Pro. \n` +
    `Your mission is to help users set up healthy daily habits (like getting natural morning sunlight), plan simple focused schedules, and connect their habits directly to who they want to be.\n\n` +
    `GUIDELINES:\n` +
    `- Be encouraging, practical, and highly human in weight and tone. Do NOT use heavy biological or academic terminology (avoid terms like "circadian cycles", "cortisol timing", "biomechanical systems", or "cellular clocks"). Speak in clean, simple, everyday language.\n` +
    `- Give direct, easy-to-read routine recommendations, simple tips, and helpful scheduling suggestions.\n` +
    `- Keep your answers engaging, formatted with clear markdown, bullet points, and neat typography.\n` +
    `- When the user asks general questions, frame them around positive habit building, realistic daily timelines, and proving their identity goals.\n\n` +
    contextSummary;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: formattedContents,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text || "I was unable to synthesize a response at this moment. Please try again.";
}
