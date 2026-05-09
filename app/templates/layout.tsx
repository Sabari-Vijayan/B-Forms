import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates",
  description: "Choose from a variety of pre-built form templates to get started quickly.",
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
