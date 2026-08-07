"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JetBrains_Mono } from "next/font/google";
import {
  AUTH_COOKIE,
  AUTH_MAX_AGE,
  DEMO_EMAIL,
  DEMO_PASSWORD,
} from "@/lib/auth";
import styles from "./login.module.css";

// Mono is used only for the small chrome around the form (header meta, brand
// tagline); the rest of the site is Space Grotesk, so scope this font to here.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

/** How long the screen takes to ease away once the credentials check out. */
const EXIT_MS = 300;

const Eye = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOff = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M6.6 6.6A18.5 18.5 0 0 0 1 12s4 8 11 8a9.1 9.1 0 0 0 5.4-1.6" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="m1 1 22 22" />
  </svg>
);

const Lock = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4" y="10.5" width="16" height="11" rx="2.5" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(false);

  // No auth backend yet: match the one hardcoded account, and on success mark
  // the session with a cookie the middleware checks to gate every other route.
  // Swap this for a real sign-in call when a backend lands.
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok =
      email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
    if (!ok) {
      setError("That email and password don't match an account.");
      return;
    }
    // Loading stays on through the route change — the landing screen takes a
    // beat to load, so the spinner covers that gap instead of a blank flash.
    setLoading(true);
    // Unchecked "keep me signed in" leaves off max-age, making it a session
    // cookie that dies with the browser.
    const life = remember ? `; max-age=${AUTH_MAX_AGE}` : "";
    document.cookie = `${AUTH_COOKIE}=1; path=/${life}; samesite=lax`;
    // The screen eases away first, so the landing fades up out of it rather
    // than cutting in over a still-lit form.
    window.setTimeout(() => {
      router.push("/");
      router.refresh();
    }, EXIT_MS);
  }

  return (
    <div
      className={`${styles.page} ${jetbrains.variable} ${
        loading ? styles.leaving : ""
      }`}
    >
      {/*
       * The photograph is a 2.45:1 frame — the tower shot with its own plaza and
       * sea mirrored outwards on both sides — so it fills any screen edge to
       * edge with the building always whole, and never falls back to bars.
       */}
      <div className={styles.hero} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- bundled art direction; keeps the site's raw-<img> convention */}
        <img className={styles.heroImg} src="/brand/login-hero.jpg" alt="" />
        <div className={styles.heroWash} />
      </div>

      <header className={styles.header}>
        <span className={styles.brandBadge}>
          {/* eslint-disable-next-line @next/next/no-img-element -- bundled brand asset; keeps the site's raw-<img> convention */}
          <img
            className={styles.brandLogo}
            src="/brand/k-raheja-corp.png"
            width={198}
            height={258}
            alt="K Raheja Corp"
          />
        </span>
        <div className={`${styles.mono} ${styles.headerMeta}`}>
          PROPERTY&nbsp;PORTFOLIO&nbsp;PORTAL
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.intro}>
          <h1 className={styles.title}>KRAHEJA</h1>
          <p className={styles.lede}>
            Sign in to manage your property portfolio, track projects and access
            secure documents.
          </p>
          <div className={styles.introFoot}>
            <div className={styles.rule} />
            <div className={`${styles.mono} ${styles.tagline}`}>
              BUILT&nbsp;TO&nbsp;LAST
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.formTitle}>Sign in</h2>
          <p className={styles.formSub}>
            Use your K Raheja Corp account to continue.
          </p>

          <form className={styles.fields} onSubmit={onSubmit}>
            <label className={styles.field}>
              <span className={styles.label}>Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="name@krahejacorp.com"
                autoComplete="email"
                required
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Password</span>
              <div className={styles.inputWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className={`${styles.input} ${styles.inputPassword}`}
                />
                <button
                  type="button"
                  className={styles.eye}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? EyeOff : Eye}
                </button>
              </div>
            </label>

            <div className={styles.row}>
              <label className={styles.remember}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className={styles.checkbox}
                />
                Keep me signed in
              </label>
              <button
                type="button"
                className={styles.forgot}
                onClick={() => setShowHelp((v) => !v)}
                aria-expanded={showHelp}
              >
                Forgot password?
              </button>
            </div>

            {showHelp && (
              <p className={styles.help}>
                Portal access is issued by your administrator. Contact the K
                Raheja Corp IT team to have your password reset.
              </p>
            )}

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className={styles.note}>
            {Lock}
            Authorised access only. Activity on this portal is monitored.
          </p>
        </section>
      </main>
    </div>
  );
}
