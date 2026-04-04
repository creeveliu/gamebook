import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gamebook",
  description: "同步你的 Steam 和 PlayStation 游戏库，沉淀自己的私密游戏笔记。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#070b12] text-white">{children}</body>
    </html>
  );
}
