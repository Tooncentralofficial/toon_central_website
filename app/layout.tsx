import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import ClientLayout from "./clientLayout";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
export const DEFAULT_OG_URL =
  "https://opengraph.b-cdn.net/production/images/c0948aa8-0335-4725-81fe-83d4992053f5.png?token=Wcdq71h3QMCLQaiVDnyOV43iKrK7BQM33Xcn-W9lkg0&height=705&width=1200&expires=33266806045";
//TODO: add satochi font
export const metadata: Metadata = {
  title: "Toon Central - Giving Africa a voice",
  description:
    "Discover Toon Central, the pioneering comic platform showcasing the black narrative with vibrant artistry and storytelling. Join a world where Marafiki (creators) bring stories ( Mafiki ) to life, combining African culture with innovative visuals, and connect with a community passionate about Afrocentric comics and animations. Dive into Toon Central today!",
  openGraph: {
    title: "Toon Central - Giving Africa a voice",
    description:
      "Discover Toon Central, the pioneering comic platform showcasing the black narrative with vibrant artistry and storytelling. Join a world where Marafiki (creators) bring stories ( Mafiki ) to life, combining African culture with innovative visuals, and connect with a community passionate about Afrocentric comics and animations. Dive into Toon Central today!",
    url: "https://tooncentralhub.com/",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_URL,
        width: 1200,
        height: 705,
        alt: "Toon Central - Giving Africa a voice",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@tooncentralhub",
    title: "Toon Central - Giving Africa a voice",
    description:
      "Discover Toon Central, the pioneering comic platform showcasing the black narrative with vibrant artistry and storytelling. Join a world where Marafiki (creators) bring stories ( Mafiki ) to life, combining African culture with innovative visuals, and connect with a community passionate about Afrocentric comics and animations. Dive into Toon Central today!",
    images: [
      {
        url: DEFAULT_OG_URL,
        width: 1200,
        height: 705,
        alt: "Toon Central - Giving Africa a voice",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          id="toon0"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6644042584456078"
          crossOrigin="anonymous"
        ></Script>
        <Script
          id="toon1"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RZFRHC7QTN"
        >
          <Script id="toon2">
            {` window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-RZFRHC7QTN');`}
          </Script>
        </Script>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
