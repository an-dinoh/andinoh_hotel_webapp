"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/bookings", label: "Bookings" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const linkClass = "text-lg font-semibold text-gray-700 hover:text-green ";
  return (
<nav className="flex items-center justify-between px-24 py-3 bg-white shadow-none relative border-b border-gray-200">

      {/* Logo */}
      <div className="flex items-center space-x-2">
        {/* Logo container */}
        <div className="relative w-16 h-16 sm:w-14 sm:h-12">
          <Image
            className="light:invert object-contain"
            src="/next.svg"
            alt="Logo"
            fill
            priority
          />
        </div>

        {/* Optional text beside it */}
        {/* <span className="font-semibold text-lg">Hotel Manager</span> */}
      </div>

      {/* Desktop Menu Links */}
      <div className="hidden md:flex space-x-6">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className={linkClass}>
            {link.label}
          </Link>
        ))}
      </div>

      <button
        className="md:hidden p-2 text-gray"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {menuOpen && (
        <div className="abosolute top-full left-0 w-full bg-white shadown-md flex flex-col items-start px-6 py-4 space-y-3 md:hidden z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
