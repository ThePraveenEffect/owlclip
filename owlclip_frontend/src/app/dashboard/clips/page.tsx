import Sidebar from '@/components/dashboard/Sidebar';
import RecentClips from '@/components/dashboard/RecentClips';

export default function ClipsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Clips</h1>
              <p className="text-muted-foreground mt-1">All your generated clips in one place</p>
            </div>
          </div>

          <RecentClips />
        </main>
      </div>
    </div>
  );
}
