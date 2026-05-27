import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import { QueryProvider } from "@/src/providers/query-provider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className={cn("scroll-smooth", "font-sans", geist.variable)} suppressHydrationWarning>
    
      <body className={inter.className}>
        
    <QueryProvider>
        {children}
        
    </QueryProvider>

       </body>

    </html>
  );
}