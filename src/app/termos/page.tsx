import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('Termos de uso | Desconta', 'Entenda o funcionamento, o arredondamento e os limites dos resultados das calculadoras gratuitas do Desconta.', '/termos');
export default function Terms() {
  return <main id="conteudo" className="container prose-page"><Link className="back-link" href="/">← Início</Link><h1>Termos de uso</h1>
    <h2>Uso das ferramentas</h2><p>As calculadoras são gratuitas e não exigem cadastro. Os resultados dependem dos valores informados e das fórmulas descritas na página de cada ferramenta.</p>
    <h2>Precisão e limites</h2><p>Os resultados monetários são arredondados para centavos. A calculadora de desconto não inclui automaticamente frete, tributos, juros ou regras comerciais. O preço original calculado a partir de um preço final arredondado é uma estimativa também arredondada.</p>
    <h2>Conferência dos resultados</h2><p>Antes de concluir uma compra ou tomar uma decisão, confira o preço e as condições com o estabelecimento. Uma simulação não constitui oferta comercial, contrato ou orientação financeira personalizada.</p>
    <h2>Privacidade e melhorias</h2><p>Consulte a <Link href="/politica-de-privacidade">política de privacidade</Link> para entender o uso dos dados. As ferramentas e estas informações podem ser atualizadas para corrigir problemas e melhorar o serviço.</p>
  </main>;
}
