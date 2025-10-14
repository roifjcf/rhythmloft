import type { Metadata } from "next";
import { PlayerProvider } from "@/contexts/playerContext";
import "@/styles/main.scss";
import { LanguageProvider } from "@/contexts/languageContext";
import { SfxProvider } from "@/contexts/sfxContext";

export const metadata: Metadata = {
  title: "RhythmLoft | Relaxing Music Player & AI Chat Companion",
  description: "Listen to different types of music including lo-fi, synthwave, and more with original AI chat companions. Enjoy AI chat, daily encouragement, and productivity-enhancing features while focusing or studying.",
  keywords: [
    "lofi beats online",
    "lofi music",
    "online lofi player",
    "synthwave music",
    "productivity app",
    "pomodoro",
    "AI chat",
    "AI chat assistant",
    "AI character companion",
    "virtual character companion",
    "virtual companion",
    "ambient sounds",
    "study music",
    "focus music"
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
        <meta name="google-site-verification" content="2nOazwvlTyMgqSmihXt5bCsqzyYrkALjgiRsvtkoaIA" />
      </head>
      <body>
        <PlayerProvider>
          <LanguageProvider>
            <SfxProvider>
              {children}
            </SfxProvider>
          </LanguageProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}
