import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-accent-2 bg-white">
      <div className="container mx-auto px-5">
        <nav className="flex items-center justify-between py-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/sig.png"
              alt="Albert Vigoleis Thelen"
              width={1000}
              height={250}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <ul className="flex gap-6 text-sm font-medium">
            <li>
              <Link
                href="/"
                className="hover:underline transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/biography"
                className="hover:underline transition-colors duration-200"
              >
                Biography
              </Link>
            </li>
            <li>
              <Link
                href="/news"
                className="hover:underline transition-colors duration-200"
              >
                News
              </Link>
            </li>
            <li>
              <Link
                href="/bibliography"
                className="hover:underline transition-colors duration-200"
              >
                Bibliography
              </Link>
            </li>
            <li>
              <Link
                href="/dictionary"
                className="hover:underline transition-colors duration-200"
              >
                Dictionary
              </Link>
            </li>
            <li>
              <Link
                href="/gallery"
                className="hover:underline transition-colors duration-200"
              >
                Gallery
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
