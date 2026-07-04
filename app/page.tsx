import Hero from "./components/Hero";
import { HeroThemeProvider } from "./components/HeroTheme";
import Nav from "./components/Nav";

export default function Home() {
  return (
    <HeroThemeProvider>
      <Nav />
      <Hero />
    </HeroThemeProvider>
  );
}
