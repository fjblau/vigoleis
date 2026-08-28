import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

const root = process.cwd();

function loadEnv(file) {
  const out = {};
  let raw;
  try { raw = readFileSync(resolve(root, file), "utf8"); } catch { return out; }
  for (const line of raw.split("\n")) {
    if (line.trim().startsWith("#")) continue;
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...loadEnv(".env"), ...loadEnv(".env.local"), ...process.env };
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const tokenKey = ["SANITY_API_WRITE_TOKEN", "SANITY_API_TOKEN", "SANITY_WRITE_TOKEN"].find((k) => env[k]);

if (!projectId) { console.error("No NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local"); process.exit(1); }
if (!tokenKey) {
  console.error("No write token in .env.local. Create one at sanity.io/manage\n(project -> API -> Tokens, Editor permissions) and add:\n  SANITY_API_WRITE_TOKEN=\"sk...\"");
  process.exit(1);
}

const src = readFileSync(resolve(root, "app/(blog)/biography/page.tsx"), "utf8");

let counter = 0;
const key = () => "k" + (counter++).toString(36).padStart(4, "0");

function clean(t) {
  return t.replace(/\{" "\}/g, " ").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
}

function toBlocks(html) {
  const parts = html.split(/(<em>[\s\S]*?<\/em>|<strong>[\s\S]*?<\/strong>)/);
  const children = [];
  for (const part of parts) {
    if (!part) continue;
    let text = part, marks = [];
    if (part.startsWith("<em>")) { text = part.slice(4, -5); marks = ["em"]; }
    else if (part.startsWith("<strong>")) { text = part.slice(8, -9); marks = ["strong"]; }
    text = clean(text);
    if (!text) continue;
    children.push({ _type: "span", _key: key(), text, marks });
  }
  if (!children.length) return [];
  children[0].text = children[0].text.replace(/^\s+/, "");
  children[children.length - 1].text = children[children.length - 1].text.replace(/\s+$/, "");
  const kept = children.filter((c) => c.text !== "");
  return [{ _type: "block", _key: key(), style: "normal", markDefs: [], children: kept }];
}

const introMatch = src.match(/<p>([\s\S]*?)<\/p>/);
const intro = introMatch ? toBlocks(introMatch[1]) : [];

const timeline = [];
const entryRe = /<h3 className="font-bold">([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g;
let m;
while ((m = entryRe.exec(src)) !== null) {
  timeline.push({ _type: "entry", _key: key(), period: clean(m[1]).trim(), text: toBlocks(m[2]) });
}

if (!timeline.length) { console.error("Parsed 0 entries — page.tsx may already be replaced."); process.exit(1); }

const doc = {
  _id: "biography",
  _type: "biography",
  title: "Die Biographie",
  introHeading: "Leben und Werk im Überblick",
  intro,
  timelineHeading: "Daten und Fakten",
  timeline,
};

const client = createClient({ projectId, dataset, apiVersion: "2024-03-01", token: env[tokenKey], useCdn: false });

console.log("project " + projectId + " / dataset " + dataset);
console.log("parsed " + timeline.length + " entries: " + timeline[0].period + " ... " + timeline[timeline.length - 1].period);

const res = await client.createOrReplace(doc);
console.log("imported " + res._id + " at rev " + res._rev);
