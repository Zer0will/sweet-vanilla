import { json } from "./_orders.js";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function parseMultipart(body, boundary) {
  const delimiter = Buffer.from(`--${boundary}`);
  const parts = [];
  let start = body.indexOf(delimiter);
  while (start !== -1) {
    start += delimiter.length;
    if (body[start] === 45 && body[start + 1] === 45) break;
    if (body[start] === 13 && body[start + 1] === 10) start += 2;
    const headerEnd = body.indexOf(Buffer.from("\r\n\r\n"), start);
    if (headerEnd === -1) break;
    const headerText = body.slice(start, headerEnd).toString("utf8");
    let dataStart = headerEnd + 4;
    let next = body.indexOf(delimiter, dataStart);
    if (next === -1) break;
    let dataEnd = next;
    if (body[dataEnd - 2] === 13 && body[dataEnd - 1] === 10) dataEnd -= 2;
    const disposition = /content-disposition:\s*form-data;([^\r\n]+)/i.exec(headerText)?.[1] || "";
    const name = /name="([^"]+)"/i.exec(disposition)?.[1] || "";
    const filename = /filename="([^"]*)"/i.exec(disposition)?.[1] || "";
    const type = /content-type:\s*([^\r\n]+)/i.exec(headerText)?.[1]?.trim() || "application/octet-stream";
    if (filename) parts.push({ name, filename, type, data: body.slice(dataStart, dataEnd) });
    start = next;
  }
  return parts;
}

function readBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", chunk => {
      size += chunk.length;
      if (size > MAX_FILES * MAX_FILE_SIZE + 1_000_000) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function extFor(type, filename) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/jpeg") return "jpg";
  const ext = filename.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  return ext || "jpg";
}

async function uploadSupabase(file) {
  const base = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_BUCKET || "order-inspiration";
  if (!base || !key) return null;

  const storageKey = `orders/${crypto.randomUUID()}.${extFor(file.type, file.filename)}`;
  const response = await fetch(`${base}/storage/v1/object/${bucket}/${storageKey}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      apikey: key,
      "content-type": file.type,
      "cache-control": "3600",
      "x-upsert": "false",
    },
    body: file.data,
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => response.statusText);
    throw new Error(`Supabase upload failed (${response.status}): ${detail}`);
  }
  return `${base}/storage/v1/object/public/${bucket}/${storageKey}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  const contentType = req.headers["content-type"] || "";
  const boundary = /boundary=([^;]+)/i.exec(contentType)?.[1];
  if (!boundary) return json(res, 400, { error: "No se recibieron fotos." });

  try {
    const body = await readBuffer(req);
    const files = parseMultipart(body, boundary).filter(p => p.name === "photos").slice(0, MAX_FILES);
    if (!files.length) return json(res, 400, { error: "No se recibieron fotos." });

    const links = [];
    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type) || file.data.length > MAX_FILE_SIZE) {
        return json(res, 400, { error: "Cada archivo debe ser JPG, PNG o WEBP y pesar menos de 8 MB." });
      }
      const uploaded = await uploadSupabase(file);
      links.push(uploaded || `Foto de inspiración: ${file.filename} (adjuntar manualmente en WhatsApp)`);
    }

    return json(res, 201, {
      links,
      configured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    });
  } catch (error) {
    console.error(error);
    return json(res, 503, { error: "No pudimos subir las fotos en este momento." });
  }
}

export const config = {
  api: { bodyParser: false },
};
