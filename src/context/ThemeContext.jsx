import { createContext, useContext, useEffect, useMemo } from "react";
import { THEMES } from "../data/themes";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getPlayerLevel } from "../data/levelPerks";

const ThemeContext = createContext(null);

function getSeasonalTheme() {
  const month = new Date().getMonth() + 1;
  return THEMES.find((t) => t.seasonal && t.seasonMonths?.includes(month)) || null;
}

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useLocalStorage("trivia_settings", {});
  const selectedId = settings.theme || null;

  const activeTheme = useMemo(() => {
    if (selectedId) {
      const chosen = THEMES.find((t) => t.id === selectedId);
      if (chosen) return chosen;
    }
    return getSeasonalTheme() || THEMES[0];
  }, [selectedId]);

  useEffect(() => {
    const root = document.documentElement;
    const { colors } = activeTheme;
    root.style.setProperty("--theme-primary-500", colors.primary500);
    root.style.setProperty("--theme-primary-300", colors.primary300);
    root.style.setProperty("--theme-primary-400", colors.primary400);
    root.style.setProperty("--theme-primary-600", colors.primary600);
    root.style.setProperty("--theme-accent", colors.accent);
    root.style.setProperty("--theme-accent-light", colors.accentLight);
    root.style.setProperty("--theme-background", colors.background);
    root.style.setProperty("--theme-glow1", colors.glow1);
    root.style.setProperty("--theme-glow2", colors.glow2);
    root.style.setProperty("--theme-glow3", colors.glow3);
    document.body.style.background = colors.background;
  }, [activeTheme]);

  const setTheme = (themeId) => {
    setSettings((prev) => ({ ...prev, theme: themeId }));
  };

  const playerLevel = getPlayerLevel();
  const availableThemes = THEMES.filter(
    (t) => !t.unlockLevel || playerLevel >= t.unlockLevel,
  );
  const lockedThemes = THEMES.filter(
    (t) => t.unlockLevel && playerLevel < t.unlockLevel,
  );

  return (
    <ThemeContext.Provider
      value={{ activeTheme, setTheme, availableThemes, lockedThemes, selectedId }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
