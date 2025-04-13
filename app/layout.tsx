import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import ClientLayout from "./clientLayout";
import Script from "next/script";
import localFont from "next/font/local";
import Scripts from "./Scripts";
const inter = Inter({ subsets: ["latin"] });
export const DEFAULT_OG_URL = `https://tooncentralhub.com/opengraph-image.png`;

const satoshi = localFont({
  src: [
    {
      path: "/fonts/Satoshi-Light.otf",
      weight: "300",
    },

    {
      path: "/fonts/Satoshi-Regular.otf",
      weight: "400",
    },
    {
      path: "/fonts/Satoshi-Bold.otf",
      weight: "700",
    },
  ],
  variable: "--font-satoshi-bold",
});

// const satoshiRegular = localFont({
//   src: "/fonts/Satoshi-Regular.otf",
//   weight: "400",
// });

// const satoshiBold = localFont({
//   src: "./fonts/Satoshi-Bold.otf",
//   weight: "700",
//   variable:"--font-satoshi-bold"

// });

const images = [
  {
    url: DEFAULT_OG_URL,
    width: 1200,
    height: 630,
    alt: "Toon Central Comic Hub",
  },
  {
    url: DEFAULT_OG_URL,
    width: 800,
    height: 420,
    alt: "Toon Central Comic Hub",
  },
  {
    url: DEFAULT_OG_URL,
    width: 600,
    height: 315,
    alt: "Toon Central Comic Hub",
  },
];
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
    images: images,
  },

  twitter: {
    card: "summary_large_image",
    site: "@tooncentralhub",
    title: "Toon Central - Giving Africa a voice",
    description:
      "Discover Toon Central, the pioneering comic platform showcasing the black narrative with vibrant artistry and storytelling. Join a world where Marafiki (creators) bring stories ( Mafiki ) to life, combining African culture with innovative visuals, and connect with a community passionate about Afrocentric comics and animations. Dive into Toon Central today!",
    images: images,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="monetag" content="b1560b2812f90a46572fbf59094c6458" />
      </head>
      <body className={` ${satoshi.className} `}>
         <Scripts />
        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6644042584456078"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <Script
          id="gtag-script"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RZFRHC7QTN"
        />
        <Script id="gtag-setup" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RZFRHC7QTN');
        `}
        </Script>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
