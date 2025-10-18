"use client";
import { useState } from "react";
import { useUser } from "@civic/auth-web3/react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "how", label: "Come funziona" },
  { id: "features", label: "Caratteristiche" },
  { id: "trust", label: "Fiducia" },
  { id: "tech", label: "Tech Stack" },
  { id: "usecases", label: "Use Cases" },
  { id: "roadmap", label: "Roadmap" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "Prova PAN" },
];

export default function PreviewHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signIn } = useUser();

  const handleSignIn = () => {
    signIn();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gray-900 bg-opacity-90 backdrop-blur border-b border-gray-800">
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="/preview" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold tracking-tight text-white">PanAI</span>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
          >
            <span className="sr-only">Open main menu</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6">
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-sm font-semibold transition-colors px-2 py-1 rounded text-white hover:text-green-400"
            >
              {section.label}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {user ? (
            <a href="/" className="text-sm font-semibold text-white hover:text-green-400 transition">
              Go to Dashboard →
            </a>
          ) : (
            <button
              onClick={handleSignIn}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-gray-900 p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <a href="/preview" className="-m-1.5 p-1.5">
                <span className="text-2xl font-bold tracking-tight text-white">PanAI</span>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-200"
              >
                <span className="sr-only">Close menu</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6">
                  <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {section.label}
                </a>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-700">
                {user ? (
                  <a
                    href="/"
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-white bg-green-500 hover:bg-green-600 text-center"
                  >
                    Go to Dashboard →
                  </a>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="w-full rounded-lg px-3 py-2 text-base font-semibold text-white bg-green-500 hover:bg-green-600"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
