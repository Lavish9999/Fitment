import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FITMENT — Know what fits before you buy",
  description: "Evidence-driven firearm accessory compatibility research and build planning.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="siteHeader">
          <a className="brand" href="/">FITMENT</a>
          <nav aria-label="Primary navigation">
            <a href="/">Discover</a>
            <a href="/builder">Builder</a>
            <a href="/sign-in">Sign in</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
