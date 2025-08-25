import type { Metadata } from "next";
import { Inter } from "next/font/google";

const alternate = "https://tooncentralhub.com/static/images/login.png";

const images = [
  {
    url: alternate,
    width: 1200,
    height: 630,
    alt: "Toon Central Comic Hub",
  },
  {
    url: alternate,
    width: 800,
    height: 420,
    alt: "Toon Central Comic Hub",
  },
  {
    url:  alternate,
    width: 600,
    height: 315,
    alt: "Toon Central Comic Hub",
  },
];

export const metadata: Metadata = {
  title: "Toon Central - Endless Comics, Endless stories.",
  description:
    " Read Anywhere. Create Anytime. Get started with us to unlock a world of comics and creativity",
  openGraph: {
    title: "Toon Central - creator hub",
    description:
      " Read Anywhere. Create Anytime. Get started with us to unlock a world of comics and creativity",
    url: "https://tooncentralhub.com/creator",
    type: "website",
    images: images,
  },
  twitter: {
    card: "summary_large_image",
    site: "@tooncentralhub",
    title: "Toon Central - creator hub",
    description:
      " Read Anywhere. Create Anytime. Get started with us to unlock a world of comics and creativity",
    images: images,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    {children}
  );
}
