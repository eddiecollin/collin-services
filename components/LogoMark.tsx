/**
 * Collin Services mark: a rounded "C" with a water drop in its opening.
 * Paths are exported so the hero can animate the same geometry.
 */
export const MARK_ARC = 'M77.58 73.14 A36 36 0 1 1 77.58 26.86';
export const MARK_DROP = 'M80.5 38.5 C84.1 43.6 86.9 47.3 86.9 51.2 A6.4 6.4 0 0 1 74.1 51.2 C74.1 47.3 76.9 43.6 80.5 38.5 Z';

export default function LogoMark({ className = 'size-7', title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d={MARK_ARC} fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
      <path d={MARK_DROP} fill="currentColor" />
    </svg>
  );
}
