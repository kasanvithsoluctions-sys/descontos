# Desconta

Calculadora de desconto com Next.js App Router, TypeScript e Tailwind CSS 4. Interface em português, responsiva, três modos de cálculo e resultados instantâneos. Sem fontes remotas ou bibliotecas de ícones.

## Executar

Requer Node.js 20.9 ou superior e npm.

```sh
npm install
npm run dev
```

Acesse http://localhost:3000.

```sh
npm run test
npm run typecheck
npm run build
npm start
```

## Publicação e SEO

Copie `.env.example` para `.env.local` e defina `NEXT_PUBLIC_SITE_URL` com a URL pública real antes do build. Isso configura sitemap, robots, URLs canônicas e dados estruturados. Sem essa configuração, a URL de desenvolvimento é utilizada. A página principal e os textos explicativos são renderizados pelo servidor; apenas a calculadora usa estado no cliente.

## Publicidade

`src/components/ad-slot.tsx` reserva espaço estável fora do formulário para reduzir mudanças de layout. Nenhum anúncio ou rastreador está ativo. Para monetizar, obtenha aprovação do AdSense, configure a conta e os blocos, implemente consentimento conforme aplicável e atualize a página de privacidade com o operador, contato e provedor de hospedagem reais. Só então conecte o script e os IDs reais. Adicione `public/ads.txt` com a linha fornecida pela sua conta quando necessário. Não há IDs fictícios em produção.

## Organização

- `src/lib/calculations.ts`: fórmulas, validação e formatação.
- `src/components/calculator.tsx`: modos, campos e resultados.
- `src/app/page.tsx`: conteúdo indexável e dados estruturados.
- `src/app/globals.css`: identidade visual e regras responsivas.
- `tests/calculations.test.ts`: exemplos, limites e arredondamento.

Novos modos podem ser adicionados ao tipo `Mode`, à função `calculate` e à configuração de abas. Cálculos monetários são arredondados para centavos; não incluem frete nem descontos sucessivos automaticamente.

## Validação neste ambiente

Node.js e npm não estavam disponíveis e a autorização para download foi recusada. Os comandos de build, TypeScript e testes precisam ser executados em um ambiente com Node.js. Não há pontuação de Lighthouse medida nem garantia de posicionamento ou aprovação do AdSense.
