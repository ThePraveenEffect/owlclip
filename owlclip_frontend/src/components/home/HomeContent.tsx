'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { 
  PlayCircle, 
  Scissors, 
  Download, 
  Clock, 
  TrendingUp, 
  Zap,
  Check,
  Sparkles
} from 'lucide-react';

import { ThemeToggle } from '../ThemeToggle';

// import {OWLCLIP_AVATARS} from "@/lib/utils";
import {Button} from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import UserProfile from './UserProfile';
import { DemoVideo } from './DemoVideo';
import {JobCreate} from './JobCreate'



interface HomeClientProps {
    token:string;
}




export default function Home() {

  
  const {
    data: user,
    isLoading,
    error
  } = useAuth();
console.log("auth error:", error);
console.log("isLoading:", isLoading);
   console.log("working",user)

 if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-background">
  //       <p className="text-destructive">
  //         {error instanceof Error ? error.message : "Failed to load user"}
  //       </p>
  //       <Link href="/login" className="text-primary font-semibold hover:opacity-80">
  //         Try Logging In Again
  //       </Link>
  //     </div>
  //   );
  // }


  // if (!user) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-background">
  //       <h1 className="text-foreground">Welcome to OwlClip</h1>
  //       <div className="flex gap-4">
  //         <Link href="/login" className="text-primary font-semibold hover:opacity-80">
  //           Login
  //         </Link>
  //         <Link href="/signup" className="text-secondary font-semibold hover:opacity-80">
  //           Sign Up
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }





  
  return (
    <div className="min-h-screen bg-background">
      
     <header className="backdrop-blur-md bg-background/80 border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          
          {/* Brand Section */}
          <div className="flex items-center gap-1">
            <div className="relative w-20 h-20 shrink-0 transition-transform hover:scale-105 duration-300 ease-out">
              <Image 
                src="/logo.png" 
                alt="OwlClip Logo"
                fill
                className="object-contain drop-shadow-sm"
                priority
              />
            </div>
            
            <div className="flex flex-col">
              <span className="text-3xl font-black text-foreground tracking-tighter leading-none">
                OwlClip
              </span>
            </div>
          </div>

          {/* Right Action Menu Area */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {!user ? (
              <div className="flex items-center gap-3"> 
                <Button 
                  asChild
                  className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  <Link href="/signup">Signup</Link>
                </Button>    

                <Button 
                  asChild
                  className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            ) : (
              <UserProfile user={user} />
            )}
          </div>
          
        </div>
      </div>
    </header>
    
      {/* Hero Section */}
     {!user && (
        <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-linear-to-b from-orange-50/30 via-background to-background pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-orange-50 to-orange-100 border border-orange-200/80 text-orange-700 text-sm font-semibold mb-8 shadow-sm">
              <Sparkles className="w-4 h-4" strokeWidth={2.5} />
              <span>Early Access Available</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] mb-7 tracking-tight">
              Turn any YouTube video into{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 via-red-500 to-orange-600">
                  viral clips
                </span>
              </span>{' '}
              in minutes
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-muted-foreground mb-10 leading-relaxed font-light max-w-3xl mx-auto">
              Paste a YouTube link. Our AI finds the best moments. Get ready-to-post clips without spending hours editing.
            </p>

            {/* CTA */}
            <div className="mb-12">
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2.5 px-10 py-5 bg-linear-to-r from-orange-500 via-orange-600 to-red-600 text-white text-lg font-bold rounded-xl hover:from-orange-600 hover:via-orange-700 hover:to-red-700 transition-all duration-300 shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/50 transform hover:-translate-y-1"
              >
                Join Waitlist – Get 10 Free Credits
              </a>
              <p className="text-sm text-muted-foreground mt-4 font-medium">
                No credit card required • Early access included
              </p>
            </div>



          

      
    

<style jsx>{`
  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -30px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }
  
  @keyframes float-delayed {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(-30px, 30px) scale(0.9); }
    66% { transform: translate(20px, -20px) scale(1.1); }
  }
  
  @keyframes float-slow {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(15px, 15px) scale(1.05); }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .animate-float {
    animation: float 8s ease-in-out infinite;
  }
  
  .animate-float-delayed {
    animation: float-delayed 10s ease-in-out infinite;
  }
  
  .animate-float-slow {
    animation: float-slow 12s ease-in-out infinite;
  }
  
  .animate-shimmer {
    animation: shimmer 3s ease-in-out infinite;
  }
  
  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
`}</style>

 

          </div>
        </div>
      </section>)}

     {user && (
  <div className="flex justify-center items-center w-full my-5">
    <div className="bg-gray-100 px-6 py-3 rounded-full shadow-sm border border-gray-200 font-sans">
      <span className="text-sm font-semibold text-gray-700 tracking-wide">
        Credits Remaining: <strong className="text-blue-600">{user.credits.remaining}</strong>
      </span>
    </div>
  </div>
)}


      {!user?<DemoVideo/>: <JobCreate/> }



      {/* How It Works */}
      <section className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-5 tracking-tight">
              Simple as 1-2-3
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              From YouTube link to viral clips in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-linear-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/15 group-hover:shadow-orange-500/30 transition-all duration-300 group-hover:scale-110">
                <PlayCircle className="w-10 h-10 text-orange-600" strokeWidth={2} />
              </div>
              <div className="text-xs font-black text-orange-600 mb-3 tracking-widest">STEP 1</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Paste YouTube URL</h3>
              <p className="text-muted-foreground leading-relaxed">
                Copy any YouTube video link and paste it into OwlClip
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-linear-to-br from-cyan-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/15 group-hover:shadow-cyan-500/30 transition-all duration-300 group-hover:scale-110">
                <Sparkles className="w-10 h-10 text-cyan-600" strokeWidth={2} />
              </div>
              <div className="text-xs font-black text-cyan-600 mb-3 tracking-widest">STEP 2</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">AI finds key moments</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI analyzes the video and identifies the most engaging clips
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-linear-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/15 group-hover:shadow-emerald-500/30 transition-all duration-300 group-hover:scale-110">
                <Download className="w-10 h-10 text-emerald-600" strokeWidth={2} />
              </div>
              <div className="text-xs font-black text-emerald-600 mb-3 tracking-widest">STEP 3</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Download and post</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get your clips ready for TikTok, Instagram, YouTube Shorts
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-linear-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-16 text-center tracking-tight">
              Tired of spending hours editing clips?
            </h2>

            <div className="space-y-5">
              <div className="flex gap-5 items-start bg-card p-8 rounded-2xl border border-border shadow-lg shadow-foreground/5 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-6 h-6 text-red-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Editing takes forever</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    You spend 2-3 hours cutting a single long-form video into short clips
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start bg-card p-8 rounded-2xl border border-border shadow-lg shadow-foreground/5 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Scissors className="w-6 h-6 text-red-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Hard to find the best moments</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Rewatching your entire video to identify viral-worthy moments is tedious
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start bg-card p-8 rounded-2xl border border-border shadow-lg shadow-foreground/5 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="w-6 h-6 text-red-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Missing out on short-form growth</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    While you're stuck editing, your competitors are posting daily and growing faster
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-5 text-center tracking-tight">
              Create more content in less time
            </h2>
            <p className="text-xl text-muted-foreground mb-16 text-center font-light">
              Everything you need to grow with short-form content
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              
              <div className="flex gap-4 items-start p-6 rounded-xl hover:bg-muted/50 transition-all duration-200">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Save hours of editing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    What takes 3 hours manually happens in minutes
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 rounded-xl hover:bg-muted/50 transition-all duration-200">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Grow faster with short-form</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Post more consistently on TikTok, Reels, and Shorts
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 rounded-xl hover:bg-muted/50 transition-all duration-200">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">No editing skills needed</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    AI does the hard work of finding and cutting clips
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 rounded-xl hover:bg-muted/50 transition-all duration-200">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Works from YouTube links</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    No need to download or re-upload videos
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 rounded-xl hover:bg-muted/50 transition-all duration-200">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">AI-powered moment detection</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Smart analysis finds the most engaging segments
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 rounded-xl hover:bg-muted/50 transition-all duration-200">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Ready-to-post format</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Clips optimized for vertical short-form platforms
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-24 bg-linear-to-b from-muted/30 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-5 tracking-tight">
              See it in action
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              From one long video to multiple engaging clips
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-3xl shadow-2xl border border-border p-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                
                {/* Before */}
                <div>
                  <div className="text-xs font-black text-muted-foreground mb-4 tracking-widest">BEFORE</div>
                  <div className="aspect-video bg-linear-to-br from-muted to-muted/70 rounded-2xl flex items-center justify-center border-2 border-border shadow-lg">
                    <div className="text-center">
                      <PlayCircle className="w-20 h-20 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
                      <div className="text-base font-bold text-muted-foreground">60 min podcast</div>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div>
                  <div className="text-xs font-black text-orange-600 mb-4 flex items-center gap-2 tracking-widest">
                    <Zap className="w-4 h-4" strokeWidth={3} />
                    AFTER
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="aspect-[9/16] bg-linear-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center border-2 border-orange-300 shadow-lg hover:scale-105 transition-transform duration-200">
                        <div className="text-center">
                          <Scissors className="w-10 h-10 text-orange-600 mx-auto mb-2" strokeWidth={2} />
                          <div className="text-base font-bold text-orange-700">Clip {i}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card via-background to-card pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-7 tracking-tight">
              Trusted by creators
            </h2>
            <div className="bg-card/10 backdrop-blur-md rounded-3xl p-10 max-w-lg mx-auto mb-12 border border-border shadow-2xl">
              <div className="space-y-5">
                <div className="flex items-center gap-4 text-foreground">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                  </div>
                  <span className="font-medium">AI-powered clipping</span>
                </div>
                <div className="flex items-center gap-4 text-foreground">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                  </div>
                  <span className="font-medium">Auto subtitle generation</span>
                </div>
                <div className="flex items-center gap-4 text-foreground">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                  </div>
                  <span className="font-medium">Multiple aspect ratios</span>
                </div>
                <div className="flex items-center gap-4 text-foreground">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                  </div>
                  <span className="font-medium">Viral score prediction</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2.5 px-10 py-5 bg-foreground text-background text-lg font-bold rounded-xl hover:opacity-90 transition-all duration-300 shadow-2xl hover:shadow-foreground/20 transform hover:-translate-y-1"
              >
                Get Started — It's Free
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            Ready to create viral clips?
          </h2>
          <p className="text-lg text-muted-foreground font-light">
            Join the waitlist and get 10 free credits
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-linear-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-4xl font-bold text-foreground mb-16 text-center tracking-tight">
            What creators are saying
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            <div className="bg-card rounded-2xl p-8 border border-border shadow-lg shadow-foreground/5 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-card-foreground mb-3">
                "Game changer for my content"
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                I used to spend hours editing. Now I get clips in minutes.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border shadow-lg shadow-foreground/5 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-card-foreground mb-3">
                "The AI is scarily good"
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                It finds moments I would have missed myself.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border shadow-lg shadow-foreground/5 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-card-foreground mb-3">
                "Best investment for my channel"
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                My posting frequency tripled since I started using OwlClip.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-5 tracking-tight">
            Start creating viral clips today
          </h2>
          <p className="text-xl text-muted-foreground mb-10 font-light">
            Join 10,000+ creators already on the waitlist
          </p>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2.5 px-10 py-5 bg-linear-to-r from-orange-500 via-orange-600 to-red-600 text-white text-lg font-bold rounded-xl hover:from-orange-600 hover:via-orange-700 hover:to-red-700 transition-all duration-300 shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/50 transform hover:-translate-y-1"
          >
            Join the Waitlist
          </a>
        </div>
      </section>

      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* <Scissors className="w-5 h-5 text-white" strokeWidth={2.5} /> */}
              <div className="relative w-6 h-6 shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="OwlClip Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold ml-2 text-foreground tracking-tight">OwlClip</span>
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              © 2025 OwlClip. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
