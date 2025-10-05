import type { Metadata } from "next";
import { PlayerProvider } from "@/contexts/playerContext";
import "@/styles/main.scss";
import { LanguageProvider } from "@/contexts/languageContext";

export const metadata: Metadata = {
  title: "rhythmloft | Online Lo-fi Music Player",
  description: "Listen to relaxing lo-fi music.",
  keywords: [
    "lofi beats",
    "anime lofi",
    "study music",
    "chill beats",
  ],
  authors: [{ name: "roifjcf" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="author" content="roifjcf"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <meta name="google-site-verification" content="2T2_NwItqAKWYw18LZDgFpbZpjMLKb3TDZLF-It4OWg" />
      </head>
      <body>
        <PlayerProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}
