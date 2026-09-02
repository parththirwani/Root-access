export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const dims = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-10 h-10 border-[3px]',
  }[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block ${dims} border-[#2a2a2a] border-t-white rounded-full animate-spin ${className}`}
    />
  );
}

export function FullScreenLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#0a0a0a] ${className}`}>
      <Spinner />
    </div>
  );
}

export function ContentLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-24 ${className}`}>
      <Spinner />
    </div>
  );
}
