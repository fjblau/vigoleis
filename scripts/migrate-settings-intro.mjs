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

const client = createClient({ projectId, dataset, apiVersion: "2024-03-01", token: env[tokenKey], useCdn: false });

let counter = 0;
const key = () => "k" + (counter++).toString(36).padStart(4, "0");

function span(text, marks = []) {
  return { _type: "span", _key: key(), text, marks };
}

function block(children) {
  return { _type: "block", _key: key(), style: "normal", markDefs: [], children };
}

const introText = [
  block([
    span(
      "Albert Vigoleis Thelen war ein deutscher Schriftsteller, Übersetzer und Dichter, dessen Hauptwerk ",
    ),
    span("Die Insel des zweiten Gesichts", ["em"]),
    span(
      " (1953) zu den bedeutendsten deutschen Romanen des 20. Jahrhunderts zählt. Mit seinem einzigartigen, sprachgewaltigen Stil und seinem feinen Humor schuf er ein literarisches Werk, das ihn zu einem der außergewöhnlichsten Autoren seiner Zeit macht.",
    ),
  ]),
  block([
    span(
      "Diese Website widmet sich dem Leben und Werk von Albert Vigoleis Thelen und bietet Informationen zu seinen Publikationen, seiner Biographie und aktuellen Neuigkeiten aus der Thelen-Forschung.",
    ),
  ]),
];

const docs = await client.fetch(`*[_type == "settings"]{_id}`);

if (!docs.length) {
  console.error('No "settings" document found. Create one in the Studio first.');
  process.exit(1);
}

console.log("project " + projectId + " / dataset " + dataset);

for (const doc of docs) {
  console.log("patching settings doc " + doc._id);
  const res = await client.patch(doc._id).set({ introText }).commit();
  console.log("updated " + res._id + " at rev " + res._rev);
}
