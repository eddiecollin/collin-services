import { useId } from 'react';

/**
 * Collin Services mark: a rounded "C" with a water drop in its opening, in polished chrome.
 * Paths are exported so the hero can animate the same geometry.
 */
export const MARK_ARC = 'M77.58 73.14 A36 36 0 1 1 77.58 26.86';
export const MARK_DROP = 'M80.5 38.5 C84.1 43.6 86.9 47.3 86.9 51.2 A6.4 6.4 0 0 1 74.1 51.2 C74.1 47.3 76.9 43.6 80.5 38.5 Z';

/** Chrome gradient stops (top → bottom), shared with the hero. */
export const CHROME_STOPS: [number, string][] = [
  [0, '#6a6d74'],
  [0.3, '#1d1d1f'],
  [0.5, '#0f1012'],
  [0.68, '#7d818a'],
  [0.85, '#2a2b2f'],
  [1, '#1d1d1f'],
];

export default function LogoMark({ className = 'size-7', title, light = false }: { className?: string; title?: string; light?: boolean }) {
  const id = useId().replace(/:/g, '');
  const paint = light ? '#ffffff' : `url(#chrome-${id})`;
  return (
    <svg viewBox="0 0 100 100" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      {!light && (
        <defs>
          <linearGradient id={`chrome-${id}`} x1="0" y1="0" x2="0" y2="1">
            {CHROME_STOPS.map(([o, c]) => (
              <stop key={o} offset={o} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
      )}
      <path d={MARK_ARC} fill="none" stroke={paint} strokeWidth="13" strokeLinecap="round" />
      <path d={MARK_DROP} fill={paint} />
    </svg>
  );
}
