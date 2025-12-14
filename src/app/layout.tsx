import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const rational = localFont({
  src: [
    {
      path: "../../public/font/rational/RationalText-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/font/rational/RationalText-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/font/rational/RationalText-Book.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/rational/RationalText-BookItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/font/rational/RationalText-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/rational/RationalText-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/font/rational/RationalText-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/font/rational/RationalText-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/font/rational/RationalText-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/font/rational/RationalText-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/font/rational/RationalText-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/font/rational/RationalText-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-rational",
});

export const metadata: Metadata = {
  title: "Hotel Manager App",
  description: "Manage hotel rooms, bookings, and staff efficiently",
  icons: {
    icon: "/logos/ANDINOH-FAV.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rational.variable} ${rational.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
