"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Nav() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-gradient-to-r from-red-800 via-red-700 to-red-800 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-red-800 font-bold text-lg">📅</span>
            </div>
            <h1 className="text-yellow-300 text-xl sm:text-2xl font-bold tracking-wide hover:text-yellow-200 transition-colors duration-200">
              SE Calendar
            </h1>
          </div>

          {/* User Section */}
          {session && (
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-2 bg-red-900/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="text-yellow-300 text-sm">
                  <p className="font-medium">
                    {session.user.title} {session.user.firstname} {session.user.lastname}
                  </p>
                </div>
              </div>
              
              {/* Mobile User Info */}
              <div className="sm:hidden flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-red-800 font-semibold text-sm">
                    {session.user.firstname?.[0]}{session.user.lastname?.[0]}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-red-700 font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
                onClick={handleLogout}
                aria-label="Sign out"
              >
                <span className="hidden sm:inline">ออกจากระบบ</span>
                <span className="sm:hidden">🚪</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
