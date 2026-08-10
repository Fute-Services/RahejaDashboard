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

// Mono is used only for the small chrome around the form (header meta, stat
// strip); the rest of the site is Space Grotesk, so scope this font to here.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

/** How long the screen takes to ease away once the credentials check out. */
const EXIT_MS = 300;

/**
 * The same three figures the landing screen opens with, in its order — the two
 * screens sit either side of the sign-in, so they carry the same proof.
 */
const STATS = [
  { value: "60+", label: "Years" },
  { value: "Pan-India", label: "Presence" },
  { value: "$6Bn", label: "Market cap" },
];

const Mail = (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3 7 8.15 5.4a1.5 1.5 0 0 0 1.7 0L21 7" />
  </svg>
);

const LockField = (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);

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

const Alert = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.25" />
    <path d="M12 7.5v5.25" />
    <path d="M12 16.4h.01" />
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
  const [capsLock, setCapsLock] = useState(false);
  const [loading, setLoading] = useState(false);

  // No auth backend yet: match the one hardcoded account, and on success mark
  // the session with a cookie the middleware checks to gate every other route.
  // Swap this for a real sign-in call when a backend lands.
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // The form is `noValidate` — the browser's own bubbles look nothing like
    // this card — so the empty case is answered here, in the card's own voice.
    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
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

  /**
   * Caps Lock silently breaks a password nobody can see, so watch for it on the
   * password field. Read off the event rather than tracked state: the key can
   * be toggled while the window is blurred, and this catches that on the next
   * keystroke either way.
   */
  function trackCapsLock(e: React.KeyboardEvent<HTMLInputElement>) {
    setCapsLock(e.getModifierState?.("CapsLock") ?? false);
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
          <div className={`${styles.mono} ${styles.eyebrow}`}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            WELCOME&nbsp;BACK
          </div>
          <h1 className={styles.title}>KRAHEJA</h1>
          <p className={styles.lede}>
            Sign in to manage your property portfolio, track projects and access
            secure documents.
          </p>
          <div className={styles.introFoot}>
            <div className={styles.rule} />
            {/*
             * The same figures the landing screen opens with, so the two sides
             * of the sign-in read as one story rather than two designs.
             */}
            <div className={styles.stats}>
              {STATS.map((stat) => (
                <div className={styles.stat} key={stat.label}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={`${styles.mono} ${styles.statLabel}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.formTitle}>Sign in</h2>
          <p className={styles.formSub}>
            Use your K Raheja Corp account to continue.
          </p>

          <form className={styles.fields} onSubmit={onSubmit} noValidate>
            <label className={styles.field}>
              <span className={styles.label}>Email address</span>
              <div className={styles.inputWrap}>
                <span className={styles.leadIcon} aria-hidden="true">
                  {Mail}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="name@krahejacorp.com"
                  autoComplete="email"
                  autoFocus
                  required
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                  className={styles.input}
                />
              </div>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Password</span>
              <div className={styles.inputWrap}>
                <span className={styles.leadIcon} aria-hidden="true">
                  {LockField}
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyUp={trackCapsLock}
                  onKeyDown={trackCapsLock}
                  onBlur={() => setCapsLock(false)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  aria-invalid={Boolean(error)}
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
              {capsLock && (
                <span className={styles.caps} role="status">
                  Caps Lock is on
                </span>
              )}
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
                <span className={styles.errorIcon}>{Alert}</span>
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
                <>
                  Sign in
                  <span className={styles.submitArrow} aria-hidden="true">
                    &#8594;
                  </span>
                </>
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
