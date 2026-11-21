import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Malayalam, Noto_Sans_Tamil } from "next/font/google";
import { QueryProvider } from "@/components/providers";
import "./globals.css";

// D49: Inter for Latin + Noto for each Indian script.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const notoMl = Noto_Sans_Malayalam({ variable: "--font-noto-ml", subsets: ["malayalam"] });
const notoDeva = Noto_Sans_Devanagari({ variable: "--font-noto-deva", subsets: ["devanagari"] });
const notoTa = Noto_Sans_Tamil({ variable: "--font-noto-ta", subsets: ["tamil"] });

export const metadata: Metadata = {
  title: { default: "Kayal · കായൽ", template: "%s · Kayal" },
  description: "Speak up for the backwaters. Voice and photo reporting for Alappuzha.",
  applicationName: "Kayal",
};

export const viewport: Viewport = {
  themeColor: "#1F4D3A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${notoMl.variable} ${notoDeva.variable} ${notoTa.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
