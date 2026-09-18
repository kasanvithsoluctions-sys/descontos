import Link from 'next/link';
import { contactEmail, isContactConfigured } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('Contato — Sugestões e correções | Desconta', 'Veja como enviar sugestões de ferramentas e comunicar problemas nos cálculos ou na navegação do Desconta.', '/contato', isContactConfigured);
export default function Contact() {
  return <main id="conteudo" className="container prose-page"><Link className="back-link" href="/">← Início</Link><h1>Contato</h1><p>Sugestões e relatos de problemas ajudam a melhorar as ferramentas.</p>
    <h2>Como falar com o Desconta</h2>{isContactConfigured ? <p>Envie sua mensagem para <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p> : <p>O canal de contato ainda não está disponível. Esta página será atualizada quando houver um endereço de atendimento.</p>}
    <h2>Ao relatar um problema</h2><p>Informe qual ferramenta e qual modo você utilizou, o resultado esperado e o dispositivo ou navegador. Use valores fictícios no exemplo e não envie dados pessoais ou informações financeiras sensíveis.</p>
    <p>Para consultar as contas, veja as <Link href="/calculadora-desconto#formulas">fórmulas da Calculadora de Desconto</Link>.</p>
  </main>;
}
