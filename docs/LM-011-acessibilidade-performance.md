# LM-011 — Acessibilidade e performance

## Melhorias implementadas

- link de salto para o conteúdo principal;
- foco visível consistente para teclado;
- `aria-current="page"` no item ativo da navegação;
- `aria-label` para a navegação principal;
- sincronização de `aria-expanded` e rótulo do menu mobile;
- fechamento do menu mobile com `Escape`;
- fechamento automático do menu ao retornar para viewport desktop;
- suporte a `prefers-reduced-motion`;
- `loading="lazy"` automático para imagens não prioritárias, inclusive imagens inseridas dinamicamente;
- `decoding="async"` nas imagens;
- imagens de hero/prioritárias preservadas como carregamento imediato;
- reforço automático de `noopener noreferrer` em links que abrem nova aba;
- `content-visibility: auto` para seções abaixo da primeira quando suportado pelo navegador;
- listener de scroll marcado como passivo.

## Itens que exigem validação manual

- contraste real após a identidade visual final ser integrada;
- navegação completa apenas por teclado;
- foco ao abrir/fechar o menu mobile;
- leitura dos formulários e catálogo com leitor de tela;
- Lighthouse em desktop e mobile após todos os PRs estarem integrados;
- verificação de CLS/LCP com o conjunto final de imagens.

## Otimização de imagens

As imagens atuais do catálogo são arquivos PNG. A conversão em lote para WebP/AVIF deve ser feita somente depois que o conjunto definitivo de fotos for recebido, para evitar converter arquivos provisórios e repetir trabalho. Na rodada final, comparar visualmente qualidade e tamanho antes de trocar os caminhos do catálogo.

## Regra para imagens futuras

- manter nomes estáveis;
- preferir WebP ou AVIF para fotografia/render quando a qualidade visual for equivalente;
- preservar PNG quando transparência ou fidelidade exigir;
- definir dimensões reais quando o arquivo final estiver disponível;
- não aplicar lazy loading ao principal elemento visual acima da dobra.
