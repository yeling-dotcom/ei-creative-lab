import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ei Creative Lab — Tiny art, big personality",
    template: "%s · Ei Creative Lab",
  },
  description: "Custom chibi portraits, stickers, and playful illustration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="logo" href="/">ei<span>✦</span>lab</Link>
          <nav>
            <Link href="/gallery">Gallery</Link>
            <Link href="/order">Order</Link>
            <Link href="/contact">Contact</Link>
            <Link className="studio-link" href="/admin/orders">Studio</Link>
          </nav>
        </header>
        {children}
        <footer><p>Drawn with joy in Kuala Lumpur.</p><p>© {new Date().getFullYear()} Ei Creative Lab</p></footer>
      </body>
    </html>
  );
}
