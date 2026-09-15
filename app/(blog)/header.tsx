import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-accent-2 bg-white">
      <div className="container mx-auto px-5">
        <nav className="flex items-center justify-between py-3">
          <Link href="/">
            <Image
              src="/images/sig.png"
              alt="Albert Vigoleis Thelen"
              width={1000}
              height={250}
              className="h-16 w-auto"
              priority
            />
          </Link>
          <ul className="flex gap-6 text-lg font-medium">
            <li>
              <Link
                href="/"
                className="hover:underline transition-colors duration-200"
              >
                Startseite
              </Link>
            </li>
            <li>
              <Link
                href="/biography"
                className="hover:underline transition-colors duration-200"
              >
                Biografie
              </Link>
            </li>
            <li>
              <Link
                href="/news"
                className="hover:underline transition-colors duration-200"
              >
                Neuigkeiten
              </Link>
            </li>
            <li>
              <Link
                href="/bibliography"
                className="hover:underline transition-colors duration-200"
              >
                Bibliografie
              </Link>
            </li>
            <li>
              <Link
                href="/dictionary"
                className="hover:underline transition-colors duration-200"
              >
                Wörterbuch
              </Link>
            </li>
            <li>
              <Link
                href="/gallery"
                className="hover:underline transition-colors duration-200"
              >
                Galerie
              </Link>
            </li>
            <li>
              <Link
                href="/links"
                className="hover:underline transition-colors duration-200"
              >
                Links & Ephemera
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="hover:underline transition-colors duration-200"
              >
                Shop
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
