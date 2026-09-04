import type { Metadata } from "next";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ClientLayout from "./clientLayout";
import Script from "next/script";
import localFont from "next/font/local";

import PropellerAdsScript from "./Scripts";
import HeaderAd from "./_shared/headerAd";
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
        <PropellerAdsScript />
        {/* <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6644042584456078"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        /> */}

        <Script
          id="gtag-script"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RZFRHC7QTN"
          strategy="afterInteractive"
        />
        <Script id="gtag-setup" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RZFRHC7QTN');
        `}
        </Script>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
        {/* a fixed overlay, so it has to live in the body — a <div> in <head>
            makes the parser close <head> early and hydration mismatch */}
        <HeaderAd />
        <ClientLayout>{children}</ClientLayout>
        <Script id="xeelaa-config" strategy="afterInteractive">
          {`
            window.__EMBED_CONFIG__ = {
              publicToken: "tlJl0cJku5WaR7hUxLFM8AdHY0224l4fzCqRH7oc6NQua5A4rttjn29ECvCjsVmE",
              getUserToken: function() {
                return document.querySelector("meta[name=user-token]")?.content || null;
              },
              getUserId: function() {
                return document.querySelector("meta[name=user-id]")?.content || null;
              },
              getUserName: function() {
                return document.querySelector("meta[name=user-name]")?.content || null;
              },
              getUserEmail: function() {
                return document.querySelector("meta[name=user-email]")?.content || null;
              },
              getUserRole: function() {
                return document.querySelector("meta[name=user-role]")?.content || null;
              }
            };
          `}
        </Script>

        <Script
          src="https://xeelaa.com/widget.js?key=tlJl0cJku5WaR7hUxLFM8AdHY0224l4fzCqRH7oc6NQua5A4rttjn29ECvCjsVmE"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
