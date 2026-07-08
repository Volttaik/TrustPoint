const http = require("http");
const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "..", "dist");
const PORT = parseInt(process.env.PORT || "5000", 10);
const API_PORT = 8080;

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

function proxyToApi(req, res) {
  const options = {
    hostname: "127.0.0.1",
    port: API_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxy = http.request(options, (apiRes) => {
    res.writeHead(apiRes.statusCode, apiRes.headers);
    apiRes.pipe(res, { end: true });
  });

  proxy.on("error", (err) => {
    console.error("API proxy error:", err.message);
    res.writeHead(502, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "API unavailable" }));
  });

  req.pipe(proxy, { end: true });
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url || "/").split("?")[0];

  // Proxy /api/* requests to the API server
  if (urlPath.startsWith("/api/")) {
    return proxyToApi(req, res);
  }

  let filePath = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
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
  console.log(`Proxying /api/* → http://localhost:${API_PORT}`);
});
