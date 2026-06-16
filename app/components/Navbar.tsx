import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "~/lib/auth";
import { useTheme } from "~/lib/theme";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar relative z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="text-xl font-bold text-white hidden sm:block">ATS GENIUS</span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all duration-300 cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className="text-sm text-slate-400 hover:text-emerald-400 transition-colors hidden md:block"
            >
              Dashboard
            </Link>
            <Link
              to="/hr-portal"
              className="text-sm text-slate-400 hover:text-emerald-400 transition-colors hidden md:block"
            >
              Practice Interviews
            </Link>
            <Link to="/upload" className="primary-button !py-2 !px-4 text-sm hidden sm:flex">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Analyze
            </Link>

            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center cursor-pointer hover:bg-emerald-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <span className="text-emerald-400 text-sm font-semibold">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-card border border-white/10 shadow-xl overflow-hidden animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                  <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                    <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white md:hidden"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/hr-portal"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white md:hidden"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Practice Interviews
                    </Link>
                    <Link
                      to="/upload"
                      className="block px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 sm:hidden"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Analyze Resume
                    </Link>
                  </div>
                  
                  <div className="py-1 border-t border-white/5">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/auth" className="primary-button !py-2 !px-4 text-sm">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
