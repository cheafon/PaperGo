"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Home
            </Link>
            <Link
              href="/diagram"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/diagram"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Visualization
            </Link>
              <Link
                  href="/diagram"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === "/diagram"
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                  Assistant
              </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
