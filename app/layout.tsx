import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Government of Canada",
  description: "Government of Canada Application Framework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
