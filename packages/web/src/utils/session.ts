import { useSession } from "@tanstack/react-start/server";

type SessionData = {
  access?: string;
  refresh?: string;
};

export function useAppSession() {
  return useSession<SessionData>({
    name: "auth",
    password: import.meta.env.VITE_SESSION_SECRET || "super_secret_session_password_fallback_for_dev",
    // Generate a random 32 character string for session secret fallback
    cookie: {
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secure: false, // Force false for debugging localhost issues
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  });
}
