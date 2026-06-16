import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Allen Diaz — full-stack developer. Skills, professional experience, education, and certifications.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Allen Diaz",
    description:
      "Skills, professional experience, education, and certifications of full-stack developer Allen Diaz.",
    url: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
