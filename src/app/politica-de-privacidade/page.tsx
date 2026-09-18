import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('Política de privacidade | Desconta', 'Entenda o tratamento dos valores da calculadora, a cópia de resultados e o compartilhamento no Desconta.', '/politica-de-privacidade');
export default function Privacy() {
  return <main id="conteudo" className="container prose-page"><Link className="back-link" href="/">← Início</Link><h1>Política de privacidade</h1>
    <h2>Seus cálculos</h2><p>Os valores digitados são processados no navegador. A aplicação não envia os cálculos para um servidor nem os salva em cookies ou armazenamento local. Recarregar a página apaga os valores alterados.</p>
    <h2>Copiar e compartilhar</h2><p>Ao copiar um resultado, você envia o texto à área de transferência do dispositivo. Ao compartilhar, os valores e o link da ferramenta são entregues ao aplicativo que você escolher. Esse aplicativo possui suas próprias regras de privacidade. O link não contém os valores informados.</p>
    <h2>Cookies, anúncios e estatísticas</h2><p>Esta versão não carrega publicidade ou serviços de análise de audiência e não cria cookies para rastreamento. A política e os controles de consentimento deverão ser atualizados antes da ativação desses serviços.</p>
    <h2>Dados técnicos da hospedagem</h2><p>A entrega do site pode envolver registros técnicos, como endereço IP e requisições. O tratamento e o prazo de retenção dependem do provedor de hospedagem escolhido.</p>
    <h2>Dúvidas sobre privacidade</h2><p>Consulte a <Link href="/contato">página de contato</Link> para verificar a disponibilidade do canal de atendimento.</p>
  </main>;
}
