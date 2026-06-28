'use client';

import { Sparkles, ArrowUpRight } from 'lucide-react';

export default function CreditsCard({credits}) {
  
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <p className="text-sm font-medium text-muted-foreground">Credits</p>
          </div>

          <div>
            <p className="text-4xl font-bold text-foreground tracking-tight">{credits} </p>
            <span className="text-md text-muted-foreground  ">left</span>
            {/* <p className="text-sm text-muted-foreground mt-1">of {credits} remaining</p> */}
          </div>

          {/* Progress */}
          {/* <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{used} used</span>
              <span className="text-xs text-muted-foreground">{percent}%</span>
            </div>
          </div> */}

          {/* <p className="text-xs text-muted-foreground">Renews in {renewsIn} days</p> */}
        </div>

        {/* <button className="flex items-center gap-1 text-xs font-medium text-orange-500 hover:text-orange-600 transition bg-orange-500/10 px-3 py-1.5 rounded-full">
          Upgrade
          <ArrowUpRight className="w-3 h-3" />
        </button> */}
      </div>
    </div>
  );
}
