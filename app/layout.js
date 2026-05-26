import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./components/ThemeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "KoinX - Crypto Tax Loss Harvesting Tool",
  description: "Optimize your crypto taxes with KoinX's Tax Loss Harvesting Tool. Recalculate your short-term and long-term capital gains in real-time.",
  keywords: "KoinX, Crypto Tax, Tax Loss Harvesting, Bitcoin, Ethereum, Capital Gains Tax, India Crypto Tax",
  authors: [{ name: "KoinX Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300 antialiased font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
