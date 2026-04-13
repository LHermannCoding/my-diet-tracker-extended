import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import { TrackerProvider } from "@/context/TrackerContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyDietTracker",
  description: "Personal fitness and nutrition tracker with food search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <TrackerProvider>
            <Navigation />
            <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
              {children}
            </main>
          </TrackerProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
