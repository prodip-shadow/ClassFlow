import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 pb-20 lg:pb-0">
        <Sidebar />
        <main className="flex-1 w-full min-w-0">{children}</main>
      </div>
    </div>
  );
}
