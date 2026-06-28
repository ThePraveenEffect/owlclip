'use client'

import Sidebar from '@/components/dashboard/Sidebar';
import BillingSection from '@/components/dashboard/BillingSection';
import { useBillingHistory } from '@/hooks/useBillingHistory';

export default function BillingPage() {

  
  // const { data: billingHistory, isLoading, error } = useBillingHistory();

  // console.log('Billing History:', billingHistory);


  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
            <p className="text-muted-foreground mt-1">Manage your subscription and payment methods</p>
          </div>

          {/* Current Plan Summary */}
          {/* <div className="rounded-2xl border border-border bg-card p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="text-xl font-bold text-foreground mt-1">Creator — $9/mo</p>
                <p className="text-sm text-muted-foreground mt-1">1,000 credits/month • Renews on July 15, 2026</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Credits remaining</p>
                <p className="text-2xl font-bold text-foreground mt-1">354 <span className="text-sm font-normal text-muted-foreground">/ 1,000</span></p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" style={{ width: '64%' }} />
            </div>
          </div> */}

          {/* Plans */}
          <BillingSection />

          {/* Payment Method */}
          {/* <div className="rounded-2xl border border-border bg-card p-6 mt-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Payment Method</h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">•••• •••• •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/27</p>
                </div>
              </div>
              <button className="text-sm font-medium text-orange-500 hover:text-orange-600 transition">
                Update
              </button>
            </div>
          </div> */}

          {/* Billing History */}
          {/* <div className="rounded-2xl border border-border bg-card p-6 mt-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Billing History</h3>
            <div className="space-y-3">
              {[
                { date: 'Jun 15, 2026', amount: '$49.00', status: 'Paid' },
                { date: 'May 15, 2026', amount: '$49.00', status: 'Paid' },
                { date: 'Apr 15, 2026', amount: '$19.00', status: 'Paid' },
              ].map((invoice) => (
                <div key={invoice.date} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{invoice.date}</p>
                    <p className="text-xs text-muted-foreground">Creator Plan</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">{invoice.amount}</span>
                    <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{invoice.status}</span>
                    <button className="text-xs text-muted-foreground hover:text-foreground transition">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </main>
      </div>
    </div>
  );
}
