import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryProvider } from "@/providers/query-provider";
import Script from "next/script";

// We will use Geist as your primary font to align with your globals.css font configurations
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: "OwlClip - Turn YouTube Videos into Viral Clips with AI",
  description: "Paste a YouTube link. Get ready-to-post clips in minutes. Our AI finds the best moments and creates clips automatically. Join the waitlist and get 10 free credits.",
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={cn("scroll-smooth", geist.variable)} 
      suppressHydrationWarning
    >
      {/* 🌟 FIXED: Added bg-background and text-foreground utilities here */}
      <body className="bg-background text-foreground font-sans antialiased transition-colors duration-300">
        <QueryProvider>
          <ThemeProvider>
            {children}

            <Script src="https://checkout.razorpay.com/v1/checkout.js"
                     strategy="afterInteractive"/>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
