import CaseStudiesHero from "../components/CaseStudiesHero";

export const metadata = {
  title: "Case Studies — Grey Room°",
  description:
    "Selected work from Grey Room: brand systems, retention programs, and ecommerce experiences for modern consumer brands.",
};

export default function Page() {
  return (
    <main className="bg-[#f5f4ef]">
      <CaseStudiesHero />
    </main>
  );
}
