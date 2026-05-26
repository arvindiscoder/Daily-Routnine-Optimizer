import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import AdmZip from "adm-zip";

async function startServer() {
  const app = express();
  const PORT = 3000;

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
