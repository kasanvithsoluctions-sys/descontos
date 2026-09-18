import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('Sobre o Desconta — Contas simples e transparentes', 'Conheça o Desconta e como suas ferramentas gratuitas calculam, apresentam resultados e respeitam a privacidade dos valores informados.', '/sobre');
export default function About() {
  return <main id="conteudo" className="container prose-page"><Link className="back-link" href="/">← Início</Link><span className="eyebrow">SOBRE O PROJETO</span><h1>Sobre o Desconta</h1>
    <p>O Desconta reúne ferramentas para facilitar as contas do dia a dia. A primeira é a Calculadora de Desconto, que ajuda a comparar promoções, descobrir percentuais, simular acréscimos e encontrar o preço original.</p>
    <h2>Simples desde o primeiro cálculo</h2><p>As ferramentas são gratuitas, funcionam no celular e no computador e não exigem cadastro. Os valores são processados no seu navegador.</p>
    <h2>Como calculamos</h2><p>Usamos as fórmulas explicadas em cada ferramenta. Os preços são arredondados para centavos e os percentuais são exibidos com até duas casas decimais. Frete, taxas e condições de lojas não são incluídos automaticamente.</p>
    <h2>Uma ferramenta de cada vez</h2><p>O catálogo lista apenas calculadoras que já podem ser usadas. Cada nova ferramenta deve ter uma função clara, exemplos e explicações próprias.</p>
    <Link className="text-link" href="/calculadora-desconto">Usar a Calculadora de Desconto →</Link>
  </main>;
}
