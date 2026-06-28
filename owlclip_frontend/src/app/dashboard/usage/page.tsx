// import Sidebar from '@/components/dashboard/Sidebar';
// import UsageChart from '@/components/dashboard/UsageChart';

// export default function UsagePage() {
//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <div className="flex">
//         <Sidebar />

//         <main className="flex-1 p-8 max-w-5xl">
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold tracking-tight">Usage</h1>
//             <p className="text-muted-foreground mt-1">Track your credit consumption and activity</p>
//           </div>

//           <div className="grid gap-6 lg:grid-cols-2 mb-6">
//             <UsageChart />
//             <div className="rounded-2xl border border-border bg-card p-6">
//               <h3 className="text-base font-semibold text-foreground mb-4">Credit Breakdown</h3>
//               <div className="space-y-4">
//                 {[
//                   { label: 'Clip Generation', value: 89, color: 'bg-orange-500' },
//                   { label: 'Subtitle Burning', value: 32, color: 'bg-blue-500' },
//                   { label: '4K Export', value: 25, color: 'bg-emerald-500' },
//                 ].map((item) => (
//                   <div key={item.label}>
//                     <div className="flex items-center justify-between mb-1.5">
//                       <span className="text-sm text-foreground">{item.label}</span>
//                       <span className="text-sm font-medium text-muted-foreground">{item.value} credits</span>
//                     </div>
//                     <div className="h-2 bg-muted rounded-full overflow-hidden">
//                       <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.value / 146) * 100}%` }} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


export default function usage(){
  return (
    <span> we're implementing soon this page.</span>
  )
}