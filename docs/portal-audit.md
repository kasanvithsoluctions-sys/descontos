# Auditoria do portal

## Diagnóstico antes das mudanças

Foram revisados todos os componentes, três páginas, CSS, funções de cálculo, metadata, sitemap, robots e testes. A base já tinha Server Components, um componente interativo isolado, sistema visual consistente, resultado em destaque e fórmulas corretas para desconto, percentual e acréscimo.

Lacunas: calculadora apenas na raiz; ausência de catálogo e registro de ferramentas; metadata social herdada e genérica; domínio padrão localhost; ausência de preço original, compartilhamento, exemplos interativos, breadcrumbs e 404 própria; conteúdo limitado sobre fórmulas; texto de privacidade em rota diferente da arquitetura solicitada; ausência de contato, termos e lint.

## Implementação

- Home própria de portal, catálogo real e ferramenta em `/calculadora-desconto`. Não há duplicação da ferramenta na home.
- Um registro tipado controla categorias, catálogo, relacionadas e sitemap. Nenhuma rota de futura ferramenta foi criada.
- Title e description individuais, canonical sem parâmetros e Open Graph/Twitter específicos por página. Metadata API nativa, sem biblioteca de SEO.
- Breadcrumbs visíveis correspondem ao BreadcrumbList. WebSite somente na home; WebApplication somente na ferramenta. Sem empresa, avaliações ou autores inventados.
- Ferramenta imediatamente após breadcrumb, H1 e descrição. Quatro modos, resultados locais, exemplos, cópia, compartilhamento e fórmulas presentes no HTML inicial.
- Perguntas reais, cálculo inverso e descontos sucessivos na mesma URL; não foram geradas páginas por números.
- Privacidade antiga redireciona permanentemente. Contato sem informação real fica noindex e fora do sitemap. O projeto continua utilizável nessa condição.
- Sem domínio configurado, noindex e sitemap vazio impedem uma configuração incompleta de ser apresentada como pronta para indexação. A publicação depende de domínio real.
- Sem scripts de anúncios ou analytics. Slot desativado por padrão, com altura reservada quando habilitado. Não há evento que envie valores financeiros.

## Revisão visual pelo código

Preservados paleta, fontes do sistema, espaçamentos, campos, resultado, foco e ícones. As quatro abas viram duas linhas em telas estreitas; exemplos ficam em duas colunas; conteúdo passa a uma coluna; tabela compacta mantém cabeçalhos e valores. Header tem links úteis e footer contém as páginas de confiança. A página não apresenta anúncios vazios por padrão.

O preço final continua em maior destaque. No modo inverso, o preço original ganha destaque adicional no resumo. Não foi adicionado gráfico por não melhorar a tarefa principal. Estados de erro, vazio, exemplo e confirmação foram mantidos.

## Verificação de performance pelo código

- Somente `src/components/calculator.tsx` declara `use client`.
- Fórmulas, FAQ, exemplos, breadcrumbs, links e títulos são renderizados no servidor.
- Formatação Intl reutilizada, sem bibliotecas de gráficos, state manager, imagens grandes ou fontes de rede.
- Nenhum script externo é carregado.
- Layout do slot estável quando habilitado; os exemplos não geram navegações nem requests.

Isso reduz trabalho e dependências, mas não comprova os valores de Core Web Vitals. É necessária medição em navegador e dados reais após publicação.

## Fontes técnicas consultadas

- [Metadata API e imagens sociais do Next.js](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Configuração de lint no Next.js](https://nextjs.org/docs/app/api-reference/config/eslint)

## Publicação e revisão humana

Configure domínio, e-mail real e, se disponível, o token do Search Console em `.env.local`; consulte o README. Complete a descrição de hospedagem e os dados reais do responsável quando definidos. As páginas de confiança descrevem esta implementação, não substituem revisão jurídica específica do serviço publicado.

## Resultados da validação nesta etapa

- Lint local com TypeScript: passou (tipos, símbolos não usados e regras de código).
- Testes de fórmulas: 7 casos passaram, incluindo cenários internos de arredondamento, limites, exemplos e descontos sucessivos.
- Testes de catálogo e metadata: 3 passaram.
- Testes de renderização de servidor: 4 passaram. Verificam um H1 por página, links internos reais, JSON-LD válido, ferramenta e conteúdo antes da hidratação, 404 e regras de sitemap/robots.
- A renderização também foi verificada com domínio/e-mail fictícios exclusivamente no processo de testes para cobrir o ramo configurado. Nenhum desses valores foi salvo na configuração do site.
- CSS: revisão de breakpoints e estrutura. A única declaração `use client` permanece na calculadora.
- Build padrão do Next.js: tentou compilar, mas o sandbox bloqueou a abertura da porta interna do Turbopack (`Operation not permitted`). A solicitação de execução fora do sandbox foi recusada.
- Chromium: o sandbox bloqueou a criação de sockets. A solicitação conjunta de build e auditoria visual fora do sandbox foi recusada. Não houve validação de pixels, interações reais, overflow real, respostas HTTP de produção ou medição de Core Web Vitals.
- O download para instalar ESLint foi recusado. O lint entregue é local e usa TypeScript, sem nova dependência; essa distinção está documentada no README.

## Verificação restante em ambiente autorizado

Após `npm run build`, execute:

```sh
BROWSER_PATH=/caminho/para/chromium node scripts/browser-audit.mjs
```

O roteiro inicia e encerra servidor local/Chromium; verifica larguras 320, 360, 375, 390, 430, 768, 1024 e 1440, cálculos, exemplos, abas por teclado, erros, cópia/compartilhamento com APIs simuladas, páginas, redirect e 404. Salva capturas e observações locais em `/tmp/desconta-portal-audit`. O roteiro teve sintaxe validada, mas sua execução integrada ficou pendente. Inspecione as capturas independentemente dos testes automáticos. Teste ainda zoom de 200%, leitor de tela e navegação sem JavaScript.

Os objetivos LCP ≤ 2,5s, INP ≤ 200ms e CLS ≤ 0,1 devem ser verificados no site publicado. As observações locais do roteiro não representam métricas de usuários reais nem medem INP de campo.
