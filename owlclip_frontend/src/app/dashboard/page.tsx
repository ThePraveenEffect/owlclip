'use client';

import {
  Scissors,
  Clock,
  Zap,
} from 'lucide-react';

import Sidebar from '@/components/dashboard/Sidebar';
import StatCard from '@/components/dashboard/StatCard';
import CreditsCard from '@/components/dashboard/CreditsCard';
import UsageChart from '@/components/dashboard/UsageChart';
import ActiveJobs from '@/components/dashboard/ActiveJobs';
import RecentClips from '@/components/dashboard/RecentClips';
import BillingSection from '@/components/dashboard/BillingSection';
import{useAuth} from '@/hooks/useAuth';
import {useMyClip} from '@/hooks/useMyClip';

export default function Dashboard() {

  const { data: user, isLoading } = useAuth();
  const {data:totalClips} = useMyClip(); 

  if (isLoading || !user) {
  return <div>Loading your dashboard...</div>;
}

// Now this is completely safe to run
const credits = user.credits.remaining;
const total_clips = totalClips?.total_clips || 0;




  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, CodeVeen. Here&apos;s your overview.</p>
          </div>

          {/* Stat Cards Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Clips"
              value={total_clips || '0'}
              icon={Scissors}
              // trend={{ value: '12%', positive: true }}
            />
            {/* <StatCard
              title="Hours Saved"
              value="23.5"
              subtitle="vs manual editing"
              icon={Clock}
              trend={{ value: '8%', positive: true }}
            /> */}
            {/* <StatCard
              title="Credits Used"
              value="146"
              subtitle="of 500 this month"
              icon={Zap}  
            /> */}
            <CreditsCard credits={credits} />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-5 mb-8">
            {/* Left: Usage + Jobs */}
            {/* <div className="lg:col-span-3 space-y-6">
              <UsageChart />
              <ActiveJobs />
            </div> */}

            {/* Right: Clips */}
            <div className="lg:col-span-2">
              <RecentClips />
            </div>
          </div>

          {/* Billing Section */}
          <BillingSection />
        </main>
      </div>
    </div>
  );
}
