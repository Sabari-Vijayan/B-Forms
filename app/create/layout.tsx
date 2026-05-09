import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Form",
  description: "Describe your ideal form in natural language and let our AI build it for you.",
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
