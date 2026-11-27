// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Check, Clock, AlertCircle } = Icons;

const PRODUCT = "Notes";
const OWNER_EMAIL = "mara.ellison@proton.me";
const MIN_PASSWORD = 8;
const IDLE_MINUTES = 30;
const mix = (colour, percent) => `color-mix(in srgb, ${colour} ${percent}%, transparent)`;

export default function Screen() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phase, setPhase] = React.useState("idle"); // idle | checking | error | success
  const errorRef = React.useRef(null);

  const glass = { backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: brand.radius };
  const glow = `0 20px 60px -10px ${mix(brand.primaryColor, 70)}`;

  React.useEffect(() => {
    if (phase !== "checking") return undefined;
    const matches = email.trim().toLowerCase() === OWNER_EMAIL && password.length >= MIN_PASSWORD;
    const id = setTimeout(() => setPhase(matches ? "success" : "error"), 700);
    return () => clearTimeout(id);
  }, [phase, email, password]);

  React.useEffect(() => {
    if (phase !== "success") return undefined;
    const id = setTimeout(() => navigate("notes"), 500);
    return () => clearTimeout(id);
  }, [phase]);

  React.useEffect(() => {
    if (phase === "error" && errorRef.current) errorRef.current.focus();
  }, [phase]);

  const busy = phase === "checking" || phase === "success";

  const onSubmit = (e) => {
    e.preventDefault();
    if (busy) return;
    setPhase("checking");
  };

  const fieldClass = "np-focus h-12 w-full px-4 text-sm text-white placeholder:text-white/35 outline-none disabled:opacity-60";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 text-white" style={{ fontFamily: brand.fontBody, backgroundColor: brand.backgroundColor }}>
      <style>{`
        .np-focus:focus-visible { outline: 2px solid ${brand.accentColor}; outline-offset: 3px; }
        @keyframes np-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes np-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes np-spin { to { transform: rotate(360deg); } }
        .np-rise { animation: np-rise 320ms cubic-bezier(.2,.7,.3,1) both; }
        .np-pulse { animation: np-pulse 1.6s ease-in-out infinite; }
        .np-spin { animation: np-spin 800ms linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .np-rise, .np-pulse, .np-spin { animation: none !important; }
          .np-press { transition: none !important; }
        }
      `}</style>

      <div aria-hidden className="pointer-events-none absolute -left-32 top-[-120px] h-[520px] w-[520px] rounded-full blur-[120px]" style={{ backgroundColor: mix(brand.primaryColor, 70) }} />
      <div aria-hidden className="pointer-events-none absolute bottom-[-160px] right-[-80px] h-[560px] w-[560px] rounded-full blur-[130px]" style={{ backgroundColor: mix(brand.accentColor, 60) }} />
      <p className="absolute left-6 top-7 text-lg font-bold sm:left-10 sm:top-8" style={{ fontFamily: brand.fontHeading }}>{PRODUCT}</p>

      <main className="relative w-full max-w-[460px] p-7 backdrop-blur-2xl sm:p-10" style={{ ...glass, boxShadow: "0 40px 120px -20px rgba(0,0,0,0.6)" }}>
        <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: mix(brand.accentColor, 25), color: "#fff" }}>
          <span aria-hidden className="np-pulse inline-block h-2 w-2 rounded-full" style={{ backgroundColor: brand.primaryColor }} />
          Private — one owner
        </p>

        <h1 data-wf="b-0-0" className="mt-5 text-4xl font-extrabold leading-tight tracking-tight" style={{ fontFamily: brand.fontHeading }}>
          Sign in to Notes
        </h1>

        <div data-wf="b-1-0" className="mt-3">
          <p className="text-sm leading-relaxed text-white/70">
            This app is private to its owner. There is no sign-up — only the owner account can sign in.
          </p>
          <p className="mt-2 text-xs text-white/45">Free for the owner. No payment, billing or subscription — ever.</p>
        </div>

        {phase === "success" ? (
          <div className="np-rise mt-8 p-5" style={{ ...glass, boxShadow: glow }}>
            <p role="status" className="flex items-center gap-2 text-sm font-bold">
              <Check aria-hidden className="h-4 w-4" style={{ color: brand.primaryColor }} />
              Signed in. Opening your notes…
            </p>
            <p className="mt-2 text-xs text-white/55">Your notes live on the server, so they follow you to any browser.</p>
          </div>
        ) : (
          <form data-wf="b-2-0" className="mt-8" onSubmit={onSubmit} noValidate>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/50" style={{ fontFamily: brand.fontHeading }}>
              Owner sign-in
            </h2>

            {phase === "error" ? (
              <div
                ref={errorRef}
                tabIndex={-1}
                role="alert"
                className="np-rise np-focus mt-4 flex items-start gap-3 p-4"
                style={{ ...glass, borderColor: mix(brand.accentColor, 55), boxShadow: `0 20px 60px -20px ${mix(brand.accentColor, 70)}` }}
              >
                <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" style={{ color: brand.accentColor }} />
                <p className="text-sm leading-relaxed">
                  <span className="font-bold">That email and password don’t match the owner account.</span>{" "}
                  <span className="text-white/70">Nothing was sent anywhere else. Your email is still filled in — retype the password and try again.</span>
                </p>
              </div>
            ) : null}

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="owner-email" className="mb-1.5 block text-sm font-semibold text-white/85">Email address</label>
                <input
                  data-wf="i-2-0-0"
                  id="owner-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  required
                  disabled={busy}
                  placeholder="you@yourdomain.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (phase === "error") setPhase("idle"); }}
                  aria-invalid={phase === "error"}
                  aria-describedby={phase === "error" ? undefined : "owner-email-hint"}
                  className={fieldClass}
                  style={{ ...glass, fontVariantNumeric: "tabular-nums" }}
                />
                <p id="owner-email-hint" className="mt-1.5 text-xs text-white/45">The address the owner account was set up with.</p>
              </div>

              <div>
                <label htmlFor="owner-password" className="mb-1.5 block text-sm font-semibold text-white/85">Password</label>
                <input
                  data-wf="i-2-0-1"
                  id="owner-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={busy}
                  placeholder="&lt;your-owner-password&gt;"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (phase === "error") setPhase("idle"); }}
                  aria-invalid={phase === "error"}
                  className={fieldClass}
                  style={glass}
                />
              </div>
            </div>

            <button
              data-wf="b-3-0"
              type="submit"
              disabled={busy}
              className="np-focus np-press mt-6 flex h-12 w-full items-center justify-center gap-2 text-sm font-bold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99] disabled:scale-100 disabled:opacity-75"
              style={{ background: `linear-gradient(90deg, ${brand.primaryColor}, ${brand.accentColor})`, borderRadius: brand.radius, boxShadow: glow }}
            >
              {phase === "checking" ? (
                <>
                  <span aria-hidden className="np-spin inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />
                  Checking your details…
                </>
              ) : (
                <>Sign in</>
              )}
            </button>

            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-white/45">
              <Clock aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                You stay signed in while you’re writing. After {IDLE_MINUTES} minutes idle — or when you sign out — the session ends and you’ll sign in again.
              </span>
            </p>
          </form>
        )}
      </main>
    </div>
  );
}
