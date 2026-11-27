import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { NavLink, Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Icons } from "@/lib/icons";
import { api } from "@/api/client";
import { clearSessionToken, getSessionToken } from "@/lib/api";
import SignIn from "@/screens/SignIn";
import Notes from "@/screens/Notes";

type SessionState = "checking" | "signed-in" | "signed-out" | "expired";

// A stored token only proves a session once existed; it may have since expired from
// inactivity (AC-007) or never existed at all. On every app load this restores the
// signed-in session by asking the server who it belongs to, /auth/me, rather than
// trusting the token on its own (AC-006, AC-009): the same check lets any browser or
// device that holds a still-valid token straight through to the same server-stored
// notes.
function useSessionState(): SessionState {
  const [state, setState] = useState<SessionState>(() =>
    getSessionToken() ? "checking" : "signed-out",
  );

  useEffect(() => {
    if (!getSessionToken()) {
      setState("signed-out");
      return;
    }
    let cancelled = false;
    api
      .GET("/auth/me")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          clearSessionToken();
          setState("expired");
        } else {
          setState("signed-in");
        }
      })
      .catch(() => {
        if (cancelled) return;
        clearSessionToken();
        setState("expired");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

// Notes is the owner's private list: without a session that the server still honors, a
// visit is sent back to sign-in. A session that used to exist but no longer validates
// shows the session-expired message there; one that never existed does not.
function RequireSession({ children }: { children: ReactElement }) {
  const state = useSessionState();

  if (state === "checking") return null;
  if (state === "expired") {
    return <Navigate to="/sign-in" state={{ expired: true }} replace />;
  }
  if (state === "signed-out") {
    return <Navigate to="/sign-in" replace />;
  }
  return children;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

// The app's menu, drawn around every screen except the ones routed outside it below.
function AppShellLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="border-b"
        style={{
          backgroundColor: "var(--brand-surface)",
          borderColor: "var(--brand-border)",
        }}
      >
        <div className="flex items-center gap-6 px-6 py-2">
          <p
            className="shrink-0 text-sm font-semibold"
            style={{ fontFamily: "var(--brand-font-heading)" }}
          >
            {"Notes"}
          </p>
          <nav aria-label="App menu" className="flex flex-wrap items-center gap-1">
            <NavLink to="/notes" className={navLinkClass}>
              <Icons.Home size={16} />
              {"Notes"}
            </NavLink>
            <NavLink to="/sign-in" className={navLinkClass}>
              <Icons.User size={16} />
              {"Sign out"}
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShellLayout />}>
        <Route
          path="/notes"
          element={
            <RequireSession>
              <Notes />
            </RequireSession>
          }
        />
      </Route>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}
