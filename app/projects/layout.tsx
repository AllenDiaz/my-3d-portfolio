import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore the full portfolio of projects by Allen Diaz — web, mobile, AI, full-stack, and data applications.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Allen Diaz",
    description:
      "Web, mobile, AI, full-stack, and data projects built by Allen Diaz.",
    url: "/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
