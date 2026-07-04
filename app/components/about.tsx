export default function About() {
  return (
    <section className="min-h-screen bg-[#f5f4ef] px-6 py-32 text-[#0a0a0a] sm:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium tracking-[0.28em] text-black/50 uppercase">
          About Us
        </p>
        <h2 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          A studio built for how modern brands actually grow.
        </h2>
        <div className="mt-16 grid gap-16 md:grid-cols-2">
          <p className="text-lg leading-relaxed text-black/70">
            Grey Room is a creative studio building brand systems, campaigns,
            and digital experiences for ambitious consumer companies. We pair
            rigorous design with the iteration speed of a product team &mdash;
            so brand work compounds instead of expiring on the quarter.
          </p>
          <p className="text-lg leading-relaxed text-black/70">
            We operate across identity, retention, performance creative, and
            retail media. One studio, one language, one thesis: modern brands
            are built as systems, not campaigns.
          </p>
        </div>
        <div className="mt-24 h-px bg-black/10" />
        <div className="mt-24 grid gap-10 md:grid-cols-3">
          {[
            { k: "12+", v: "brands scaled past $50M" },
            { k: "6", v: "disciplines under one roof" },
            { k: "2019", v: "studio founded" },
          ].map((s) => (
            <div key={s.k}>
              <p className="font-serif text-5xl tracking-tight">{s.k}</p>
              <p className="mt-3 text-sm text-black/60">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
