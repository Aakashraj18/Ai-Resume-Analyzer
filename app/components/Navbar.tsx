import { Link } from "react-router";
import { useAuth } from "~/lib/auth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="text-xl font-bold text-gradient">ATS GENIUS</span>
      </Link>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              Dashboard
            </Link>
            <Link to="/upload" className="primary-button !py-2 !px-4 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Analyze
            </Link>
            <div className="flex items-center gap-2 ml-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <span className="text-emerald-400 text-sm font-semibold">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <span className="text-sm text-slate-400 hidden md:block">
                {user?.username}
              </span>
              <button
                onClick={logout}
                className="text-sm text-slate-500 hover:text-rose-400 transition-colors cursor-pointer ml-1"
              >
                Sign Out
              </button>
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
