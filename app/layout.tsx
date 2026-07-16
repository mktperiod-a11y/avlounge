import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AV라운지 | 배우 랭킹·품번 검색·작품 찾기",
  description:
    "배우 랭킹부터 배우 찾기, 전체 품번 목록과 보관함까지 한곳에서 탐색하는 AV 정보 인덱스.",
  applicationName: "AV라운지",
  keywords: ["AV라운지", "배우 랭킹", "품번 검색", "배우 찾기", "품번 목록"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "AV라운지",
    description: "배우부터 품번까지, 취향이 머무는 곳.",
    type: "website",
    locale: "ko_KR",
    siteName: "AV라운지",
  },
  twitter: {
    card: "summary",
    title: "AV라운지",
    description: "배우부터 품번까지, 취향이 머무는 곳.",
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
