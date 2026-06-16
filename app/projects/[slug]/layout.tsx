import type { Metadata } from "next";
import { projectsData } from "@/data/projects";
import { SITE } from "@/lib/site";

interface SlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((p) => p.id === slug);

  if (!project) {
    return {
      title: "Project",
      description: "Project details from Allen Diaz's portfolio.",
    };
  }

  const image = project.imageUrl ?? project.thumbnailUrl ?? SITE.ogImage;

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: {
      type: "article",
      title: `${project.title} | Allen Diaz`,
      description: project.description,
      url: `/projects/${project.id}`,
      images: [{ url: image, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Allen Diaz`,
      description: project.description,
      images: [image],
    },
  };
}

export default function ProjectSlugLayout({ children }: SlugLayoutProps) {
  return children;
}
