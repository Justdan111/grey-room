import Hero from "./components/Hero";
import Journey from "./components/Journey";
import Pillars from "./components/Pillars";

export default function Home() {
  return (
  <div>
    <Hero />
    <Pillars />
    <div id="dark-zone-end" />
    <Journey />
    {/* Marker for where the dark zone ends; Pillars' nav-theme trigger reads it */}
    
  </div>
  );
}
