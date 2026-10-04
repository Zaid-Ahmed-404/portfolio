"use client";

import { getDictionary, type Locale } from "@/i18n";
import { useDevice } from "@/lib/device";
import { lockScroll } from "@/lib/gsap";
import { completeTask, loaderStore, registerTask } from "@/lib/store";
import { useCallback, useEffect, useRef, useState } from "react";

/** The loader never stays longer than this, whatever is still loading. */
const MAX_MS = 2000;
/** …and never flashes by faster than this. */
const MIN_MS = 650;

/**
 * Full-screen intro with a real progress percentage: it waits for the web fonts
 * and (on WebGL tiers) the hero scene's first rendered frame. When done it adds
 * `is-ready` to <html>, which kicks off the hero's letter reveal.
 */
const Loader = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale);
  const t = dict.fx;
  const device = useDevice();

  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exiting" | "gone">("loading");
  const shown = useRef(0);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    document.documentElement.classList.add("is-ready");
    loaderStore.set({ done: true });
    lockScroll(false);
    setPhase("exiting");
    window.setTimeout(() => setPhase("gone"), 1000);
  }, []);

  // Register what we wait for.
  useEffect(() => {
    lockScroll(true);
    registerTask("fonts");
    document.fonts.ready.then(() => completeTask("fonts"));
    return () => lockScroll(false);
  }, []);

  useEffect(() => {
    // Only wait for the hero scene when it will actually render on screen now.
    if (device && device.tier !== "fallback" && window.scrollY < window.innerHeight) registerTask("hero");
  }, [device]);

  // Ease the displayed number towards the real progress.
  useEffect(() => {
    if (phase !== "loading") return;
    const start = performance.now();
    let raf = 0;

    const loop = () => {
      const elapsed = performance.now() - start;
      const { tasks: current } = loaderStore.get();
      const names = Object.keys(current);
      const real = names.length ? names.filter((n) => current[n]).length / names.length : 0;
      const allDone = names.length > 0 && real === 1;
      const timedOut = elapsed >= MAX_MS;

      // Time keeps the number creeping so it never looks stuck.
      const goal = allDone && elapsed >= MIN_MS ? 100 : timedOut ? 100 : Math.min(97, Math.max(real * 100, (elapsed / MAX_MS) * 90));

      shown.current += (goal - shown.current) * (goal === 100 ? 0.22 : 0.1);
      const value = Math.min(100, Math.round(shown.current));
      setPercent(value);

      if (value >= 100) {
        finish();
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, finish]);

  if (phase === "gone") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={t.loading}
      data-state={phase}
      className={`loader-root no-print fixed inset-0 z-[110] flex-col justify-between bg-bg px-5 py-8 transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] sm:px-10 sm:py-10 ${
        phase === "exiting" ? "[clip-path:inset(0_0_100%_0)]" : "[clip-path:inset(0_0_0_0)]"
      }`}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-display text-lg font-semibold text-fg">{dict.profile.name}</span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{dict.profile.role}</span>
        </div>
        <button
          type="button"
          onClick={finish}
          className="rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-line-strong hover:text-fg"
        >
          {t.skipIntro}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-6">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{t.loading}</span>
          <span dir="ltr" className="font-display text-[22vw] font-semibold leading-[0.8] tracking-[-0.06em] text-fg tabular-nums sm:text-[14vw]">
            {String(percent).padStart(3, "0")}
            <span className="text-accent">%</span>
          </span>
        </div>
        <div className="h-px w-full bg-line">
          <div
            className="h-full bg-accent shadow-[0_0_12px_var(--accent)] ltr:origin-left rtl:origin-right"
            style={{ transform: `scaleX(${percent / 100})` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
