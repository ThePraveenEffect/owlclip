import { Check, PlayCircle, Zap } from "lucide-react";


export function DemoVideo() {



    return(
    <>
    {/* Visual Mockup - The 2 Clip Preview */}
    
      <div className="mt-16 relative max-w-4xl mx-auto">
          {/* Premium glow effect with animation */}
          <div className="absolute -inset-8 bg-linear-to-r from-orange-500/20 via-red-500/30 to-orange-500/20 blur-3xl rounded-3xl -z-10 animate-pulse"></div>
          <div className="absolute -inset-6 bg-linear-to-b from-orange-500/10 via-red-500/20 to-transparent blur-2xl rounded-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Animated ring */}
          <div className="absolute -inset-1 bg-linear-to-r from-orange-500/40 via-red-500/40 to-orange-500/40 rounded-3xl blur-sm -z-10 animate-spin-slow"></div>
        
          {/* Main container - dark card */}
          <div className="relative bg-linear-to-b from-card via-card/95 to-card/90 rounded-3xl border border-border p-8 shadow-2xl overflow-hidden">
            
            {/* Subtle background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-100">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-float"></div>
              <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-red-500/10 rounded-full blur-3xl animate-float-delayed"></div>
              <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-orange-600/5 rounded-full blur-3xl animate-float-slow"></div>
            </div>
        
            {/* Top browser chrome */}
            <div className="relative flex items-center gap-3 mb-10 pb-6 border-b border-border/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-lg shadow-red-500/50 animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-lg shadow-amber-500/50 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-lg shadow-emerald-500/50 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <div className="ml-6 flex-1 bg-muted px-4 py-2 rounded-lg text-md font-mono text-muted-foreground border border-border/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10">🎬 owlclip.app</span>
              </div>
            </div>
        
            {/* URL Input Section */}
            <div className="relative mb-10 pb-10 border-b border-border/50">
              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
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
                      className="flex-1 bg-muted px-6 py-4 rounded-xl text-card-foreground placeholder-muted-foreground text-sm border border-border focus:border-orange-500/50 focus:outline-none transition-all duration-300 font-mono hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10"
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
                  <div className="aspect-9/16 bg-linear-to-br from-muted via-muted/80 to-card rounded-3xl overflow-hidden relative border border-border group-hover:border-orange-500/60 transition-all duration-500 shadow-2xl group-hover:shadow-orange-500/40 group-hover:scale-[1.02] transform">
                    
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
        
        
                </div>
              </div>
        
              {/* Clip 2 - Value */}
              <div className="group relative">
                {/* Card background glow with animation */}
                <div className="absolute -inset-4 bg-linear-to-br from-orange-600/0 via-orange-500/0 to-orange-600/0 group-hover:from-orange-600/30 group-hover:via-orange-500/20 group-hover:to-orange-600/20 rounded-3xl blur-2xl transition-all duration-700 -z-10 group-hover:animate-pulse-slow"></div>
        
                <div className="space-y-4 relative">
                  {/* Video preview */}
                  <div className="aspect-9/16 bg-linear-to-br from-muted via-muted/80 to-card rounded-3xl overflow-hidden relative border border-border group-hover:border-orange-500/60 transition-all duration-500 shadow-2xl group-hover:shadow-orange-500/40 group-hover:scale-[1.02] transform">
                    
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
        
                </div>
              </div>
            </div>
        
            {/* Bottom stats */}
            <div className="relative mt-10 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Background glow */}
              <div className="absolute inset-0 bg-linear-to-r from-orange-500/5 via-red-500/5 to-orange-500/5 blur-xl -z-10 animate-pulse-slow"></div>
              
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center sm:items-start group/stat">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-red-500 group-hover/stat:scale-110 transition-transform duration-300 relative">
                    2
                    <div className="absolute -inset-2 bg-linear-to-r from-orange-500/20 to-red-500/20 blur-lg opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </span>
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest group-hover/stat:text-card-foreground/70 transition-colors duration-300">Clips Found</span>
                </div>
                <div className="flex flex-col items-center sm:items-start group/stat">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 group-hover/stat:scale-110 transition-transform duration-300 relative">
                    30min
                    <div className="absolute -inset-2 bg-linear-to-r from-cyan-500/20 to-blue-500/20 blur-lg opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </span>
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest group-hover/stat:text-card-foreground/70 transition-colors duration-300">Time Saved</span>
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
    
        </>
    )
}
