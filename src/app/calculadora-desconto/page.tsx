import { Calculator } from '@/components/calculator';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { RelatedTools } from '@/components/related-tools';
import { StructuredData } from '@/components/structured-data';
import { AdSlot } from '@/components/ad-slot';
import { publishedTools } from '@/lib/tools';
import { absoluteUrl, pageMetadata } from '@/lib/seo';
const tool = publishedTools.find(item => item.slug === 'calculadora-desconto')!;
export const metadata = pageMetadata(tool.title, tool.metaDescription, `/${tool.slug}`);
const questions = [
  ['Quanto é 20% de desconto em R$ 100?', 'O desconto é de R$ 20,00. Subtraindo esse valor de R$ 100,00, o preço final é R$ 80,00.'],
  ['Como calcular 30% de desconto?', 'Multiplique o preço por 0,30 para obter a economia, ou por 0,70 para obter o preço final. Em R$ 1.000,00, você economiza R$ 300,00 e paga R$ 700,00.'],
  ['Como descobrir a porcentagem de desconto entre dois preços?', 'Divida a diferença entre o preço original e o promocional pelo preço original e multiplique por 100. De R$ 500,00 por R$ 400,00, o desconto é de 20%. Use a aba “Descobrir percentual”.'],
  ['Como descobrir o preço original antes do desconto?', 'Divida o preço final por (1 − desconto ÷ 100). Um preço final de R$ 800,00 após 20% de desconto corresponde a R$ 1.000,00. Use a aba “Preço original”. Com 100% de desconto, não é possível determinar um preço original único.'],
  ['Dois descontos de 20% equivalem a 40%?', 'Não. O segundo desconto incide sobre o preço já reduzido: R$ 100,00 vira R$ 80,00 e depois R$ 64,00. O desconto total é de 36%.'],
  ['Como calcular descontos sucessivos?', 'Aplique cada desconto ao resultado anterior. Para encontrar o desconto total, divida a economia acumulada pelo preço inicial e multiplique por 100. Não some os percentuais.'],
  ['Como calcular acréscimo percentual?', 'Multiplique o preço por (1 + percentual ÷ 100). R$ 500,00 com 20% de acréscimo resulta em R$ 600,00. A aba “Calcular acréscimo” faz essa conta.'],
];
export default function DiscountPage() {
  return <main id="conteudo">
    <Breadcrumbs items={[{ name: 'Início', href: '/' }, { name: 'Calculadoras', href: '/calculadoras' }, { name: tool.name, href: `/${tool.slug}` }]} />
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: tool.name, url: absoluteUrl(`/${tool.slug}`), applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', inLanguage: 'pt-BR', offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' }, description: tool.description }} />
    <header className="hero tool-hero container"><h1>Calculadora de <span>Desconto</span></h1><p>Calcule o preço final de um produto e descubra quanto você economiza.</p></header>
    <div className="container calculator-container"><Calculator /></div>
    <AdSlot />
    <div className="container guide-grid" id="como-funciona">
      <section id="como-calcular"><h2>Como calcular desconto?</h2><p>Multiplique o preço original pelo percentual e divida por 100. Esse é o valor que você economiza. Subtraia a economia do preço original para encontrar o preço final.</p><p>Em uma compra de <strong>R$ 500,00 com 20% de desconto</strong>: 500 × 20 ÷ 100 = 100. Depois, 500 − 100 = 400. Você paga <strong>R$ 400,00</strong>.</p></section>
      <section id="formulas"><h2>Qual é a fórmula do desconto?</h2><div className="formula formula-block"><p>Valor do desconto = preço × percentual ÷ 100</p><p>Preço final = preço − valor do desconto</p></div><p>Para chegar diretamente ao preço final, use: preço × (1 − percentual ÷ 100).</p></section>
      <section id="porcentagem"><h2>Como descobrir a porcentagem de desconto?</h2><p>Compare o preço original com o promocional. A diferença dividida pelo preço original revela a proporção economizada.</p><div className="formula formula-block">Desconto (%) = (preço original − preço final) ÷ preço original × 100</div><p>De R$ 500,00 por R$ 400,00: (500 − 400) ÷ 500 × 100 = <strong>20%</strong>. Na ferramenta, selecione “Descobrir percentual”.</p></section>
      <section id="preco-original"><h2>Como descobrir o preço original?</h2><p>Se você conhece o preço final e o desconto aplicado, divida o valor pago pela proporção restante do preço.</p><div className="formula formula-block">Preço original = preço final ÷ (1 − desconto ÷ 100)</div><p>R$ 800,00 após 20% de desconto: 800 ÷ 0,80 = <strong>R$ 1.000,00</strong>. A aba “Preço original” faz esse cálculo. O percentual precisa ser menor que 100%.</p></section>
      <section id="sucessivos"><h2>Como calcular descontos sucessivos?</h2><p>Cada desconto é aplicado ao preço que restou, por isso os percentuais não devem ser somados.</p><ol className="calculation-steps"><li>R$ 100,00 − 20% = <strong>R$ 80,00</strong></li><li>R$ 80,00 − 20% = <strong>R$ 64,00</strong></li><li>Economia total: R$ 36,00, ou <strong>36%</strong>.</li></ol><p>Para dois descontos: total (%) = [1 − (1 − d₁ ÷ 100) × (1 − d₂ ÷ 100)] × 100. Na calculadora, aplique o primeiro desconto e use o preço final como preço original na segunda conta.</p></section>
      <section id="acrescimo"><h2>Como calcular um acréscimo?</h2><p>O acréscimo aumenta o preço. Multiplique o valor original pelo percentual e some o aumento ao preço.</p><div className="formula formula-block">Preço final = preço original × (1 + percentual ÷ 100)</div><p>R$ 500,00 com 20% de acréscimo vira <strong>R$ 600,00</strong>. Para simular, selecione a aba “Calcular acréscimo”.</p></section>
    </div>
    <section className="container portal-section examples-table"><h2>Exemplos de cálculo</h2><p>Compare a economia e o valor a pagar em quatro situações.</p><div className="table-scroll"><table><caption className="sr-only">Preço original, desconto, economia e preço final</caption><thead><tr><th scope="col">Preço original</th><th scope="col">Desconto</th><th scope="col">Economia</th><th scope="col">Preço final</th></tr></thead><tbody>{[[100, 10, 10, 90], [500, 20, 100, 400], [1000, 30, 300, 700], [250, 50, 125, 125]].map(([price, rate, saving, final]) => <tr key={price}><th scope="row">R$ {price.toLocaleString('pt-BR')}</th><td>{rate}%</td><td>R$ {saving}</td><td><strong>R$ {final}</strong></td></tr>)}</tbody></table></div><p className="field-help">Os cálculos monetários são arredondados para centavos. Frete, taxas e condições específicas da loja não são incluídos.</p></section>
    <section id="perguntas" className="container faq-section"><div className="faq-intro"><span className="eyebrow">DÚVIDAS DO DIA A DIA</span><h2>Perguntas frequentes</h2><p>Respostas rápidas para entender cada cálculo.</p></div><div className="faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
    <RelatedTools slug={tool.slug} />
  </main>;
}
