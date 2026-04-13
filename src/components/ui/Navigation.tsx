"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/search", label: "Search" },
  { href: "/saved", label: "Saved" },
  { href: "/history", label: "History" },
  { href: "/stats", label: "Stats" },
  { href: "/settings", label: "Settings" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-800 bg-gray-950">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-cyan-400">
          MyDietTracker
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-cyan-400/10 text-cyan-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="ml-3 border-l border-gray-700 pl-3">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
