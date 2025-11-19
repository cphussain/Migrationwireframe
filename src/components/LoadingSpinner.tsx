export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="size-3 bg-[#DB0011] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="size-3 bg-[#DB0011] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="size-3 bg-[#DB0011] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="text-slate-600 ml-2">Loading data...</span>
      </div>
    </div>
  );
}
