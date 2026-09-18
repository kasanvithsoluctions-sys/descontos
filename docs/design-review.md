# Revisão da interface — etapa 2

## Análise antes das alterações

Foram lidas as três páginas (`/`, `/sobre`, `/privacidade`), layout, calculadora, ícones, espaço publicitário, CSS global, funções de cálculo e configuração de SEO.

A identidade existente usava verde, fundos claros, ícones lineares e uma calculadora dividida entre formulário e resultado. Foram preservados a identidade, os três modos, os atalhos, os cálculos locais, o conteúdo indexável, o FAQ nativo e as rotas de SEO.

Problemas encontrados no código:

- Textos de 8–12px e muitas cores secundárias claras, especialmente no celular.
- Valores de espaçamento, borda e cor dispersos pelo CSS, com diferenças entre os componentes.
- Botões de atalho, limpar e copiar com áreas pequenas; hover ausente em vários links e ações.
- Abas com semântica de tabs, mas sem as teclas de navegação correspondentes.
- Trocar de aba ou clicar novamente na aba ativa substituía o valor digitado.
- Erro genérico marcava ambos os campos; o botão de calcular não direcionava ao erro nem ao resultado.
- Resultado predefinido não identificado como exemplo; limpeza mantinha indicadores de sucesso.
- Fórmula com `white-space: nowrap`, colunas apertadas no tablet e quebras de linha ocultas que juntavam palavras no FAQ.
- Link de navegação marcado como ativo também nas páginas institucionais.
- Slogans repetidos, indicação visual de link em texto não clicável e publicidade com aparência de placeholder de desenvolvimento.

## Decisões implementadas

- Tokens de cor, raios, sombra leve e espaçamento; pilha de fontes do sistema, sem downloads.
- Corpo em 16px, conteúdo auxiliar predominantemente em 13–14px e rótulos pequenos reservados a metadados.
- Container de 1040px com alinhamento entre ferramenta e conteúdo; uma coluna na calculadora até 760px.
- Controles com altura mínima de 44px, inputs de 56px e foco visível consistente.
- Resultado destacado com números tabulares, economia separada e tratamento de valores extensos.
- Abas com setas, Home/End, foco móvel e valores independentes preservados em memória.
- Validação por campo após sair do campo ou enviar, foco no erro e foco no resultado após cálculo explícito.
- Atualização automática preservada; anúncio para leitor de tela com atraso de 400ms para reduzir interrupções.
- Estados de exemplo, vazio, inválido, cópia confirmada e falha de cópia.
- Conteúdo mais direto; páginas institucionais com retorno à calculadora; FAQ sem quebras forçadas.
- Publicidade mantém área reservada e identificação discreta. Nenhum script foi adicionado.

As fórmulas, dependências e configurações de SEO não foram alteradas nesta etapa.

## Verificações da etapa

- TypeScript: `tsc --noEmit` concluído sem erros.
- Três testes existentes de cálculos, limites, arredondamento e entrada brasileira: passaram.
- JSON de configuração e delimitadores do CSS: válidos.
- Contraste calculado para sete pares principais de texto/fundo: entre 4,75:1 e 12,02:1. Isso verifica a paleta, não substitui uma auditoria completa de acessibilidade.
- Build de produção: tentado, bloqueado pela proibição de abrir a porta interna do Turbopack no sandbox. A autorização de execução externa foi recusada.
- Chromium: abertura bloqueada pelo isolamento; não houve inspeção de pixels, medição real de overflow ou teste de interação no navegador. Os breakpoints foram revisados no código; precisam de confirmação visual em 320, 375, 768, 1024 e 1440px.

### Checklist de confirmação no navegador

1. Conferir as três rotas nas larguras acima e com zoom de 200%.
2. Trocar abas com setas, Home e End; retornar à primeira e verificar os valores preservados.
3. Digitar valor inválido, sair do campo e enviar; verificar mensagem e foco no campo correto.
4. Limpar, preencher e calcular; verificar foco no resultado e atualização automática posterior.
5. Copiar e alterar um valor; a confirmação deve desaparecer.
6. Abrir FAQ pelo teclado e conferir a leitura de erros e resultados com leitor de tela.
