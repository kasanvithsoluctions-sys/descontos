import Link from 'next/link';
export default function NotFound() {
  return <main id="conteudo" className="container prose-page"><span className="eyebrow">ERRO 404</span><h1>Página não encontrada</h1><p>Este endereço não corresponde a uma página disponível. Encontre uma ferramenta no catálogo ou volte à calculadora de desconto.</p><Link className="portal-primary" href="/calculadoras">Ver calculadoras</Link><br /><Link className="text-link" href="/calculadora-desconto">Calculadora de Desconto →</Link></main>;
}
