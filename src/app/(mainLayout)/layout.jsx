import { Navbar } from '@/components/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      {children}
    </div>
  );
}
