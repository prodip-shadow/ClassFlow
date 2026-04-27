export default function DashboardLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-muted text-sm font-medium animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
}
