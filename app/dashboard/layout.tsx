import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { MusicPlayer } from '@/components/dashboard/music-player'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto pb-20">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      <MusicPlayer />
    </div>
  )
}
