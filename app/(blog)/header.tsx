import Link from "next/link";
import Image from "next/image";

import CartIndicator from "./cart-indicator";

export default function Header() {
  return (
    <header className="bg-gray-50">
      <div className="container mx-auto px-5">
        <nav className="flex items-center justify-between py-3">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/sig.png"
              alt="Albert Vigoleis Thelen"
              width={1000}
              height={250}
              className="relative z-10 h-24 w-auto translate-y-6 md:h-32"
              priority
            />
          </Link>
          <ul className="flex flex-wrap justify-end gap-x-6 gap-y-2 text-lg font-medium">
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
                Biographie
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
                Bibliographie
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
                href="/shop"
                className="hover:underline transition-colors duration-200"
              >
                Shop
              </Link>
            </li>
            <li>
              <CartIndicator />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
