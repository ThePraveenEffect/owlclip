'use client';

const data = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 19 },
  { label: 'Wed', value: 8 },
  { label: 'Thu', value: 24 },
  { label: 'Fri', value: 15 },
  { label: 'Sat', value: 30 },
  { label: 'Sun', value: 22 },
];

const maxValue = Math.max(...data.map(d => d.value));

export default function UsageChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Weekly Activity</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Clips created this week</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          Clips
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-3 h-40">
        {data.map((d) => {
          const height = (d.value / maxValue) * 100;
          return (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end h-32">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-orange-500 to-orange-400 transition-all duration-500 ease-out hover:from-orange-600 hover:to-orange-500 cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-medium px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {d.value} clips
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
