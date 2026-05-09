import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Form",
  description: "Share your form with the world using a public link or QR code.",
};

export default function ShareFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
