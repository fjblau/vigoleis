
import React, { useMemo, useState } from "react";
import { ShoppingCart, BookOpen, MapPin, Mail, Globe, Search, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// --- Mock content ---
const products = [
  { id: "p1", title: "Die Insel des zweiten Gesichts", subtitle: "Roman von Albert Vigoleis Thelen", price: 28.0, cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=860&auto=format&fit=crop" },
  { id: "p2", title: "Vigoleis-Wörterbuch", subtitle: "Begriffe & Neologismen", price: 18.0, cover: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=860&auto=format&fit=crop" },
  { id: "p3", title: "Essays & Rezensionen (1934–1940)", subtitle: "Kommentierte Ausgabe", price: 22.0, cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=860&auto=format&fit=crop" },
  { id: "p4", title: "Postkarten-Set Mallorca", subtitle: "Palma-Schauplätze", price: 9.5, cover: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=860&auto=format&fit=crop" },
];

const news = [
  { id: 1, date: "2025-07-12", title: "Neuauflage: Essays in kommentierter Fassung", excerpt: "Die zwischen 1934 und 1940 publizierten Artikel erscheinen in einer erweiterten Ausgabe.", link: "#" },
  { id: 2, date: "2025-05-20", title: "Lesung in Viersen", excerpt: "Ausschnitte aus der \"Insel des zweiten Gesichts\" mit musikalischer Begleitung.", link: "#" },
  { id: 3, date: "2025-03-02", title: "Kartenupdate: Palma-Stadtplan", excerpt: "Neue Hinweise zu Schauplätzen und Wegpunkten in Palma de Mallorca.", link: "#" },
];

const dictionary = [
  { term: "Tragelaph", def: "Neologismus Thelens für ein hybrides, widersprüchliches Wesen – zwischen Tragödie und Gelächter." },
  { term: "Zweites Gesicht", def: "Titelmotiv – Blick hinter die Oberfläche der Ereignisse; hellsichtiges Erinnern." },
  { term: "Vigoleis", def: "Alter Ego des Autors; Figur, durch deren Augen die Welt betrachtet wird." },
];

const palmaSpots = [
  { id: "m1", name: "Carrer de Sant Miquel", note: "Szene mit Vigoleis & Beatrice" },
  { id: "m2", name: "La Seu (Kathedrale)", note: "Wiederkehrendes Wahrzeichen" },
  { id: "m3", name: "Passeig del Born", note: "Begegnungen & Episoden" },
];

function useCart() {
  const [items, setItems] = useState([] as Array<{ id: string; qty: number }>)
  const add = (id: string) => setItems((prev) => {
    const found = prev.find((i) => i.id === id);
    if (found) return prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i);
    return [...prev, { id, qty: 1 }];
  });
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const total = useMemo(() => items.reduce((sum, i) => {
    const p = products.find((p) => p.id === i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0), [items]);
  return { items, add, remove, total };
}

export default function App() {
  const [locale, setLocale] = useState<"de" | "en">("de");
  const [active, setActive] = useState("home");
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart();

  const t = (key: string) => {
    const dict: Record<string, { de: string; en: string }> = {
      home: { de: "Start", en: "Home" },
      news: { de: "Aktuell", en: "News" },
      author: { de: "Autor", en: "Author" },
      dictionary: { de: "Wörterbuch", en: "Dictionary" },
      map: { de: "Palma-Karte", en: "Palma Map" },
      shop: { de: "Shop", en: "Shop" },
      contact: { de: "Kontakt", en: "Contact" },
      heroTitle: { de: "Albert Vigoleis Thelen", en: "Albert Vigoleis Thelen" },
      heroSubtitle: { de: "Dichter, Übersetzer, Weltbeobachter.", en: "Poet, translator, keen observer." },
      ctaExplore: { de: "Erkunden", en: "Explore" },
      ctaShop: { de: "Zum Shop", en: "Shop Now" },
      latestNews: { de: "Neuigkeiten", en: "Latest News" },
      featuredWork: { de: "Hauptwerk", en: "Featured Work" },
      searchTerm: { de: "Begriff suchen…", en: "Search term…" },
      send: { de: "Nachricht senden", en: "Send message" },
      name: { de: "Name", en: "Name" },
      email: { de: "E-Mail", en: "Email" },
      message: { de: "Nachricht", en: "Message" },
      addToCart: { de: "In den Warenkorb", en: "Add to cart" },
      viewCart: { de: "Warenkorb", en: "Cart" },
      checkout: { de: "Zur Kasse (Demo)", en: "Checkout (Demo)" },
    };
    return dict[key]?.[locale] ?? key;
  };

  const filteredDict = dictionary.filter(d => !query || `${d.term} ${d.def}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-semibold tracking-wide">VIGOLEIS.DE</span>
          </motion.div>
          <nav className="ml-auto hidden md:flex items-center gap-1">
            {[
              { key: "home", label: t("home") },
              { key: "news", label: t("news") },
              { key: "author", label: t("author") },
              { key: "dictionary", label: t("dictionary") },
              { key: "map", label: t("map") },
              { key: "shop", label: t("shop") },
              { key: "contact", label: t("contact") },
            ].map((link) => (
              <button key={link.key} className={`btn ${active===link.key ? 'btn-primary' : ''}`} onClick={() => setActive(link.key)}>
                {link.label}
              </button>
            ))}
            <span className="mx-2 h-6 w-px bg-neutral-300" />
            <button className="btn" onClick={() => setLocale(locale === "de" ? "en" : "de")}>
              <Globe className="h-4 w-4 mr-1" /> {locale.toUpperCase()}
            </button>
            <button className="btn" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="h-4 w-4 mr-2" />{t("viewCart")}
            </button>
          </nav>
        </div>
      </header>

      <main>
        {active === "home" && <HomeSection t={t} setActive={setActive} />}
        {active === "news" && <NewsSection />}
        {active === "author" && <AuthorSection />}
        {active === "dictionary" && <DictionarySection query={query} setQuery={setQuery} filtered={filteredDict} />}
        {active === "map" && <MapSection spots={palmaSpots} />}
        {active === "shop" && <ShopSection addToCart={cart.add} />}
        {active === "contact" && <ContactSection t={t} />}
      </main>

      <footer className="border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-semibold mb-2">VIGOLEIS.DE</div>
            <p className="text-sm text-neutral-600">Moderne, barrierearme Neuauflage — Entwurf.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Navigation</div>
            <ul className="space-y-1 text-sm">
              {[
                ["Start", () => setActive("home")],
                ["Aktuell", () => setActive("news")],
                ["Autor", () => setActive("author")],
                ["Wörterbuch", () => setActive("dictionary")],
                ["Palma-Karte", () => setActive("map")],
                ["Shop", () => setActive("shop")],
              ].map(([label, fn]: any) => (
                <li key={label}><button className="hover:underline" onClick={fn as any}>{label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Kontakt</div>
            <p className="text-sm text-neutral-600">Fragen, Korrekturen, Rechte & Impressum.</p>
            <button className="text-sm underline">info@vigoleis.de</button>
          </div>
          <div>
            <div className="font-semibold mb-2">Rechtliches</div>
            <p className="text-sm text-neutral-600">Impressum · Datenschutz · Barrierefreiheit</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/30" onClick={() => setCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{t("viewCart")}</h3>
              <button className="btn" onClick={() => setCartOpen(false)}>Schließen</button>
            </div>
            <p className="text-sm text-neutral-500 mb-3">Demo-Warenkorb ohne Zahlung – nur UX.</p>
            <div className="space-y-3 overflow-auto flex-1">
              {cart.items.length === 0 && <p className="text-sm text-neutral-500">Noch leer.</p>}
              {cart.items.map((i) => {
                const p = products.find((p) => p.id === i.id)!;
                return (
                  <div key={i.id} className="flex items-center gap-3">
                    <img src={p.cover} alt={p.title} className="w-12 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-medium leading-tight">{p.title}</div>
                      <div className="text-sm text-neutral-500">{i.qty} × {p.price.toFixed(2)}€</div>
                    </div>
                    <button className="btn" onClick={() => cart.remove(i.id)}>Entfernen</button>
                  </div>
                )
              })}
            </div>
            <div className="border-t pt-4 mt-4 flex items-center justify-between">
              <div className="text-sm">Zwischensumme</div>
              <div className="font-semibold">{cart.total.toFixed(2)} €</div>
            </div>
            <button className="btn btn-primary mt-4 w-full">{t("checkout")}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function HomeSection({ t, setActive }: { t: (k: string) => string, setActive: (k: string) => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8 grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("heroTitle")}</h1>
          <p className="mt-3 text-neutral-600">{t("heroSubtitle")}</p>
          <div className="mt-6 flex gap-3">
            <button className="btn btn-primary" onClick={() => setActive("author")}>{t("ctaExplore")}</button>
            <button className="btn" onClick={() => setActive("shop")}>{t("ctaShop")}</button>
          </div>
          <div className="mt-10">
            <div className="text-sm font-medium mb-2">{t("latestNews")}</div>
            <div className="grid sm:grid-cols-3 gap-3">
              {news.map((n) => (
                <div key={n.id} className="card">
                  <div className="card-header">
                    <div className="card-description text-xs">{new Date(n.date).toLocaleDateString()}</div>
                    <div className="card-title">{n.title}</div>
                  </div>
                  <div className="card-content">{n.excerpt}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <img src="https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop" alt="Bücher von Thelen" className="rounded-2xl shadow-md aspect-[4/5] object-cover w-full" />
          <span className="badge absolute bottom-4 left-4">{t("featuredWork")}: Insel des zweiten Gesichts</span>
        </motion.div>
      </div>
    </section>
  );
}

function NewsSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">Aktuell</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {news.map((n) => (
          <div key={n.id} className="card flex flex-col">
            <div className="card-header">
              <div className="card-description text-xs">{new Date(n.date).toLocaleDateString()}</div>
              <div className="card-title">{n.title}</div>
            </div>
            <div className="card-content flex-1">{n.excerpt}</div>
            <div className="card-footer">
              <button className="btn">Weiterlesen <ChevronRight className="h-4 w-4 ml-1 inline" /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AuthorSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">Autor</h2>
          <p className="text-neutral-700 leading-relaxed">Albert Vigoleis Thelen (1903–1989) war deutscher Schriftsteller, Übersetzer und scharfsinniger Beobachter. Sein Hauptwerk <em>Die Insel des zweiten Gesichts</em> spielt auf Mallorca und verbindet autobiografische Episoden mit barocker Sprachlust.</p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Biografie in Kürze</div>
                <div className="card-description">Stationen & Jahre</div>
              </div>
              <div className="card-content space-y-2">
                <div>1903: geboren am Niederrhein</div>
                <div>1931–36: Mallorca; 1939–47: Portugal</div>
                <div>1953: Veröffentlichung des Hauptwerks</div>
                <div>1989: gestorben in Dülken</div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Schwerpunkte</div>
                <div className="card-description">Übersetzen & Essayistik</div>
              </div>
              <div className="card-content space-y-2">
                <div>Übersetzungen aus dem Portugiesischen</div>
                <div>Rezensionen & Essays (Exilliteratur)</div>
                <div>Eigenwillige Wortschöpfungen</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop" alt="Porträt Thelen – Platzhalter" className="rounded-xl shadow aspect-[3/4] object-cover w-full" />
        </div>
      </div>
    </section>
  );
}

function DictionarySection({ query, setQuery, filtered }: { query: string, setQuery: (v: string) => void, filtered: typeof dictionary }) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Search className="h-5 w-5" />
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Wörterbuch</h2>
      </div>
      <div className="mb-4">
        <input className="input" placeholder="Begriff suchen…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="space-y-4">
        {filtered.map((d) => (
          <div key={d.term} className="card">
            <div className="card-header">
              <div className="card-title">{d.term}</div>
              <div className="card-description">{d.def}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-neutral-500">Kein Treffer. Versuche einen anderen Begriff.</p>}
      </div>
    </section>
  );
}

function MapSection({ spots }: { spots: typeof palmaSpots }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5" />
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Palma-Karte</h2>
      </div>
      <p className="text-neutral-700 mb-6">Interaktive Karte der Schauplätze (Demo). In der finalen Version binden wir eine barrierearme Karte mit Marker-Layer (Leaflet/MapLibre) ein.</p>
      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <div className="aspect-video w-full rounded-xl bg-neutral-200 grid place-items-center text-neutral-600">
            <span>Map Placeholder</span>
          </div>
        </div>
        <div className="space-y-3">
          {spots.map((s) => (
            <div key={s.id} className="card">
              <div className="card-header">
                <div className="card-title flex items-center gap-2"><MapPin className="h-4 w-4" />{s.name}</div>
                <div className="card-description">{s.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShopSection({ addToCart }: { addToCart: (id: string) => void }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-5 w-5" />
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Shop</h2>
      </div>
      <p className="text-neutral-700 mb-6">Demoseite mit Produktkarten, Warenkorb und Checkout-Flow (ohne Bezahlung). Für das Live-System: Anbindung an Shopify/Shopware/WooCommerce oder Headless.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="card flex flex-col">
            <div className="card-header">
              <img src={p.cover} alt={p.title} className="aspect-[3/4] object-cover w-full rounded-lg" />
              <div className="card-title mt-2">{p.title}</div>
              <div className="card-description">{p.subtitle}</div>
            </div>
            <div className="card-content">{p.price.toFixed(2)} €</div>
            <div className="card-footer mt-auto">
              <button className="btn btn-primary w-full" onClick={() => addToCart(p.id)}>In den Warenkorb</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ t }: { t: (k: string) => string }) {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">{t("contact")}</h2>
      <div className="card">
        <div className="card-header">
          <div className="card-description">Schreiben Sie uns. Wir freuen uns über Hinweise, Ergänzungen, Rechteanfragen und Kooperationen.</div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 p-4 pt-0">
          <input placeholder={t("name")} className="input" />
          <input placeholder={t("email")} type="email" className="input" />
          <div className="sm:col-span-2">
            <textarea placeholder={t("message")} className="input h-40" />
          </div>
        </div>
        <div className="card-footer">
          <button className="btn btn-primary">{t("send")}</button>
        </div>
      </div>
    </section>
  );
}
