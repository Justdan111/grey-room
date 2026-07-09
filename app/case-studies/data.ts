export type CaseStudy = {
  slug: string;
  name: string;
  blurb: string;
  tags: string[];
  video: string;
  image: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "meridian",
    name: "Meridian",
    blurb:
      "Rebuilt the DTC flagship & lifted conversion 38% in a single quarter.",
    tags: ["websites", "ecommerce ux"],
    video: "/cases/meridian.mp4",
    image: "/cases/meridian.jpg",
  },
  {
    slug: "solene",
    name: "Solene",
    blurb:
      "Brand system & launch campaign that sold out the first drop in 48 hours.",
    tags: ["branding", "campaign"],
    video: "/cases/solene.mp4",
    image: "/cases/solene.jpg",
  },
  {
    slug: "halcyon",
    name: "Halcyon",
    blurb:
      "Built a retention program delivering a repeat-purchase rate 2.4x the category benchmark.",
    tags: ["retention", "lifecycle"],
    video: "/cases/halcyon.mp4",
    image: "/cases/halcyon.jpg",
  },
  {
    slug: "kindred",
    name: "Kindred",
    blurb:
      "Restructured Amazon presence & drove a 126% revenue increase in three months.",
    tags: ["retail media", "amazon"],
    video: "/cases/kindred.mp4",
    image: "/cases/kindred.jpg",
  },
  {
    slug: "atlas",
    name: "Atlas",
    blurb:
      "A performance creative engine shipping 200+ assets a month at 31% lower CAC.",
    tags: ["performance creative", "content systems"],
    video: "/cases/atlas.mp4",
    image: "/cases/atlas.jpg",
  },
];
