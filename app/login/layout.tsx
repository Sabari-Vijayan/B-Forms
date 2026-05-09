import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to B-Forms to manage your forms and view submissions.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
