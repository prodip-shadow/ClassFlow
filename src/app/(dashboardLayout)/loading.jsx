export default function DashboardLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-8 py-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-[16rem_1fr] gap-6">
        <div className="hidden lg:block h-[70vh] rounded-xl border border-base-300 bg-base-200 animate-pulse" />
        <div className="space-y-4">
          <div className="h-16 rounded-xl border border-base-300 bg-base-200 animate-pulse" />
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="h-24 rounded-xl border border-base-300 bg-base-200 animate-pulse" />
            <div className="h-24 rounded-xl border border-base-300 bg-base-200 animate-pulse" />
            <div className="h-24 rounded-xl border border-base-300 bg-base-200 animate-pulse" />
          </div>
          <div className="h-48 rounded-xl border border-base-300 bg-base-200 animate-pulse" />
          <div className="h-40 rounded-xl border border-base-300 bg-base-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
