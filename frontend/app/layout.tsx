import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Malayalam, Noto_Sans_Tamil } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TAGLINE } from "@/components/brand/logo";
import { PRELOADER_SCRIPT, Preloader } from "@/components/brand/preloader";
import { QueryProvider } from "@/components/providers";
import "./globals.css";

// D49: Inter for Latin + Noto for each Indian script.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const notoMl = Noto_Sans_Malayalam({ variable: "--font-noto-ml", subsets: ["malayalam"] });
const notoDeva = Noto_Sans_Devanagari({ variable: "--font-noto-deva", subsets: ["devanagari"] });
const notoTa = Noto_Sans_Tamil({ variable: "--font-noto-ta", subsets: ["tamil"] });

export const metadata: Metadata = {
  title: { default: "Kayal · കായൽ", template: "%s · Kayal" },
  description: `${TAGLINE} Voice and photo reporting for the Alappuzha backwaters.`,
  applicationName: "Kayal",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F3E6" },
    { media: "(prefers-color-scheme: dark)", color: "#14130F" },
  ],
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* One theme for the whole site: follows the device until the user picks, then remembered (decision 22 Nov, replaces D35). */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="kayal.theme" disableTransitionOnChange>
          <Preloader />
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
