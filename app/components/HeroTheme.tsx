"use client";

import { createContext, useContext, useState } from "react";

type HeroThemeValue = {
  bgIsDark: boolean;
  setBgDark: (dark: boolean) => void;
};

const HeroThemeContext = createContext<HeroThemeValue>({
  bgIsDark: false,
  setBgDark: () => {},
});

export function HeroThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bgIsDark, setBgDark] = useState(false);
  return (
    <HeroThemeContext.Provider value={{ bgIsDark, setBgDark }}>
      {children}
    </HeroThemeContext.Provider>
  );
}

export function useHeroTheme() {
  return useContext(HeroThemeContext);
}