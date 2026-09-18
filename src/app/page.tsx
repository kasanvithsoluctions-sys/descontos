import Link from 'next/link';
import { ToolCard } from '@/components/tool-card';
import { StructuredData } from '@/components/structured-data';
import { publishedTools } from '@/lib/tools';
import { pageMetadata, absoluteUrl } from '@/lib/seo';
export const metadata = pageMetadata('Desconta — Calculadoras e ferramentas online', 'Ferramentas gratuitas para facilitar suas contas. Comece pela calculadora de desconto e descubra o preço final, a economia e o percentual de uma promoção.', '/');
export default function Home() {
  return <main id="conteudo">
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Desconta', url: absoluteUrl('/'), inLanguage: 'pt-BR' }} />
    <section className="container portal-hero"><span className="eyebrow">CONTAS DO DIA A DIA, SEM COMPLICAÇÃO</span><h1>Uma conta simples.<br /><span>Uma decisão mais clara.</span></h1><p>Calculadoras gratuitas, resultados imediatos e explicações que ajudam você a entender cada número.</p><Link className="portal-primary" href="/calculadora-desconto">Calcular um desconto →</Link></section>
    <section className="container portal-section"><h2>Comece pela sua próxima compra</h2><p>Compare a oferta com o preço original e saiba quanto vai economizar.</p><div className="tool-grid">{publishedTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}</div><Link className="text-link" href="/calculadoras">Explorar o catálogo de calculadoras →</Link></section>
    <section className="container portal-section portal-principles"><h2>O resultado vem primeiro</h2><div className="principle-grid"><div><h3>Sem cadastro</h3><p>Abra a ferramenta, informe os valores e veja a resposta.</p></div><div><h3>Contas transparentes</h3><p>Consulte fórmulas e exemplos na mesma página.</p></div><div><h3>Privacidade nos cálculos</h3><p>Os valores são processados no seu navegador, sem serem enviados ao servidor.</p></div></div></section>
  </main>;
}
