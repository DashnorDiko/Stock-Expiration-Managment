"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/register", label: "Register" },
  { href: "/inventory", label: "Inventory" },
  { href: "/alerts", label: "Alerts" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white px-4 pb-3 pt-2 shadow-[0_-2px_16px_rgba(2,6,23,0.08)]">
      <ul className="mx-auto grid max-w-3xl grid-cols-3 gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(
                  "block rounded-xl px-3 py-2 text-center text-sm font-medium transition-colors",
                  isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

