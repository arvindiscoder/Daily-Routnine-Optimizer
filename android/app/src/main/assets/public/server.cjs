var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_adm_zip = __toESM(require("adm-zip"), 1);
var aiClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set. Please add it via Settings > Secrets.");
  }
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/download-zip", (req, res) => {
    try {
      console.log("Generating zip of workspace...");
      const zip = new import_adm_zip.default();
      const rootDir = process.cwd();
      const addDirectoryToZip = (currentDir, relativePath = "") => {
        const items = import_fs.default.readdirSync(currentDir);
        for (const item of items) {
          const fullPath = import_path.default.join(currentDir, item);
          const itemRelativePath = relativePath ? relativePath + "/" + item : item;
          if (item === "node_modules" || item === "dist" || item === ".git" || item === ".gradle" || item === "build" || item === ".idea" || item === ".DS_Store" || item === "bin" || item === "obj") {
            continue;
          }
          const stat = import_fs.default.statSync(fullPath);
          if (stat.isDirectory()) {
            addDirectoryToZip(fullPath, itemRelativePath);
          } else {
            zip.addFile(itemRelativePath.replace(/\\/g, "/"), import_fs.default.readFileSync(fullPath));
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
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, context } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request. 'messages' array is required." });
      }
      console.log(`Instructing AeroBot AI with ${messages.length} messages...`);
      const ai = getGeminiClient();
      const formattedContents = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }]
      }));
      const contextSummary = context ? `USER SYSTEM STATE SNAPSHOT:
${JSON.stringify(context, null, 2)}

` : "";
      const systemInstruction = `You are AeroBot, the state-of-the-art AI circadian architect and productivity coach embedded inside AeroFlow Pro. 
Your mission is to help users optimize their daily routines, align biomechanical systems with morning outdoor light, maintain focus using Pomodoro logs, and prove their core habit identities.

GUIDELINES:
- State the user's progress with pride and scientific enthusiasm.
- Give custom recommendations, schedules, and biological insights.
- Keep your answers engaging, formatted with clear markdown, bullet points, and neat typography.
- When the user asks general questions, frame them inside the AeroFlow philosophy of focus sessions, bio-habit syncing, and proven daily identities.

` + contextSummary;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      const replyText = response.text || "I was unable to synthesize a response at this moment. Please try again.";
      res.json({ text: replyText });
    } catch (error) {
      console.error("AeroBot Error:", error);
      const isMissingKey = error.message && error.message.includes("GEMINI_API_KEY");
      res.status(500).json({
        error: isMissingKey ? "AeroBot needs an active API Key. Please make sure to add your GEMINI_API_KEY in the Settings > Secrets configuration panel." : "An error occurred while connecting with AeroBot: " + error.message
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
