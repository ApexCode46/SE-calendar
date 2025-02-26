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
    <div className="flex fixed z-50 w-full h-12 items-center justify-start bg-red-800">
      <p className="pl-4 text-yellow-300 text-xl font-bold disabled">
        SE Calendar
      </p>

      {session && (
        <>
          <div className="flex items-center ml-auto">
            <p className="text-yellow-300">
              {session.user.title} {session.user.firstname}{" "}
              {session.user.lastname}
            </p>
            <button
              className="bg-amber-300 text-red-600 p-1 px-2 mx-3 rounded "
              onClick={handleLogout}
              aria-label="Sign out"
            >
              ออกจากระบบ
            </button>
          </div>
        </>
      )}
    </div>
  );
}
