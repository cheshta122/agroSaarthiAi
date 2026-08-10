import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "D" },
  { href: "/assistant", label: "Assistant", icon: "A" },
  { href: "/knowledge-base", label: "Knowledge Base", icon: "K" },
  { href: "/about", label: "About", icon: "I" }
];

export const metadata: Metadata = {
  title: "AgroSaarthi AI",
  description: "Agricultural advisory dashboard and assistant for Haryana farmers"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <aside className="sidebar" aria-label="Primary navigation">
            <Link className="brand" href="/dashboard">
              <span className="brand-mark">AS</span>
              <span>
                <strong>AgroSaarthi</strong>
                <small>AI Advisory</small>
              </span>
            </Link>
            <nav className="nav-list">
              {navItems.map((item) => (
                <Link className="nav-link" href={item.href} key={item.href}>
                  <span className="nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="sidebar-note">
              <span className="status-dot" />
              <p>Backend endpoint: `/ask`</p>
            </div>
          </aside>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
