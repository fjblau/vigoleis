import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

const root = process.cwd();

function loadEnv(file) {
  const out = {};
  let raw;
  try {
    raw = readFileSync(resolve(root, file), "utf8");
  } catch {
    return out;
  }
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
const tokenKey = [
  "SANITY_API_WRITE_TOKEN",
  "SANITY_API_TOKEN",
  "SANITY_WRITE_TOKEN",
].find((k) => env[k]);

if (!projectId) {
  console.error("No NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}
if (!tokenKey) {
  console.error(
    'No write token in .env.local. Create one at sanity.io/manage\n(project -> API -> Tokens, Editor permissions) and add:\n  SANITY_API_WRITE_TOKEN="sk..."',
  );
  process.exit(1);
}

let counter = 0;
const key = () => "k" + (counter++).toString(36).padStart(4, "0");

function entry(title, year, description) {
  return { _type: "entry", _key: key(), title, year, description };
}

function subsection(heading, entries) {
  return { _type: "subsection", _key: key(), heading, entries };
}

function section(heading, subsections) {
  return { _type: "section", _key: key(), heading, subsections };
}

const sections = [
  section("Werke von Albert Vigoleis Thelen", [
    subsection("Hauptwerke", [
      entry(
        "Die Insel des zweiten Gesichts",
        "(1953)",
        "Aus den angewandten Erinnerungen eines Ewiggestrigen. Blanvalet Verlag, Berlin",
      ),
      entry(
        "Der schwarze Herr Bahßetup",
        "(1956)",
        "Aus den angewandten Erinnerungen eines Ewiggestrigen. Blanvalet Verlag, Berlin",
      ),
      entry(
        "Vigoleis",
        "(1983)",
        "Sämtliche Dichtungen. Zweitausendeins, Frankfurt am Main",
      ),
    ]),
    subsection("Lyrik", [
      entry(
        'Gedichte aus dem Manuskript "Schloss Pascoaes"',
        "(1942)",
        'Unter anderem "Der Büchersaal" und "Im kleinen Büchersaal"',
      ),
      entry(
        "Lyrik-Anthologien",
        undefined,
        "Diverse Gedichte in verschiedenen Anthologien erschienen",
      ),
    ]),
    subsection("Übersetzungen", [
      entry(
        "Werke von Teixeira de Pascoaes",
        undefined,
        "Während der Zeit in Portugal, aus Dankbarkeit für die Gastfreundschaft",
      ),
      entry(
        "Niederländische Literatur",
        undefined,
        "Verschiedene Übersetzungen aus dem Niederländischen",
      ),
    ]),
    subsection("Briefe und unveröffentlichte Werke", [
      entry(
        "Briefwechsel mit Bruder Ludwig Thelen",
        undefined,
        "Umfangreiche Korrespondenz (1901-1973)",
      ),
      entry(
        "Die Gottlosigkeit Gottes",
        undefined,
        "Vernichtetes Manuskript, von dem nur zwei Seiten erhalten sind",
      ),
      entry(
        "Nachlass im Schweizerischen Literaturarchiv (SLA) Bern",
        undefined,
        "Über 1.300 Originalbriefe, tausende Briefkopien, mehr als 100 Widmungsexemplare, zahlreiche Manuskripte, sämtliche Erstausgaben",
      ),
    ]),
  ]),
  section("Sekundärliteratur über Thelen", [
    subsection("Biographien", [
      entry(
        "Erzweltschmerzler und Sprachschwelger",
        undefined,
        "Thelen-Bildbiographie herausgegeben von Jürgen Pütz auf Grundlage der Sammlung Leo Fiethen",
      ),
    ]),
    subsection("Zeitschriften-Sonderausgaben", [
      entry(
        "die horen Nr. 134",
        "(1983)",
        "Schwerpunkt zu Thelens 80. Geburtstag",
      ),
      entry(
        'die horen Nr. 199 (2000) - "Lauter Vigoleisiaden"',
        undefined,
        "Herausgegeben von Jürgen Pütz / Redaktion Johann P. Tammen\n440 Seiten, ISSN 0018-4942\nMeistverkauftes horen-Heft aller Zeiten (2. Auflage erschienen)",
      ),
    ]),
    subsection("Übersetzungen der Hauptwerke", [
      entry(
        "Englisch: The Island of Second Sight",
        undefined,
        "Mehrere Auflagen erschienen",
      ),
      entry(
        "Niederländisch: Het eiland van het tweede gezicht",
        undefined,
        "Uitgeverij Signature (2004), übersetzt von Wil Boesten\nPremiere im Amsterdamer Goethe-Institut am 6. Mai 2004",
      ),
      entry(
        "Weitere Sprachen",
        undefined,
        "Übersetzungen in verschiedenen europäischen Sprachen",
      ),
    ]),
    subsection("Hörbücher", [
      entry(
        "Die Insel des zweiten Gesichts",
        undefined,
        "Ungekürzte Lesungen auf CD, verschiedene Editionen",
      ),
      entry(
        "Niederländische Hörbuch-Edition",
        undefined,
        '49 Stunden ungekürzte Lesung der niederländischen "Insel"-Ausgabe',
      ),
    ]),
    subsection("Pressendrucke und Sonderausgaben", [
      entry(
        'Spektakulärer Fund - Zwei Manuskriptseiten der "Gottlosigkeit"',
        undefined,
        "Veröffentlicht von Leo Fiethen mit Hilfe des niederländischen Pressendruckers Gerben Wynia",
      ),
      entry(
        "Diverse bibliophile Editionen",
        undefined,
        "Verschiedene Pressendrucke und Sonderausgaben",
      ),
    ]),
  ]),
  section("Würdigungen und Auszeichnungen", [
    subsection(undefined, [
      entry("Aufnahme in die Gruppe 47", undefined, undefined),
      entry(
        "Verschiedene literarische Preise und Ehrungen",
        undefined,
        undefined,
      ),
      entry(
        "Plakette in Palma de Mallorca",
        undefined,
        "Am ehemaligen Wohnort des Autors",
      ),
    ]),
  ]),
  section("Sammlungen und Archive", [
    subsection(undefined, [
      entry(
        "Schweizerisches Literaturarchiv (SLA) Bern",
        undefined,
        "Größte Sammlung von Thelen-Materialien, zugänglich für Forschung und Publikationen",
      ),
      entry(
        "Sammlung Leo Fiethen",
        undefined,
        "Bedeutende Privatsammlung, Basis der Bildbiographie",
      ),
      entry(
        "Verschiedene Universitätsarchive",
        undefined,
        "Bestände in deutschen und internationalen literarischen Archiven",
      ),
    ]),
  ]),
];

const doc = {
  _id: "bibliography",
  _type: "bibliography",
  title: "Bibliographie",
  sections,
};

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-03-01",
  token: env[tokenKey],
  useCdn: false,
});

console.log("project " + projectId + " / dataset " + dataset);
console.log("importing " + sections.length + " sections");

const res = await client.createOrReplace(doc);
console.log("imported " + res._id + " at rev " + res._rev);
