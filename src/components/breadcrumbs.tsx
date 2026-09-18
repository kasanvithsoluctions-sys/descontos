import Link from 'next/link';
import { absoluteUrl } from '@/lib/seo';
import { StructuredData } from './structured-data';
export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return <>
    <nav className="breadcrumbs container" aria-label="Caminho de navegação">
      <ol>{items.map((item, index) => <li key={item.href}>
        {index > 0 && <span aria-hidden="true">/</span>}
        {index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.href}>{item.name}</Link>}
      </li>)}</ol>
    </nav>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(item.href) })) }} />
  </>;
}
