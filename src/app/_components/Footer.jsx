"use client";

export default function Footer() {
  return (
    <footer className="bg-red-600 text-white py-8 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <h2 className="text-xl font-bold">Jamal Hospital</h2>

        {/* Links */}
        <div className="space-x-6 mt-4 md:mt-0">
          <a href="/" className="hover:text-gray-200">
            Home
          </a>
          <a href="/about" className="hover:text-gray-200">
            About
          </a>
          <a href="/departments" className="hover:text-gray-200">
            Departments
          </a>
          <a href="/contact" className="hover:text-gray-200">
            Contact
          </a>
        </div>

        {/* Copyright */}
        <p className="mt-4 md:mt-0 text-sm text-gray-200">
          © {new Date().getFullYear()} Jamal Hospital. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
