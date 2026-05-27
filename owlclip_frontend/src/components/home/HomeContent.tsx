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


import {Button} from '@/components/ui/button';
import { useAuth } from '@/src/hooks/useAuth';


interface HomeClientProps {
    token:string;
}




export default function Home({token} :HomeClientProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  const {
    data: user,
    isLoading:loading,
    error
  } = useAuth();

   console.log(user)

 if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <button>Login</button>;
  }


  return (
    <div className="min-h-screen bg-white">
      
      <header className="  backdrop-blur-md sticky top-0 z-50">
  <div className="max-w-6xl mx-auto px-6 py-3"> {/* Reduced max-width to bring elements closer */}
    <div className="flex items-center justify-between">
      <p>Welcome {user?.name}</p>
{/* Brand Section */}
<div className="flex items-center gap-1">
  {/* Logo Container - Added a subtle hover lift for a "non-robotic" feel */}
  <div className="relative w-20 h-20 shrink-0 transition-transform hover:scale-105 duration-300 ease-out">
    <Image 
      src="/logo.png" 
      alt="OwlClip Logo"
      fill
      className="object-contain drop-shadow-sm" // Subtle shadow makes PNGs pop
      priority
    />
  </div>
  
  {/* Brand Name - Shifted tracking to 'tighter' to match a heavy, large logo */}
  <div className="flex flex-col ">
    <span className="text-3xl font-black text-neutral-900 tracking-tighter leading-none">
      OwlClip
    </span>
   
  </div>


</div>

  <div className="flex items-center gap-4"> 
    
    
    {/* Action Button - More "Squircle" shape to match the logo */}
      <Button  className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
         <Link href="/signup">Signup</Link>
      </Button>    

      <Button  className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
        <Link href="/login">Login</Link>
      </Button>
      
      </div>
      
    </div>
  </div>
</header>


      {/* Hero Section */}
      <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-orange-50/30 via-white to-white pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-orange-50 to-orange-100 border border-orange-200/80 text-orange-700 text-sm font-semibold mb-8 shadow-sm">
              <Sparkles className="w-4 h-4" strokeWidth={2.5} />
              <span>Early Access Available</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-neutral-900 leading-[1.1] mb-7 tracking-tight">
              Turn any YouTube video into{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 via-red-500 to-orange-600">
                  viral clips
                </span>
              </span>{' '}
              in minutes
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-neutral-600 mb-10 leading-relaxed font-light max-w-3xl mx-auto">
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
              <p className="text-sm text-neutral-500 mt-4 font-medium">
                No credit card required • Early access included
              </p>
            </div>

          
      {/* Visual Mockup - The 2 Clip Preview */}
<div className="mt-16 relative max-w-4xl mx-auto">
  {/* Premium glow effect with animation */}
  <div className="absolute -inset-8 bg-linear-to-r from-orange-500/20 via-red-500/30 to-orange-500/20 blur-3xl rounded-3xl -z-10 animate-pulse"></div>
  <div className="absolute -inset-6 bg-linear-to-b from-orange-500/10 via-red-500/20 to-transparent blur-2xl rounded-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
  
  {/* Animated ring */}
  <div className="absolute -inset-1 bg-linear-to-r from-orange-500/40 via-red-500/40 to-orange-500/40 rounded-3xl blur-sm -z-10 animate-spin-slow"></div>

  {/* Main container */}
  <div className="relative bg-linear-to-b from-neutral-900 via-black to-neutral-950 rounded-3xl border border-white/10 p-8 shadow-2xl overflow-hidden backdrop-blur-sm">
    
    {/* Animated background particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-red-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-orange-600/5 rounded-full blur-3xl animate-float-slow"></div>
    </div>

    {/* Top browser chrome */}
    <div className="relative flex items-center gap-3 mb-10 pb-6 border-b border-white/10">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-lg shadow-red-500/50 animate-pulse"></div>
        <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-lg shadow-amber-500/50 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-lg shadow-emerald-500/50 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <div className="ml-6 flex-1 bg-linear-to-r from-white/10 to-white/5 px-4 py-2 rounded-lg text-md font-mono text-neutral-400 border border-white/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <span className="relative z-10">🎬 owlclip.app</span>
      </div>
    </div>

    {/* URL Input Section */}
    <div className="relative mb-10 pb-10 border-b border-white/10">
      <div className="space-y-3">
        <label className="text-sm font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping absolute"></span>
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          Paste YouTube Link
        </label>
        <div className="relative group">
          {/* Input glow with animation */}
          <div className="absolute -inset-1 bg-linear-to-r from-orange-500/30 via-red-500/30 to-orange-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse-slow"></div>
          <div className="absolute -inset-0.5 bg-linear-to-r from-orange-500/50 via-red-500/50 to-orange-500/50 rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-all duration-500"></div>
          
          <div className="relative flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="https://youtube.com/watch?v=..."
              readOnly
              value="https://youtube.com/watch?v=dQw4w9WgXcQ"
              className="flex-1 bg-linear-to-r from-white/10 to-white/5 px-6 py-4 rounded-xl text-white placeholder-neutral-500 text-sm border border-white/20 focus:border-orange-500/50 focus:outline-none transition-all duration-300 font-mono hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10"
            />
            <button className="relative px-6 py-4 bg-linear-to-r from-orange-500 via-orange-600 to-red-600 text-white font-bold rounded-xl overflow-hidden group/btn transition-all duration-300 shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 whitespace-nowrap">
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
              <Zap className="w-4 h-4 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
              <span className="relative z-10">Process</span>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-linear-to-r from-orange-400/0 via-orange-400/50 to-orange-400/0 opacity-0 group-hover/btn:opacity-100 blur-xl transition-opacity duration-500"></div>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Clips grid */}
    <div className="grid md:grid-cols-2 gap-8 relative">
      {/* Clip 1 - Hook */}
      <div className="group relative">
        {/* Card background glow with animation */}
        <div className="absolute -inset-4 bg-linear-to-br from-orange-600/0 via-orange-500/0 to-orange-600/0 group-hover:from-orange-600/30 group-hover:via-orange-500/20 group-hover:to-orange-600/20 rounded-3xl blur-2xl transition-all duration-700 -z-10 group-hover:animate-pulse-slow"></div>

        <div className="space-y-4 relative">
          {/* Video preview */}
          <div className="aspect-9/16 bg-linear-to-br from-neutral-800 via-neutral-900 to-black rounded-3xl overflow-hidden relative border border-white/10 group-hover:border-orange-500/60 transition-all duration-500 shadow-2xl group-hover:shadow-orange-500/40 group-hover:scale-[1.02] transform">
            
            {/* Animated scan line */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-orange-500/10 to-transparent h-full w-full translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-2000 ease-linear pointer-events-none"></div>
            
            {/* Video gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent"></div>
            
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Multiple glow layers */}
                <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-red-500 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150 animate-pulse"></div>
                <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-all duration-300 scale-125"></div>
                <PlayCircle className="w-20 h-20 text-white/30 group-hover:text-white/90 transition-all duration-500 group-hover:scale-125 group-hover:rotate-90 relative z-10 drop-shadow-2xl" strokeWidth={1.5} />
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 relative group-hover:h-2 transition-all duration-300">
                <div className="h-full bg-linear-to-r from-orange-400 via-orange-500 to-red-500 w-1/3 rounded-full shadow-lg shadow-orange-500/50 relative overflow-hidden">
                  {/* Animated shine */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/50 group-hover:text-orange-400 transition-colors duration-300">Clip 01</span>
                <span className="text-[11px] font-bold text-white/60 group-hover:text-white/90 transition-colors duration-300">0:00 / 00:45</span>
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-orange-500/50 animate-ping"></div>
            <div className="absolute top-4 right-4 w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </div>

          {/* Info section */}
          {/* <div className="space-y-3 pt-2">
            <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-300">The Hook Moment</h3>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">Peak engagement detected</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-orange-500/20 to-red-500/20 text-orange-300 text-xs font-bold rounded-full border border-orange-500/30 shadow-lg shadow-orange-500/10 group-hover:shadow-orange-500/30 group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Zap className="w-3 h-3 relative z-10 animate-pulse" strokeWidth={3} />
                <span className="relative z-10">98% Score</span>
              </span>
            </div>
          </div> */}



        </div>
      </div>

      {/* Clip 2 - Value */}
      <div className="group relative">
        {/* Card background glow with animation */}
        <div className="absolute -inset-4 bg-linear-to-br from-orange-600/0 via-orange-500/0 to-orange-600/0 group-hover:from-orange-600/30 group-hover:via-orange-500/20 group-hover:to-orange-600/20 rounded-3xl blur-2xl transition-all duration-700 -z-10 group-hover:animate-pulse-slow"></div>

        <div className="space-y-4 relative">
          {/* Video preview */}
          <div className="aspect-9/16 bg-linear-to-br from-neutral-800 via-neutral-900 to-black rounded-3xl overflow-hidden relative border border-white/10 group-hover:border-orange-500/60 transition-all duration-500 shadow-2xl group-hover:shadow-orange-500/40 group-hover:scale-[1.02] transform">
            
            {/* Animated scan line */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-orange-500/10 to-transparent h-full w-full translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-2000 ease-linear pointer-events-none" style={{ transitionDelay: '0.3s' }}></div>
            
            {/* Video gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent"></div>
            
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Multiple glow layers */}
                <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-red-500 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150 animate-pulse"></div>
                <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-all duration-300 scale-125"></div>
                <PlayCircle className="w-20 h-20 text-white/30 group-hover:text-white/90 transition-all duration-500 group-hover:scale-125 group-hover:rotate-90 relative z-10 drop-shadow-2xl" strokeWidth={1.5} />
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 relative group-hover:h-2 transition-all duration-300">
                <div className="h-full bg-linear-to-r from-orange-400 via-orange-500 to-red-500 w-2/3 rounded-full shadow-lg shadow-orange-500/50 relative overflow-hidden">
                  {/* Animated shine */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/50 group-hover:text-orange-400 transition-colors duration-300">Clip 02</span>
                <span className="text-[11px] font-bold text-white/60 group-hover:text-white/90 transition-colors duration-300">00:00 / 00:55</span>
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-orange-500/50 animate-ping"></div>
            <div className="absolute top-4 right-4 w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </div>

          {/* Info section */}
          {/* <div className="space-y-3 pt-2">
            <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-300">Value Delivery</h3>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">Information dense segment</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-orange-500/20 to-red-500/20 text-orange-300 text-xs font-bold rounded-full border border-orange-500/30 shadow-lg shadow-orange-500/10 group-hover:shadow-orange-500/30 group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Zap className="w-3 h-3 relative z-10 animate-pulse" strokeWidth={3} />
                <span className="relative z-10">94% Score</span>
              </span>
            </div>
          </div> */}


        </div>
      </div>
    </div>

    {/* Bottom stats */}
    <div className="relative mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Background glow */}
      <div className="absolute inset-0 bg-linear-to-r from-orange-500/5 via-red-500/5 to-orange-500/5 blur-xl -z-10 animate-pulse-slow"></div>
      
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center sm:items-start group/stat">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-red-500 group-hover/stat:scale-110 transition-transform duration-300 relative">
            2
            <div className="absolute -inset-2 bg-linear-to-r from-orange-500/20 to-red-500/20 blur-lg opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 -z-10"></div>
          </span>
          <span className="text-xs text-neutral-500 uppercase font-bold tracking-widest group-hover/stat:text-neutral-400 transition-colors duration-300">Clips Found</span>
        </div>
        <div className="flex flex-col items-center sm:items-start group/stat">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 group-hover/stat:scale-110 transition-transform duration-300 relative">
            30min
            <div className="absolute -inset-2 bg-linear-to-r from-cyan-500/20 to-blue-500/20 blur-lg opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 -z-10"></div>
          </span>
          <span className="text-xs text-neutral-500 uppercase font-bold tracking-widest group-hover/stat:text-neutral-400 transition-colors duration-300">Time Saved</span>
        </div>
      </div>
      <div className="text-center sm:text-right">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 text-sm font-bold rounded-lg border border-emerald-500/30 relative overflow-hidden group/ready hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-emerald-400/20 to-transparent -translate-x-full group-hover/ready:translate-x-full transition-transform duration-700"></div>
          <Check className="w-4 h-4 relative z-10 group-hover/ready:rotate-12 transition-transform duration-300" strokeWidth={3} />
          <span className="relative z-10">Ready to Post</span>
          {/* Ping effect */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"></div>
        </span>
      </div>
    </div>
  </div>
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
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-5 tracking-tight">
              Simple as 1-2-3
            </h2>
            <p className="text-xl text-neutral-600 font-light">
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
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">Paste YouTube URL</h3>
              <p className="text-neutral-600 leading-relaxed">
                Copy any YouTube video link and paste it into OwlClip
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-linear-to-br from-cyan-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/15 group-hover:shadow-cyan-500/30 transition-all duration-300 group-hover:scale-110">
                <Sparkles className="w-10 h-10 text-cyan-600" strokeWidth={2} />
              </div>
              <div className="text-xs font-black text-cyan-600 mb-3 tracking-widest">STEP 2</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">AI finds key moments</h3>
              <p className="text-neutral-600 leading-relaxed">
                Our AI analyzes the video and identifies the most engaging clips
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-linear-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/15 group-hover:shadow-emerald-500/30 transition-all duration-300 group-hover:scale-110">
                <Download className="w-10 h-10 text-emerald-600" strokeWidth={2} />
              </div>
              <div className="text-xs font-black text-emerald-600 mb-3 tracking-widest">STEP 3</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">Download and post</h3>
              <p className="text-neutral-600 leading-relaxed">
                Get your clips ready for TikTok, Instagram, YouTube Shorts
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-linear-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-16 text-center tracking-tight">
              Tired of spending hours editing clips?
            </h2>

            <div className="space-y-5">
              <div className="flex gap-5 items-start bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-lg shadow-neutral-900/5 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-6 h-6 text-red-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Editing takes forever</h3>
                  <p className="text-neutral-600 leading-relaxed text-lg">
                    You spend 2-3 hours cutting a single long-form video into short clips
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-lg shadow-neutral-900/5 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Scissors className="w-6 h-6 text-red-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Hard to find the best moments</h3>
                  <p className="text-neutral-600 leading-relaxed text-lg">
                    Rewatching your entire video to identify viral-worthy moments is tedious
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-lg shadow-neutral-900/5 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="w-6 h-6 text-red-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Missing out on short-form growth</h3>
                  <p className="text-neutral-600 leading-relaxed text-lg">
                    While you're stuck editing, your competitors are posting daily and growing faster
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-5 text-center tracking-tight">
              Create more content in less time
            </h2>
            <p className="text-xl text-neutral-600 mb-16 text-center font-light">
              Everything you need to grow with short-form content
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              
              <div className="flex gap-4 items-start p-6 rounded-xl hover:bg-neutral-50 transition-all duration-200">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">Save hours of editing</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    What takes 3 hours manually happens in minutes
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 rounded-xl hover:bg-neutral-50 transition-all duration-200">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">Grow faster with short-form</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Post more consistently on TikTok, Reels, and Shorts
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 rounded-xl hover:bg-neutral-50 transition-all duration-200">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">No editing skills needed</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    AI does the hard work of finding and cutting clips
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 rounded-xl hover:bg-neutral-50 transition-all duration-200">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">Works from YouTube links</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    No need to download or re-upload videos
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 rounded-xl hover:bg-neutral-50 transition-all duration-200">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">AI-powered moment detection</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Smart analysis finds the most engaging segments
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 rounded-xl hover:bg-neutral-50 transition-all duration-200">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">Ready-to-post format</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Clips optimized for vertical short-form platforms
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-24 bg-linear-to-b from-neutral-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-5 tracking-tight">
              See it in action
            </h2>
            <p className="text-xl text-neutral-600 font-light">
              From one long video to multiple engaging clips
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200/80 p-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                
                {/* Before */}
                <div>
                  <div className="text-xs font-black text-neutral-500 mb-4 tracking-widest">BEFORE</div>
                  <div className="aspect-video bg-linear-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center border-2 border-neutral-300 shadow-lg">
                    <div className="text-center">
                      <PlayCircle className="w-20 h-20 text-neutral-400 mx-auto mb-3" strokeWidth={1.5} />
                      <div className="text-base font-bold text-neutral-500">60 min podcast</div>
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
                          <div className="text-sm font-bold text-orange-700">Clip {i}</div>
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

      {/* Offer Section */}
      <section className="py-28 bg-linear-to-br from-orange-600 via-orange-500 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-7 tracking-tight">
            Join the waitlist and get 10 free credits
          </h2>
          <p className="text-2xl text-orange-100 mb-12 font-light">
            Enough to process ~2 long YouTube videos and generate multiple clips
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 max-w-lg mx-auto mb-12 border border-white/20 shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center gap-4 text-white">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </div>
                <span className="text-left text-lg font-medium">10 free credits (worth $2)</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </div>
                <span className="text-left text-lg font-medium">Early access to OwlClip</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </div>
                <span className="text-left text-lg font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </div>
                <span className="text-left text-lg font-medium">Priority support during beta</span>
              </div>
            </div>
          </div>

          <a
            href="#waitlist"
            className="inline-flex items-center gap-2.5 px-10 py-5 bg-white text-orange-600 text-lg font-bold rounded-xl hover:bg-neutral-50 transition-all duration-300 shadow-2xl hover:shadow-white/20 transform hover:-translate-y-1"
          >
            Claim Your Free Credits
           </a>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section id="waitlist" className="py-28 bg-white">
        <div className="max-w-lg mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4 tracking-tight">
              Join the waitlist
            </h2>
            <p className="text-lg text-neutral-600 font-light">
              Be among the first to turn your videos into viral clips
            </p>
          </div>

         
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-linear-to-b from-neutral-50 to-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-4xl font-bold text-neutral-900 mb-16 text-center tracking-tight">
            Frequently asked questions
          </h2>

          <div className="space-y-5">
            
            <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-lg shadow-neutral-900/5 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                What is OwlClip?
              </h3>
              <p className="text-neutral-600 leading-relaxed text-lg">
                OwlClip is an AI-powered tool that automatically turns long YouTube videos into short, engaging clips. Just paste a YouTube link, and our AI finds the best moments and creates ready-to-post clips for TikTok, Instagram Reels, and YouTube Shorts.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-lg shadow-neutral-900/5 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                How do credits work?
              </h3>
              <p className="text-neutral-600 leading-relaxed text-lg">
                Each credit lets you process a certain amount of video. A typical 30-60 minute YouTube video uses about 5 credits. With 10 free credits, you can process around 2 long-form videos and generate multiple clips from each.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-lg shadow-neutral-900/5 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Does it only support YouTube?
              </h3>
              <p className="text-neutral-600 leading-relaxed text-lg">
                For now, yes. We're starting with YouTube because that's where most long-form content lives. Support for other platforms may come in the future based on user feedback.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-lg shadow-neutral-900/5 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                When will OwlClip launch?
              </h3>
              <p className="text-neutral-600 leading-relaxed text-lg">
                We're currently in private beta and refining the AI. Waitlist members will get early access in the coming weeks. We'll send you an email as soon as you can start using it.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-lg shadow-neutral-900/5 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Is it free?
              </h3>
              <p className="text-neutral-600 leading-relaxed text-lg">
                Waitlist members get 10 free credits to start (no credit card required). After that, we'll have affordable credit packages. We're building OwlClip to be accessible for creators at any level.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-lg shadow-neutral-900/5 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Can I use clips for any YouTube video?
              </h3>
              <p className="text-neutral-600 leading-relaxed text-lg">
                You should only create clips from videos you own or have permission to use. OwlClip is designed for creators who want to repurpose their own content. Please respect copyright laws.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-5 tracking-tight">
            Ready to grow with short-form content?
          </h2>
          <p className="text-xl text-neutral-600 mb-10 font-light">
            Join the waitlist and get 10 free credits when we launch
          </p>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2.5 px-10 py-5 bg-linear-to-r from-orange-500 via-orange-600 to-red-600 text-white text-lg font-bold rounded-xl hover:from-orange-600 hover:via-orange-700 hover:to-red-700 transition-all duration-300 shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/50 transform hover:-translate-y-1"
          >
            Join Waitlist
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-linear-to-br from-orange-500 via-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                {/* <Scissors className="w-5 h-5 text-white" strokeWidth={2.5} /> */}
                
                <div className="relative w-20 h-20 shrink-0 transition-transform hover:scale-105 duration-300 ease-out">
    <Image 
      src="/logo.png" 
      alt="OwlClip Logo"
      fill
      className="object-contain drop-shadow-sm" // Subtle shadow makes PNGs pop
      priority
    />
  </div>  

              </div>
              <span className="text-xl font-bold ml-2 text-neutral-900 tracking-tight">OwlClip</span>
            </div>
            <div className="text-sm text-neutral-600 font-medium">
              © 2026 OwlClip. Turn videos into viral clips.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}