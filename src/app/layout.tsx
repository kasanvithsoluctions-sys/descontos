import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icon';
import { isSiteConfigured, siteUrl } from '@/lib/site';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Desconta',
  title: { default: 'Desconta — Calculadoras e ferramentas online', template: '%s | Desconta' },
  description: 'Calculadoras gratuitas, resultados imediatos e explicações para facilitar as contas do dia a dia.',
  robots: { index: isSiteConfigured, follow: true },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header"><div className="container header-inner">
      <Link href="/" className="logo" aria-label="Desconta, página inicial"><span className="logo-mark"><Icon name="percent" size={24} /></span>desconta<span className="logo-dot">.</span></Link>
      <nav aria-label="Navegação principal"><Link href="/calculadoras">Calculadoras</Link><Link href="/sobre">Sobre</Link></nav>
      <span className="header-note"><span />Simples desde a primeira conta.</span>
    </div></header>
    {children}
    <footer><div className="container footer-main"><div>
      <Link className="logo" href="/"><span className="logo-mark"><Icon name="percent" size={20} /></span>desconta<span className="logo-dot">.</span></Link><p>Menos contas. Mais clareza.</p>
    </div><nav aria-label="Links institucionais" className="footer-links"><Link href="/calculadoras">Calculadoras</Link><Link href="/sobre">Sobre</Link><Link href="/contato">Contato</Link><Link href="/politica-de-privacidade">Privacidade</Link><Link href="/termos">Termos</Link></nav></div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Desconta.</span><span>Ferramentas gratuitas para o seu dia a dia.</span></div>
    </footer>
  </body></html>;
}
