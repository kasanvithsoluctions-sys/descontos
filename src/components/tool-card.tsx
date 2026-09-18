import Link from 'next/link';
import type { Tool } from '@/lib/tools';
import { Icon } from './icon';
export function ToolCard({ tool }: { tool: Tool }) {
  return <Link className="tool-card" href={`/${tool.slug}`}>
    <span className="icon-box"><Icon name="calculator" /></span>
    <div><h3>{tool.name}</h3><p>{tool.description}</p><span className="tool-action">Abrir calculadora <Icon name="arrow" size={16} /></span></div>
  </Link>;
}
