import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLocation } from "react-router-dom";

import { api } from "@/api/client";
import { setSessionToken } from "@/lib/api";
import { useNavigate } from "@/lib/navigate";

type Status = "idle" | "submitting" | "error";

// The owner is the only account this app ever has: there is no sign-up screen, and
// a failed attempt never says which field was wrong (AC-002 / NFR-003).
export default function Screen() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionExpired = Boolean((location.state as { expired?: boolean } | null)?.expired);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const submitting = status === "submitting";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setStatus("submitting");

    const { data, error } = await api.POST("/auth/login", {
      body: { email, password },
    });

    if (error || !data) {
      setStatus("error");
      return;
    }

    // The deployed API returns its opaque session token in the body (frontend and
    // API are on different origins, so a cookie cannot carry it): keep it so the
    // generated client sends it as the bearer on every later call.
    setSessionToken(data.token);
    navigate("notes");
  }

  function onEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    if (status === "error") setStatus("idle");
  }

  function onPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
    if (status === "error") setStatus("idle");
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-5 py-12"
      style={{ backgroundColor: "var(--brand-background)", color: "var(--brand-fg)" }}
    >
      <main className="w-full max-w-[420px]">
        <h1
          data-testid="sign-in-to-notes-title"
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--brand-font-heading)" }}
        >
          Sign in to Notes
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--brand-fg-muted)" }}>
          This app is private to its owner. Sign in with your email address and password.
        </p>

        {sessionExpired ? (
          <p
            role="status"
            className="mt-5 rounded-[var(--brand-radius)] border p-3 text-sm"
            style={{ borderColor: "var(--brand-border)", backgroundColor: "var(--brand-surface)" }}
          >
            Your session expired. Please sign in again.
          </p>
        ) : null}

        <form
          data-testid="owner-sign-in-form"
          className="mt-6 space-y-4"
          onSubmit={onSubmit}
          noValidate
        >
          {status === "error" ? (
            <p
              role="alert"
              className="rounded-[var(--brand-radius)] border p-3 text-sm font-medium"
              style={{
                borderColor: "var(--brand-border)",
                backgroundColor: "var(--brand-surface)",
              }}
            >
              Email or password is incorrect
            </p>
          ) : null}

          <div>
            <label htmlFor="owner-email" className="mb-1.5 block text-sm font-medium">
              Email address
            </label>
            <input
              data-testid="email-address-input"
              id="owner-email"
              name="email"
              type="email"
              autoComplete="username"
              inputMode="email"
              required
              disabled={submitting}
              value={email}
              onChange={onEmailChange}
              className="h-10 w-full rounded-[var(--brand-radius)] border px-3 text-sm outline-none disabled:opacity-60"
              style={{
                borderColor: "var(--brand-border)",
                backgroundColor: "var(--brand-surface)",
              }}
            />
          </div>

          <div>
            <label htmlFor="owner-password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              data-testid="password-input"
              id="owner-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={submitting}
              value={password}
              onChange={onPasswordChange}
              className="h-10 w-full rounded-[var(--brand-radius)] border px-3 text-sm outline-none disabled:opacity-60"
              style={{
                borderColor: "var(--brand-border)",
                backgroundColor: "var(--brand-surface)",
              }}
            />
          </div>

          <button
            data-testid="sign-in-btn"
            type="submit"
            disabled={submitting}
            className="h-10 w-full rounded-[var(--brand-radius)] text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </main>
    </div>
  );
}
