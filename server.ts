import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "kobo-ramen" });
  });

  // Check for any uploaded storefront images in public or public/images
  app.get("/api/detect-storefront-images", (req, res) => {
    const searchDirs = [
      path.join(process.cwd(), "public"),
      path.join(process.cwd(), "public", "images"),
      process.cwd(),
    ];

    let tokyoImg: string | null = null;
    let nyImg: string | null = null;

    for (const dir of searchDirs) {
      if (!fs.existsSync(dir)) continue;
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const lower = file.toLowerCase();
          const isImg = [".png", ".jpg", ".jpeg", ".webp"].some((ext) => lower.endsWith(ext));
          if (!isImg) continue;

          // Check for Shinjuku / Tokyo hints or timestamps
          if (
            lower.includes("shinjuku") ||
            lower.includes("tokyo") ||
            lower.includes("01_59") ||
            lower.includes("01_47")
          ) {
            // Let 01_59 or shinjuku be tokyo, or detect by timestamp
            if (lower.includes("01_59") || lower.includes("shinjuku") || lower.includes("tokyo")) {
              if (!tokyoImg) {
                tokyoImg = dir.includes("public/images")
                  ? `/images/${file}`
                  : dir.includes("public")
                  ? `/${file}`
                  : `/${file}`;
              }
            } else if (lower.includes("01_47") || lower.includes("newyork") || lower.includes("manhattan") || lower.includes("ny")) {
              if (!nyImg) {
                nyImg = dir.includes("public/images")
                  ? `/images/${file}`
                  : dir.includes("public")
                  ? `/${file}`
                  : `/${file}`;
              }
            }
          }

          if (lower.includes("newyork") || lower.includes("manhattan") || lower.includes("ny_kobo") || lower.includes("new_york")) {
            if (!nyImg) {
              nyImg = dir.includes("public/images")
                ? `/images/${file}`
                : dir.includes("public")
                ? `/${file}`
                : `/${file}`;
            }
          }
        }
      } catch (e) {
        console.error("Error reading dir:", e);
      }
    }

    res.json({ tokyoImg, nyImg });
  });

  // Endpoint to save base64 uploaded image directly to public/images
  app.post("/api/upload-storefront-image", (req, res) => {
    try {
      const { type, dataUrl, filename } = req.body;
      if (!dataUrl || !type) {
        return res.status(400).json({ error: "Missing type or dataUrl" });
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid dataUrl" });
      }

      const ext = matches[1].includes("png") ? "png" : matches[1].includes("webp") ? "webp" : "jpg";
      const saveName = type === "tokyo" ? `shinjuku_custom.${ext}` : `newyork_custom.${ext}`;

      const publicImagesDir = path.join(process.cwd(), "public", "images");
      if (!fs.existsSync(publicImagesDir)) {
        fs.mkdirSync(publicImagesDir, { recursive: true });
      }

      const filePath = path.join(publicImagesDir, saveName);
      const buffer = Buffer.from(matches[2], "base64");
      fs.writeFileSync(filePath, buffer);

      // Also copy to dist/images if dist exists
      const distImagesDir = path.join(process.cwd(), "dist", "images");
      if (fs.existsSync(distImagesDir)) {
        fs.writeFileSync(path.join(distImagesDir, saveName), buffer);
      }

      const url = `/images/${saveName}?t=${Date.now()}`;
      res.json({ success: true, url });
    } catch (err: any) {
      console.error("Error saving image:", err);
      res.status(500).json({ error: err.message });
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
