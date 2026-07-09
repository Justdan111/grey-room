import { notFound } from "next/navigation";
import { caseStudies } from "../data";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = caseStudies.find((c) => c.slug === slug);
  if (!caseStudy) return {};
  return {
    title: `${caseStudy.name} — Grey Room°`,
    description: caseStudy.blurb,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = caseStudies.find((c) => c.slug === slug);
  if (!caseStudy) notFound();

  return (
    <main className="min-h-svh bg-[#f5f4ef] text-[#0a0a0a]">
      <div className="mx-auto w-full max-w-7xl px-6 pt-36 pb-20 sm:px-10">
        <p className="text-xs font-medium tracking-[0.2em] text-black/50 uppercase">
          Case study
        </p>
        <h1 className="mt-4 font-serif text-6xl tracking-tight sm:text-7xl">
          {caseStudy.name}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-snug text-black/80">
          {caseStudy.blurb}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {caseStudy.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/25 px-3 py-1 text-xs font-medium text-black/80"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-14 overflow-hidden rounded-2xl">
          <video
            src={caseStudy.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="aspect-video w-full object-cover"
          />
        </div>
      </div>
    </main>
  );
}
