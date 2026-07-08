const http = require("http");
const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "..", "dist");
const PORT = parseInt(process.env.PORT || "5000", 10);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".map": "application/json",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  let urlPath = (req.url || "/").split("?")[0];
  let filePath = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);

  if (
    !fs.existsSync(filePath) ||
    fs.statSync(filePath).isDirectory()
  ) {
    filePath = path.join(DIST, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";
  res.writeHead(200, { "content-type": contentType });
  res.end(fs.readFileSync(filePath));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`TrustPoint Bank web app on http://localhost:${PORT}`);
  console.log(`Serving from: ${DIST}`);
});
