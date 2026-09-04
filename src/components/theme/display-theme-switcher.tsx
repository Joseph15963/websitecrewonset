import { useEffect, useState } from "react";

export type DisplayTheme = "light" | "dark";

const STORAGE_KEY = "cos.display.theme";

export function getDisplayTheme(): DisplayTheme {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

export function applyDisplayTheme(theme: DisplayTheme) {
  document.documentElement.dataset.displayTheme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent("cos:display-theme", { detail: theme }));
}

export function DisplayThemeSwitcher({ admin = false }: { admin?: boolean }) {
  const [theme, setTheme] = useState<DisplayTheme>("light");

  useEffect(() => {
    const current = getDisplayTheme();
    setTheme(current);
    applyDisplayTheme(current);
  }, []);

  function select(next: DisplayTheme) {
    setTheme(next);
    applyDisplayTheme(next);
  }

  return (
    <div className="display-theme-switcher" aria-label={`${admin ? "Admin" : "Player"} display theme`}>
      <p className="mb-3 text-xs font-black uppercase tracking-[.16em] text-current/55">Display theme</p>
      <div className="flex gap-2" role="group" aria-label="Choose display theme">
        {(["light", "dark"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={theme === option}
            onClick={() => select(option)}
            className={`rounded-md border px-4 py-2 text-xs font-black uppercase tracking-wider transition ${theme === option ? "border-coral bg-coral text-white" : "border-current/15 bg-current/5 text-current/65 hover:border-coral/60"}`}
          >
            {option}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-current/50">Choose the visual treatment for this display. Your preference is saved on this device.</p>
    </div>
  );
}

export function useDisplayTheme() {
  const [theme, setTheme] = useState<DisplayTheme>("light");
  useEffect(() => {
    const sync = () => setTheme(getDisplayTheme());
    sync();
    window.addEventListener("cos:display-theme", sync);
    return () => window.removeEventListener("cos:display-theme", sync);
  }, []);
  return theme;
}
