import Image from 'next/image';

export function ProjectLogo({ image, compact = false }: { image: string | null; compact?: boolean }) {
  const size = compact ? 17 : 34;

  return (
    <span className={`project-logo${compact ? ' project-logo--compact' : ''}`} aria-hidden="true">
      {image ? (
        <Image src={image} alt="" width={size} height={size} unoptimized loading="lazy" />
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
        </svg>
      )}
    </span>
  );
}
