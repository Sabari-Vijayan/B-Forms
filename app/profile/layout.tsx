import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your account settings and profile details.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
