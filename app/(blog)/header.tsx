import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-accent-2 bg-white">
      <div className="container mx-auto px-5">
        <nav className="flex items-center justify-between py-6">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Albert Vigoleis Thelen
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
                href="/news"
                className="hover:underline transition-colors duration-200"
              >
                News
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
