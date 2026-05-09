import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Form",
  description: "Configure your form, view responses, and analyze results.",
};

export default function FormManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
