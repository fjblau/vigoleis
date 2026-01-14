import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biography",
};

export default function BiographyPage() {
  return (
    <div className="container mx-auto px-5 py-16">
      <h1 className="mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Die Biographie
      </h1>
      <div className="prose prose-lg max-w-none">
        <h2>Leben und Werk im Überblick</h2>
        <p>
          <em>&quot;Erzweltschmerzler und Sprachschwelger&quot;</em> heißt die aktuelle Thelen-Bildbiographie, die auf der Grundlage der Sammlung{" "}
          <strong>Leo Fiethen</strong> von <strong>Jürgen Pütz</strong> herausgegeben wurde.
        </p>

        <h2 className="mt-12">Daten und Fakten</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-bold">1903</h3>
            <p>
              Geburt am 28. September als Sohn von Louis und Johanna Thelen (geb. Scheifes) in Süchteln/Niederrhein. Brüder Ludwig (1901-1973, mit ihm umfangreicher Briefwechsel), Joseph (1902-1974) und Julius (1913-1999). Der Vater ist Buchhalter, später Prokurist, die Mutter streng katholisch
            </p>
          </div>

          <div>
            <h3 className="font-bold">1909-1913</h3>
            <p>Volksschule in Süchteln</p>
          </div>

          <div>
            <h3 className="font-bold">1913-1918</h3>
            <p>Kaiser-Wilhelm-Schule in Süchteln</p>
          </div>

          <div>
            <h3 className="font-bold">1918-1919</h3>
            <p>Humanistisches Gymnasium der Stadt Viersen</p>
          </div>

          <div>
            <h3 className="font-bold">1919-1922</h3>
            <p>Schlosserlehre in der Süchtelner Weberei Ling & Duhr</p>
          </div>

          <div>
            <h3 className="font-bold">1922-1923</h3>
            <p>Technischer Zeichner in der Viersener Zentrifugenfabrik Schäfer</p>
          </div>

          <div>
            <h3 className="font-bold">1923-1924</h3>
            <p>Textilfachschule in Krefeld</p>
          </div>

          <div>
            <h3 className="font-bold">1925</h3>
            <p>
              Beginn des Studiums mit Kleiner Matrikel in Köln. Immatrikulationsdatum: 30. Oktober, Fächer: Germanistik, Philosophie und Kunstgeschichte
            </p>
          </div>

          <div>
            <h3 className="font-bold">1926</h3>
            <p>
              Fortsetzung der Studien in Münster. Zusätzliche Fächer: Zeitungswissenschaften und Niederländische Philologie
            </p>
          </div>

          <div>
            <h3 className="font-bold">1927</h3>
            <p>Süchtelner Stadtlied (Frühester erhaltener Text)</p>
          </div>

          <div>
            <h3 className="font-bold">1928</h3>
            <p>
              Mitarbeit auf der Internationalen Presseausstellung Pressa in Köln als Assistent von Prof. Karl Dester. Hier erste Begegnung mit seiner späteren Frau Beatrice
            </p>
          </div>

          <div>
            <h3 className="font-bold">1928-1931</h3>
            <p>
              Tätigkeit auf der Geflügelfarm des Bruders Joseph. Bemühungen um erste literarische Veröffentlichungen
            </p>
          </div>

          <div>
            <h3 className="font-bold">1929</h3>
            <p>
              Erste nachweisbare Veröffentlichung über den Maler Hermann Schmitz unter dem Titel <em>Versuch einer Deutung</em> vom 12. September in Vereinigte Dreistädte-Zeitung (Viersen, Dülken, Süchteln)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1930</h3>
            <p>
              Erste literarische Veröffentlichung unter dem Titel <em>Sargmacher Quirinus</em> (Novelle) in Der Türmer
            </p>
          </div>

          <div>
            <h3 className="font-bold">1931-1936</h3>
            <p>
              Aufenthalt auf Mallorca. Weitgehend in der <em>Insel des zweiten Gesichts</em> authentisch dokumentiert
            </p>
          </div>

          <div>
            <h3 className="font-bold">1934</h3>
            <p>
              Erste Besprechung deutscher Exilliteratur unter dem Pseudonym Leopold Fabrizius am 18. Februar in der niederländischen Zeitung <em>Het Vaderland</em> (Den Haag). Heirat mit Beatrice Bruckner in Barcelona
            </p>
          </div>

          <div>
            <h3 className="font-bold">1935</h3>
            <p>
              Tod des Vaters am 4. November. Beginn des Briefwechsels mit Teixeira de Pascoaes
            </p>
          </div>

          <div>
            <h3 className="font-bold">1936</h3>
            <p>
              Flucht vor den spanischen Falangisten und den deutschen Nationalsozialisten über Frankreich (Marseille) in die Schweiz (Basel). Dort Nachstellungen der Gestapo
            </p>
          </div>

          <div>
            <h3 className="font-bold">1937</h3>
            <p>
              Im Sommer Umzug nach Auressio/Tessin. Teixeira de Pascoaes: <em>Paulus. De dichter Gods</em> (Übersetzung ins Niederländische in Zusammenarbeit mit Hendrik Marsman)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1938</h3>
            <p>
              Teixeira de Pascoaes: <em>Paulus. Der Dichter Gottes</em> (Übersetzung)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1939-1947</h3>
            <p>
              Exil auf dem Weingut des portugiesischen Mystikers Teixeira de Pascoaes in Sao Joao de Gatao bei Amarante im Norden Portugals. Zwischenzeitliche Unterbringung in dem Bergdorf Travanca do Monte
            </p>
          </div>

          <div>
            <h3 className="font-bold">1939</h3>
            <p>
              Teixeira de Pascoaes: <em>Hieronymus. De dichter der vriendschap</em> (Übersetzung ins Niederländische mit Hendrik Marsman). Im August Aufenthalt in Bogève bei Annemasse (Frankreich). Anschließend Flucht über Spanien nach Portugal. Ankunft bei Pascoaes am 2. September
            </p>
          </div>

          <div>
            <h3 className="font-bold">1940</h3>
            <p>Letzte Rezension als Leopold Fabrizius am 28. April</p>
          </div>

          <div>
            <h3 className="font-bold">1941</h3>
            <p>
              Teixeira de Pascoaes: <em>Hieronymus. Der Dichter der Freundschaft</em> (Übersetzung)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1942</h3>
            <p>
              Erste eigenständige Veröffentlichung in Buchform: Der Gedichtband <em>Schloß Pascoaes</em>. Erste Anregungen des Verlegers Meulenhoff die Erlebnisse auf Mallorca als eine Art Reiseerinnerungen niederzuschreiben
            </p>
          </div>

          <div>
            <h3 className="font-bold">1946</h3>
            <p>
              Teixeira de Pascoaes: <em>Verbum obscurum</em> (Übersetzung ins Niederländische mit Hendrik Marsman)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1947-1954</h3>
            <p>Wohnsitz in Amsterdam</p>
          </div>

          <div>
            <h3 className="font-bold">1949</h3>
            <p>
              Teixeira de Pascoaes: <em>Das dunkle Wort</em> (Übersetzung)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1950</h3>
            <p>
              Teixeira de Pascoaes: <em>Napoleon. Spiegel van de Antichrist</em> (Übersetzung ins Niederländische mit Gerard Diels)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1951</h3>
            <p>
              Unterzeichnung eines Vertrages mit dem niederländischen Verleger Geert van Oorschot am 7. Mai über die <em>Insel des zweiten Gesichts</em>. Das Buch soll ursprünglich in niederländischer Sprache erscheinen. Erster Brief an Dr. Peter Diederichs, der die <em>Insel</em> in Lizenz verlegen wird
            </p>
          </div>

          <div>
            <h3 className="font-bold">1953</h3>
            <p>
              Lesung auf der Herbsttagung der Gruppe 47 in Bebenhausen am 16. Oktober. Ende Oktober erscheint im Amsterdamer van Oorschot Verlag <em>Die Insel des zweiten Gesichts</em>. Gleichzeitige Lizenzausgabe im Diederichs Verlag (Düsseldorf, Köln).
            </p>
          </div>

          <div>
            <h3 className="font-bold">1954</h3>
            <p>
              Verleihung des Fontane-Preises für die <em>Insel</em> in Berlin. <em>Vigolotria</em> (Gedichte). Kurzer Aufenthalt in Locarno
            </p>
          </div>

          <div>
            <h3 className="font-bold">1954-1960</h3>
            <p>
              Verwaltung der Casa Rocca Vispa, dem Anwesen einer befreundeten Mexikanerin, in Ascona (Schweiz)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1955</h3>
            <p>
              <em>Der Tragelaph</em> (Gedichte). Abschluß des zweiten Romans am 31. Dezember, der im Desch-Verlag erscheinen wird
            </p>
          </div>

          <div>
            <h3 className="font-bold">1956</h3>
            <p>
              <em>Der schwarze Herr Bahßetup. Ein Spiegel</em> erscheint im Münchner Desch-Verlag
            </p>
          </div>

          <div>
            <h3 className="font-bold">1957</h3>
            <p>
              C.F.A. Bruijning/L. Lichtfeld: <em>Suriman. Neues Leben auf alter Erde</em> (Übersetzung)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1960-1973</h3>
            <p>
              Verwaltung von La Colline im schweizerischen Blonay, einem weiteren Anwesen der Mexikanerin Elita Luttmann
            </p>
          </div>

          <div>
            <h3 className="font-bold">1962</h3>
            <p>Bewilligung einer Rente für Verfolgte des Naziregimes</p>
          </div>

          <div>
            <h3 className="font-bold">1963</h3>
            <p>
              <em>Runenmund</em> (Gedichte, Privatdruck)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1966</h3>
            <p>
              Im November Lesungen in Hildesheim und Neu-Isenburg aus der Fortsetzung der <em>Insel</em>, die den Titel <em>Die Gottlosigkeit Gottes</em> tragen sollte
            </p>
          </div>

          <div>
            <h3 className="font-bold">1967</h3>
            <p>
              <em>Glis-Glis</em> (Erzählung)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1968</h3>
            <p>Tod der Mutter am 16. März</p>
          </div>

          <div>
            <h3 className="font-bold">1973-1986</h3>
            <p>Wohnsitz in Lausanne-Vennes am Rande des Genfer Sees</p>
          </div>

          <div>
            <h3 className="font-bold">1979</h3>
            <p>
              <em>Im Gläs der Worte</em> (Gedichte)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1984</h3>
            <p>
              Verleihung des Professorentitels des Landes Nordrhein-Westfalen am 27. Dezember
            </p>
          </div>

          <div>
            <h3 className="font-bold">1985</h3>
            <p>
              Verleihung des Bundesverdienstkreuzes am 29. Oktober. <em>Gedichte und Holzschnitte</em> (Gedichte in bibliophiler Ausstattung mit Holzschnitten von Emil Bert Hartwig)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1986</h3>
            <p>
              Übersiedlung am 22. Oktober in das Dülkener Seniorenheim St. Cornelius. <em>Saudade</em> (Gedichtband in bibliophiler Ausstattung). Jan Jacob Slauerhoff: <em>Das verbotene Reich</em> (Übersetzung)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1989</h3>
            <p>
              Tod am 9. April in Dülken/Niederrhein. <em>Der magische Rand</em> (Romanfragment)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1990</h3>
            <p>
              <em>Poetische Märzkälbereien</em> (Gesammelte Prosa).
            </p>
          </div>

          <div>
            <h3 className="font-bold">1992</h3>
            <p>
              Tod von Beatrice Thelen am 19. Januar. <em>Sie tanzte nackt auf dem Söller</em> (Anthologie)
            </p>
          </div>

          <div>
            <h3 className="font-bold">1997</h3>
            <p>
              Teixeira de Pascoaes: <em>Napoleon. Spiegel des Antichrist</em> (Übersetzung).
            </p>
          </div>

          <div>
            <h3 className="font-bold">2000</h3>
            <p>
              <em>Die Gottlosigkeit Gottes oder Das Gesicht der zweiten Insel</em>. Doppel-CD nach einer Thelen-Lesung von 1966. Im Oktober erscheint eine Sonderausgabe der <em>horen</em> (Heft 199) mit zahlreichen unveröffentlichten Texten, Briefen und Bildern
            </p>
          </div>

          <div>
            <h3 className="font-bold">2001</h3>
            <p>
              Neuauflage der Erzählung <em>Glis-Glis</em> mit unveröffentlichten Briefen Thelens
            </p>
          </div>

          <div>
            <h3 className="font-bold">2003</h3>
            <p>
              Zum 100. Geburtstag erscheint die 2. Thelen-CD mit Lesungen des Dichters aus der <em>Insel</em>, eine Bildbiographie wird veröffentlicht, und eine Jubiläumsausgabe der <em>Insel</em> mit einem ausführlichen Nachwort wird vorgelegt. Erstmals gibt es die <em>Insel</em> als Hörspiel.
            </p>
          </div>

          <div>
            <h3 className="font-bold">2004</h3>
            <p>
              <em>Die Insel</em> erscheint in der Übersetzung von Will Boesten bei der Uitgeverij Signature auf holländisch
            </p>
          </div>

          <div>
            <h3 className="font-bold">2005</h3>
            <p>
              Die Taschenbuchrechte der <em>Insel</em> wechseln von dtv zum List Verlag.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
