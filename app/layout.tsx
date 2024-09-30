import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import ClientLayout from "./clientLayout";

const inter = Inter({ subsets: ["latin"] });
//TODO: add satochi font
export const metadata: Metadata = {
  title: "Toon Central",
  description: "Afro Comics Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
