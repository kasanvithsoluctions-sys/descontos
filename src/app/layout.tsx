import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icon';
import { siteUrl } from '@/lib/site';
import './globals.css';
export const metadata: Metadata = {
 metadataBase: new URL(siteUrl),
 title: { default: 'Calculadora de Desconto Online e Grátis | Desconta', template: '%s | Desconta' },
 description: 'Calcule descontos, descubra a porcentagem de uma promoção e simule acréscimos. Veja o preço final e quanto você economiza na hora, sem cadastro.',
 openGraph: { title: 'Calculadora de Desconto | Desconta', description: 'Menos contas. Mais economia. Calcule o preço final em segundos.', locale: 'pt_BR', type: 'website', siteName: 'Desconta' },
 twitter: { card: 'summary', title: 'Calculadora de Desconto | Desconta' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="pt-BR"><body><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><header className="site-header"><div className="container header-inner"><Link href="/" className="logo" aria-label="Desconta, página inicial"><span className="logo-mark"><Icon name="percent" size={24}/></span>desconta<span className="logo-dot">.</span></Link><nav aria-label="Navegação principal"><Link href="/#calculadora" className="nav-active">Calculadoras</Link><Link href="/#como-funciona">Como funciona</Link><Link href="/#perguntas">Dúvidas frequentes</Link></nav><span className="header-note"><span/>Grátis. Simples. Sem cadastro.</span></div></header>{children}<footer><div className="container footer-main"><div><Link className="logo" href="/"><span className="logo-mark"><Icon name="percent" size={20}/></span>desconta<span className="logo-dot">.</span></Link><p>Menos contas. Mais economia.</p></div><div className="footer-links"><Link href="/sobre">Sobre o Desconta</Link><Link href="/privacidade">Privacidade</Link><Link href="/#perguntas">Perguntas frequentes</Link></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Desconta. Todos os direitos reservados.</span><span>Feito para facilitar o seu dia <Icon name="heart" size={13}/></span></div></footer></body></html>;
}
