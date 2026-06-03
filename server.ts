import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import AdmZip from "adm-zip";

// Create lazy loaded Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY2 || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY2 or GEMINI_API_KEY environment variable is not set. Please add it via Settings > Secrets.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON bodies
  app.use(express.json());

  // Serve zip download API
  app.get("/api/download-zip", (req, res) => {
    try {
      console.log("Generating zip of workspace...");
      const zip = new AdmZip();
      const rootDir = process.cwd();
      
      const addDirectoryToZip = (currentDir: string, relativePath: string = '') => {
        const items = fs.readdirSync(currentDir);
        for (const item of items) {
          const fullPath = path.join(currentDir, item);
          const itemRelativePath = relativePath ? relativePath + '/' + item : item;
          
          // Ignore heavy compile/package folders
          if (
            item === 'node_modules' ||
            item === 'dist' ||
            item === '.git' ||
            item === '.gradle' ||
            item === 'build' ||
            item === '.idea' ||
            item === '.DS_Store' ||
            item === 'bin' ||
            item === 'obj'
          ) {
            continue;
          }
          
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            addDirectoryToZip(fullPath, itemRelativePath);
          } else {
            zip.addFile(itemRelativePath.replace(/\\/g, '/'), fs.readFileSync(fullPath));
          }
        }
      };

      addDirectoryToZip(rootDir);
      
      const zipBuffer = zip.toBuffer();
      
      res.setHeader("Content-Disposition", "attachment; filename=AeroFlowPro-Project.zip");
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Length", zipBuffer.length);
      res.send(zipBuffer);
      console.log("Zip generation complete, sent to client.");
    } catch (error) {
      console.error("Error generating zip:", error);
      res.status(500).json({ error: "Failed to generate zip file" });
    }
  });

  // Serve context-aware Gemini AI chatbot API
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, context } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request. 'messages' array is required." });
      }

      console.log(`Instructing AeroBot AI with ${messages.length} messages...`);
      const ai = getGeminiClient();

      // Format history to match @google/genai expectations
      const formattedContents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }]
      }));

      // Create a comprehensive prompt context injection
      const contextSummary = context ? 
        `USER SYSTEM STATE SNAPSHOT:\n${JSON.stringify(context, null, 2)}\n\n` : '';

      const systemInstruction = 
        `You are AeroBot, the state-of-the-art AI circadian architect and productivity coach embedded inside AeroFlow Pro. \n` +
        `Your mission is to help users optimize their daily routines, align biomechanical systems with morning outdoor light, maintain focus using Pomodoro logs, and prove their core habit identities.\n\n` +
        `GUIDELINES:\n` +
        `- State the user's progress with pride and scientific enthusiasm.\n` +
        `- Give custom recommendations, schedules, and biological insights.\n` +
        `- Keep your answers engaging, formatted with clear markdown, bullet points, and neat typography.\n` +
        `- When the user asks general questions, frame them inside the AeroFlow philosophy of focus sessions, bio-habit syncing, and proven daily identities.\n\n` +
        contextSummary;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "I was unable to synthesize a response at this moment. Please try again.";
      res.json({ text: replyText });
    } catch (error: any) {
      console.error("AeroBot Error:", error);
      const isMissingKey = error.message && (error.message.includes("GEMINI_API_KEY") || error.message.includes("GEMINI_API_KEY2"));
      res.status(500).json({ 
        error: isMissingKey 
          ? "AeroBot needs an active API Key. Please make sure to add your GEMINI_API_KEY or GEMINI_API_KEY2 in the Settings > Secrets configuration panel." 
          : "An error occurred while connecting with AeroBot: " + error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
