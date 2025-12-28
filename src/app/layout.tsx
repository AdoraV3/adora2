// app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";



const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "My App",
  description: "A modern Next.js application",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="bg-[var(--color-primary)] text-[var(--color-secondary)]"
    >
      <body
        className={`${poppins.className} font-sans antialiased text-xs`}
      >
         <main>
              {children}
          </main>
      </body>
    </html>
  );
}