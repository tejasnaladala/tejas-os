import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(process.env.STATIC_ROOT ?? fileURLToPath(new URL(".", import.meta.url)));
const port = Number.parseInt(process.env.PORT ?? "3010", 10);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webm": "video/webm",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

const rangeExtensions = new Set([".mp4", ".pdf", ".webm"]);
const appRoutes = new Map([
  ["/about", "about.html"],
  ["/work", "work.html"],
  ["/research", "research.html"],
  ["/investing", "investing.html"],
  ["/blog", "blog.html"],
  ["/blog/nespresso-jailbreak", "blog/nespresso-jailbreak.html"],
  ["/blog/wifi-cantenna", "blog/wifi-cantenna.html"],
  ["/cv", "cv.html"],
]);
const cleanHtmlRoutes = new Map([
  ["/index.html", "/"],
  ...[...appRoutes].map(([route, file]) => [`/${file}`, route]),
]);

function parseRange(header, size) {
  if (!header) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || (!match[1] && !match[2])) return false;

  let start;
  let end;

  if (!match[1]) {
    const suffixLength = Number.parseInt(match[2], 10);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return false;
    start = Math.max(size - suffixLength, 0);
    end = size - 1;
  } else {
    start = Number.parseInt(match[1], 10);
    end = match[2] ? Number.parseInt(match[2], 10) : size - 1;
  }

  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    start >= size ||
    end < start
  ) {
    return false;
  }

  return { start, end: Math.min(end, size - 1) };
}

const server = createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD", "Content-Type": "text/plain; charset=utf-8" }).end("Method not allowed");
    return;
  }

  let requestedPath;
  let requestedUrl;
  try {
    requestedUrl = new URL(request.url ?? "/", "http://localhost");
    requestedPath = decodeURIComponent(requestedUrl.pathname);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" }).end("Bad request");
    return;
  }

  if (requestedPath === "/stories" || requestedPath === "/story") {
    response.writeHead(308, { Location: "/blog" }).end();
    return;
  }

  if (requestedPath === "/resume.pdf") {
    response.writeHead(308, { Location: "/assets/resume.pdf?v=20260901.15" }).end();
    return;
  }

  if (cleanHtmlRoutes.has(requestedPath)) {
    response.writeHead(308, { Location: cleanHtmlRoutes.get(requestedPath) }).end();
    return;
  }

  if (requestedPath.length > 1 && requestedPath.endsWith("/") && appRoutes.has(requestedPath.slice(0, -1))) {
    response.writeHead(308, { Location: requestedPath.slice(0, -1) }).end();
    return;
  }

  const relativePath = requestedPath === "/" ? "index.html" : appRoutes.get(requestedPath) ?? requestedPath.slice(1);
  const filePath = resolve(root, relativePath);
  const pathFromRoot = relative(root, filePath);

  if (pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const stats = statSync(filePath);
    if (!stats.isFile()) throw new Error("Not a file");

    const extension = extname(filePath).toLowerCase();
    const isPdf = extension === ".pdf";
    const isAsset = pathFromRoot.startsWith(`assets${process.platform === "win32" ? "\\" : "/"}`);
    const isVersionedBundle = (extension === ".css" || extension === ".js") && requestedUrl.searchParams.has("v");
    const range = rangeExtensions.has(extension) ? parseRange(request.headers.range, stats.size) : null;

    response.setHeader("Content-Type", contentTypes[extension] ?? "application/octet-stream");
    response.setHeader("Link", '</llms.txt>; rel="describedby"; type="text/markdown"');
    response.setHeader(
      "Cache-Control",
      isVersionedBundle
        ? "public, max-age=0, must-revalidate"
        : isAsset
          ? "public, max-age=3600, stale-while-revalidate=86400"
          : "no-cache",
    );
    response.setHeader(
      "Content-Security-Policy",
      isPdf
        ? "default-src 'none'; frame-ancestors 'self'"
        : "default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    );
    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", isPdf ? "SAMEORIGIN" : "DENY");
    response.setHeader("Referrer-Policy", "no-referrer");

    if (range === false) {
      response.setHeader("Content-Range", `bytes */${stats.size}`);
      response.writeHead(416).end();
      return;
    }

    const streamOptions = range ? { start: range.start, end: range.end } : undefined;
    const contentLength = range ? range.end - range.start + 1 : stats.size;
    if (rangeExtensions.has(extension)) response.setHeader("Accept-Ranges", "bytes");
    if (range) response.setHeader("Content-Range", `bytes ${range.start}-${range.end}/${stats.size}`);
    response.setHeader("Content-Length", contentLength);

    if (request.method === "HEAD") {
      response.writeHead(range ? 206 : 200).end();
    } else {
      response.writeHead(range ? 206 : 200);
      createReadStream(filePath, streamOptions).pipe(response);
    }
  } catch {
    const notFound = resolve(root, "404.html");
    try {
      const stats = statSync(notFound);
      response.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Length": stats.size,
        "Cache-Control": "no-cache",
        Link: '</llms.txt>; rel="describedby"; type="text/markdown"',
        "X-Robots-Tag": "noindex",
      });
      if (request.method === "HEAD") response.end();
      else createReadStream(notFound).pipe(response);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
    }
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Tejas revamp preview: http://127.0.0.1:${port}`);
});
