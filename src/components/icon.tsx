import type { CSSProperties } from 'react';
export function Icon({ name, size = 20, style }: { name: string; size?: number; style?: CSSProperties }) {
 const paths: Record<string, React.ReactNode> = {
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  check: <path d="m5 12 4 4L19 6" />,
  shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/></>,
  bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
  percent: <><path d="M6 18 18 6"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/></>,
  plus: <path d="M12 5v14M5 12h14" />,
  calculator: <><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M8 6h8M8 11h1m6 0h1M8 15h1m6 0h1M8 19h1m6 0h1"/></>,
  reset: <><path d="M3 10a9 9 0 1 1 2 9M3 4v6h6"/></>,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/></>,
  tag: <><path d="M3 3h9l9 9-9 9-9-9V3Z"/><circle cx="8" cy="8" r="1"/></>,
  heart: <path d="M20 5c-3-3-7-1-8 1-1-2-5-4-8-1-5 5 8 15 8 15S25 10 20 5Z" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  book: <><path d="M12 5v16M12 5C8 2 3 3 3 3v15s5-1 9 3c4-4 9-3 9-3V3s-5-1-9 2Z"/></>,
 };
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{paths[name] || paths.calculator}</svg>;
}
