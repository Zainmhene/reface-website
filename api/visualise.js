/* =====================================================================
   REFACE — AI Visualiser server function (runs on Vercel)

   What it does, in plain English:
   - The website sends a customer's room photo plus their choices
     (room, door style, one colour, handle finish).
   - This function asks Google's Gemini image model to repaint ONLY the
     doors in that colour and style, keeping the rest of the room the same.
   - It sends the new picture back to the website.

   Why it lives on the server: the Google API key must stay secret.
   It is read from Vercel's environment variables and never sent to the browser.

   Settings (Vercel → Project → Settings → Environment Variables):
     GEMINI_API_KEY      required. Without it the site shows the WhatsApp fallback.
     GEMINI_IMAGE_MODEL  optional. Defaults to "gemini-2.5-flash-image".
     ALLOWED_ORIGIN      optional but recommended, e.g. "https://www.refacegroup.co.uk"
                         (comma-separate several). Stops other sites using your key.

   No npm packages needed: it uses the fetch built into Node 18+.
   ===================================================================== */

const ROOMS = {
  kitchen: "the kitchen cabinet doors, drawer fronts and matching end panels",
  bedroom: "the fitted wardrobe doors, drawer fronts and bedroom furniture doors",
  bathroom: "the bathroom vanity unit and storage cabinet doors and drawer fronts"
};

// Vercel's limit for a request body is about 4.5 MB, so keep the photo under that.
// The website shrinks photos to 1280px first, which is normally 200–600 KB.
const MAX_BASE64_CHARS = 4200000;
const MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Send a JSON reply (works with Vercel's helpers or plain Node)
function send(res, status, body) {
  if (typeof res.status === "function" && typeof res.json === "function") return res.status(status).json(body);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

// Keep user text short and on one line before it goes into the AI prompt
function clean(value, max) {
  return String(value || "").replace(/[\r\n\t]+/g, " ").replace(/[^\w\s&'().,#\-\/]/g, "").trim().slice(0, max);
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  // Plain Node: read the stream ourselves
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BASE64_CHARS + 20000) throw Object.assign(new Error("too_large"), { status: 413 });
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function buildPrompt({ room, door, colour, handle }) {
  const handleText = /handleless/i.test(handle)
    ? "handleless doors (no visible handles, with a slim integrated finger-pull)"
    : `${handle.toLowerCase()} handles`;
  return [
    "Edit this photo of a real home. Make it look like a professional, photorealistic interior photograph.",
    `Replace ONLY ${ROOMS[room]} with new made-to-measure ${door} style doors in the colour "${colour.name}" (approximately ${colour.hex}), with ${handleText}.`,
    "Keep everything else exactly the same: the room layout, camera angle, walls, ceiling, floor, worktops, splashback, sink, appliances, windows, lighting and all objects.",
    "Doors must line up with the existing cabinets and keep the same sizes and positions. Keep realistic shadows and reflections.",
    "Do not add any text, logos, labels or watermarks."
  ].join(" ");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    if (typeof res.setHeader === "function") res.setHeader("Allow", "POST");
    return send(res, 405, { error: "method_not_allowed" });
  }

  // Only answer requests from our own website, if ALLOWED_ORIGIN is set
  const allowed = (process.env.ALLOWED_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (allowed.length) {
    const origin = (req.headers && (req.headers.origin || req.headers.Origin)) || "";
    if (!allowed.includes(origin)) return send(res, 403, { error: "forbidden" });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) return send(res, 501, { error: "not_configured" });

  // Read and check what the website sent
  let body;
  try { body = await readBody(req); } catch (e) {
    return send(res, e.status || 400, { error: e.status === 413 ? "photo_too_large" : "bad_request" });
  }
  const image = typeof body.image === "string" ? body.image.replace(/^data:[^,]+,/, "") : "";
  const mimeType = MIME_TYPES.includes(body.mimeType) ? body.mimeType : "image/jpeg";
  const room = String(body.room || "");
  const colour = body.colour || {};
  const input = {
    room,
    door: clean(body.door, 40),
    handle: clean(body.handle, 40) || "Brushed brass",
    colour: { name: clean(colour.name, 60), hex: /^#[0-9a-fA-F]{6}$/.test(colour.hex || "") ? colour.hex : "" }
  };

  if (!image || image.length < 1000) return send(res, 400, { error: "missing_photo" });
  if (image.length > MAX_BASE64_CHARS) return send(res, 413, { error: "photo_too_large" });
  if (!/^[A-Za-z0-9+/=]+$/.test(image.slice(0, 2000))) return send(res, 400, { error: "bad_photo" });
  if (!ROOMS[room]) return send(res, 400, { error: "bad_room" });
  if (!input.door || !input.colour.name || !input.colour.hex) return send(res, 400, { error: "bad_choices" });

  // Ask Gemini for the edited picture
  const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  let data;
  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(input) }, { inline_data: { mime_type: mimeType, data: image } }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
      })
    });
    data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("Gemini error", upstream.status, data && data.error && data.error.message);
      return send(res, 502, { error: upstream.status === 429 ? "busy_try_again" : "ai_unavailable" });
    }
  } catch (e) {
    console.error("Gemini request failed", e && e.message);
    return send(res, 502, { error: "ai_unavailable" });
  }

  // Find the picture in the reply (Google uses inlineData; older docs say inline_data)
  const parts = (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
  const part = parts.find((p) => (p.inlineData && p.inlineData.data) || (p.inline_data && p.inline_data.data));
  if (!part) return send(res, 502, { error: "no_image" });
  const img = part.inlineData || part.inline_data;
  return send(res, 200, { image: img.data, mimeType: img.mimeType || img.mime_type || "image/png" });
};

// Give the AI up to 60 seconds to reply
module.exports.config = { maxDuration: 60 };
