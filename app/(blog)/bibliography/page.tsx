import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bibliography",
};

export default function BibliographyPage() {
  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Bibliographie
      </h1>
      <div className="prose prose-lg max-w-none">
        <h2>Werke von Albert Vigoleis Thelen</h2>

        <h3 className="mt-8">Hauptwerke</h3>
        <ul>
          <li>
            <strong>Die Insel des zweiten Gesichts</strong> (1953)<br />
            Aus den angewandten Erinnerungen eines Ewiggestrigen. Blanvalet Verlag, Berlin
          </li>
          <li>
            <strong>Der schwarze Herr Bahßetup</strong> (1956)<br />
            Aus den angewandten Erinnerungen eines Ewiggestrigen. Blanvalet Verlag, Berlin
          </li>
          <li>
            <strong>Vigoleis</strong> (1983)<br />
            Sämtliche Dichtungen. Zweitausendeins, Frankfurt am Main
          </li>
        </ul>

        <h3 className="mt-8">Lyrik</h3>
        <ul>
          <li>
            <strong>Gedichte aus dem Manuskript &quot;Schloss Pascoaes&quot;</strong> (1942)<br />
            Unter anderem &quot;Der Büchersaal&quot; und &quot;Im kleinen Büchersaal&quot;
          </li>
          <li>
            <strong>Lyrik-Anthologien</strong><br />
            Diverse Gedichte in verschiedenen Anthologien erschienen
          </li>
        </ul>

        <h3 className="mt-8">Übersetzungen</h3>
        <ul>
          <li>
            <strong>Werke von Teixeira de Pascoaes</strong><br />
            Während der Zeit in Portugal, aus Dankbarkeit für die Gastfreundschaft
          </li>
          <li>
            <strong>Niederländische Literatur</strong><br />
            Verschiedene Übersetzungen aus dem Niederländischen
          </li>
        </ul>

        <h3 className="mt-8">Briefe und unveröffentlichte Werke</h3>
        <ul>
          <li>
            <strong>Briefwechsel mit Bruder Ludwig Thelen</strong><br />
            Umfangreiche Korrespondenz (1901-1973)
          </li>
          <li>
            <strong>Die Gottlosigkeit Gottes</strong><br />
            Vernichtetes Manuskript, von dem nur zwei Seiten erhalten sind
          </li>
          <li>
            <strong>Nachlass im Schweizerischen Literaturarchiv (SLA) Bern</strong><br />
            Über 1.300 Originalbriefe, tausende Briefkopien, mehr als 100 Widmungsexemplare, zahlreiche Manuskripte, sämtliche Erstausgaben
          </li>
        </ul>

        <h2 className="mt-12">Sekundärliteratur über Thelen</h2>

        <h3 className="mt-8">Biographien</h3>
        <ul>
          <li>
            <strong>Erzweltschmerzler und Sprachschwelger</strong><br />
            Thelen-Bildbiographie herausgegeben von Jürgen Pütz auf Grundlage der Sammlung Leo Fiethen
          </li>
        </ul>

        <h3 className="mt-8">Zeitschriften-Sonderausgaben</h3>
        <ul>
          <li>
            <strong>die horen Nr. 134</strong> (1983)<br />
            Schwerpunkt zu Thelens 80. Geburtstag
          </li>
          <li>
            <strong>die horen Nr. 199</strong> (2000) - <em>&quot;Lauter Vigoleisiaden&quot;</em><br />
            Herausgegeben von Jürgen Pütz / Redaktion Johann P. Tammen<br />
            440 Seiten, ISSN 0018-4942<br />
            Meistverkauftes horen-Heft aller Zeiten (2. Auflage erschienen)
          </li>
        </ul>

        <h3 className="mt-8">Übersetzungen der Hauptwerke</h3>
        <ul>
          <li>
            <strong>Englisch</strong>: <em>The Island of Second Sight</em><br />
            Mehrere Auflagen erschienen
          </li>
          <li>
            <strong>Niederländisch</strong>: <em>Het eiland van het tweede gezicht</em><br />
            Uitgeverij Signature (2004), übersetzt von Wil Boesten<br />
            Premiere im Amsterdamer Goethe-Institut am 6. Mai 2004
          </li>
          <li>
            <strong>Weitere Sprachen</strong><br />
            Übersetzungen in verschiedenen europäischen Sprachen
          </li>
        </ul>

        <h3 className="mt-8">Hörbücher</h3>
        <ul>
          <li>
            <strong>Die Insel des zweiten Gesichts</strong><br />
            Ungekürzte Lesungen auf CD, verschiedene Editionen
          </li>
          <li>
            <strong>Niederländische Hörbuch-Edition</strong><br />
            49 Stunden ungekürzte Lesung der niederländischen &quot;Insel&quot;-Ausgabe
          </li>
        </ul>

        <h3 className="mt-8">Pressendrucke und Sonderausgaben</h3>
        <ul>
          <li>
            <strong>Spektakulärer Fund - Zwei Manuskriptseiten der &quot;Gottlosigkeit&quot;</strong><br />
            Veröffentlicht von Leo Fiethen mit Hilfe des niederländischen Pressendruckers Gerben Wynia
          </li>
          <li>
            <strong>Diverse bibliophile Editionen</strong><br />
            Verschiedene Pressendrucke und Sonderausgaben
          </li>
        </ul>

        <h2 className="mt-12">Würdigungen und Auszeichnungen</h2>
        <ul>
          <li>Aufnahme in die <strong>Gruppe 47</strong></li>
          <li>Verschiedene literarische Preise und Ehrungen</li>
          <li>
            <strong>Plakette in Palma de Mallorca</strong><br />
            Am ehemaligen Wohnort des Autors
          </li>
        </ul>

        <h2 className="mt-12">Sammlungen und Archive</h2>
        <ul>
          <li>
            <strong>Schweizerisches Literaturarchiv (SLA) Bern</strong><br />
            Größte Sammlung von Thelen-Materialien, zugänglich für Forschung und Publikationen
          </li>
          <li>
            <strong>Sammlung Leo Fiethen</strong><br />
            Bedeutende Privatsammlung, Basis der Bildbiographie
          </li>
          <li>
            <strong>Verschiedene Universitätsarchive</strong><br />
            Bestände in deutschen und internationalen literarischen Archiven
          </li>
        </ul>
      </div>
    </div>
  );
}
