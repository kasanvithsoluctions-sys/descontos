# Desconta

Portal de calculadoras com Next.js App Router, TypeScript e Tailwind CSS. A ferramenta publicada é a Calculadora de Desconto, com quatro modos, exemplos clicáveis, cópia e compartilhamento. Nenhum backend, banco, fonte remota ou rastreador.

## Executar

Node.js 20.9+ e npm:

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

`lint` usa o parser/compilador TypeScript instalado: tipos, símbolos não usados, fallthrough, `any`, `var`, debugger, console em código da aplicação, alt e links com abertura de janela. Não é ESLint e não substitui uma auditoria de acessibilidade no navegador. Não foi adicionada dependência para esse comando.

## Configuração de publicação

Copie `.env.example` para `.env.local` e informe:

- `NEXT_PUBLIC_SITE_URL`: origem HTTPS real do site. Configura canonical, Open Graph, breadcrumbs e sitemap. Sem domínio configurado, as páginas recebem `noindex` e o sitemap fica vazio; localhost é usado apenas como base de desenvolvimento. Configure e refaça o build antes de publicar.
- `CONTACT_EMAIL`: e-mail real de atendimento. Sem ele, contato informa a indisponibilidade do canal, fica `noindex` e não entra no sitemap.
- `GOOGLE_SITE_VERIFICATION`: token real opcional do Search Console. A Metadata API em `src/app/layout.tsx` gera a meta tag. Nenhum código fictício é usado.
- `ADS_ENABLED`: `false` por padrão. `true` reserva uma área identificada após a ferramenta e seus exemplos, sem carregar anúncios.

Depois de configurar o domínio, confira `/robots.txt`, `/sitemap.xml`, as URLs canônicas e a ausência de `noindex` nas páginas públicas. Envie o sitemap real no Search Console. Para homologação pública, mantenha `noindex` ou proteja o ambiente; não use o domínio de produção em uma cópia pública indexável.

## Rotas

- `/`: apresentação do portal e acesso à ferramenta principal.
- `/calculadoras`: catálogo por categoria, apenas com ferramentas publicadas.
- `/calculadora-desconto`: ferramenta, fórmulas, exemplos e FAQ.
- `/sobre`, `/contato`, `/politica-de-privacidade`, `/termos`: informações do projeto.
- `/privacidade`: redirecionamento permanente à política atual.
- Demais URLs: 404 do Next.js com navegação útil.

Os resultados não geram URLs, parâmetros ou páginas indexáveis. Compartilhar envia texto e um link limpo somente quando solicitado pelo usuário. Não há analytics ou abstração de analytics existente; nenhum serviço foi adicionado.

## Adicionar uma calculadora

1. Implemente uma rota explícita em `src/app/calculadora-nome/page.tsx`, mantendo conteúdo e metadata no servidor.
2. Crie as funções puras e testes de fórmulas/limites em `src/lib` e `tests`.
3. Isole apenas os controles interativos em um Client Component.
4. Inclua descrição, fórmula, exemplos, dúvidas específicas, breadcrumbs e links úteis.
5. Cadastre em `src/lib/tools.ts` com slug, categoria, title, description e status `published` apenas após finalizar a ferramenta. Não crie rotas de rascunho publicamente acessíveis.
6. Use `pageMetadata`, `Breadcrumbs`, `ToolCard` e `RelatedTools`. Catálogo e sitemap incluem os registros publicados; relacionadas incluem ferramentas da mesma categoria ou explicitamente relacionadas.
7. Valide a rota e seus links, metadata, mobile, cálculos e build.

Categorias disponíveis no registro: dinheiro, matemática, datas e conversores. Categorias vazias não aparecem. A sequência sugerida é porcentagem, acréscimo, parcelamento, juros, margem/markup, regra de três e média. Não há páginas vazias nem geração de URLs por números.

## Publicidade futura

O slot existente fica fora da ferramenta, depois dos exemplos. Sua altura é estável (280px) tanto com anúncio quanto sem carregamento. Para ativação real: configure conta e blocos aprovados, consentimento aplicável, dimensões compatíveis com o espaço reservado e atualização da política com dados reais do operador e hospedagem. Acrescente `ads.txt` somente com a linha real fornecida pela conta. Nenhum script ou ID fictício foi inserido. Não coloque anúncios entre campos, botão e resultado.

## Precisão

Preços são arredondados para centavos e percentuais exibidos com até duas casas decimais. `1.000` significa mil na convenção brasileira; para uma fração use vírgula. Decimal com ponto sem agrupamento, como `500.50`, também é aceito. No cálculo inverso, um preço final arredondado permite estimar o preço original, não recuperar precisão que já foi perdida. Um desconto de 100% não determina preço original único. Descontos sucessivos podem ser calculados usando o resultado de uma etapa como preço da seguinte.

## Auditoria

Veja `docs/portal-audit.md` para os resultados verificados e as limitações do ambiente. As metas LCP ≤ 2,5s, INP ≤ 200ms e CLS ≤ 0,1 são objetivos; não foram presumidas como medições. Faça a aferição no domínio publicado e acompanhe dados de campo no Search Console.

### Auditoria visual reproduzível

Com build concluído e um Chromium instalado:

```sh
BROWSER_PATH=/caminho/para/chromium node scripts/browser-audit.mjs
```

O script usa um servidor temporário na porta 3100 e Chromium na porta de depuração 9223. As capturas ficam em `/tmp/desconta-portal-audit`. Veja as limitações e resultados em `docs/portal-audit.md`.
