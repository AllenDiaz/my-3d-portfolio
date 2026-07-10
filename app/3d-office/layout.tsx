import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Office",
  description:
    "Step inside Allen Diaz's interactive 3D office — click the monitors, desk items, and gadgets to explore projects, skills, and experience in an immersive WebGL workspace.",
  alternates: { canonical: "/3d-office" },
  openGraph: {
    title: "3D Office | Allen Diaz",
    description:
      "An interactive 3D developer office built with React Three Fiber. Explore projects, skills, and experience by clicking around the scene.",
    url: "/3d-office",
  },
};

export default function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
