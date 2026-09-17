# LM-006 — Enriquecimento dos dados dos produtos

## Objetivo

Transformar a base do catálogo em uma fonte comercial útil sem inventar especificações técnicas.

## Estrutura preparada

Cada equipamento pode receber:

- `finalidade`: finalidade confirmada do equipamento;
- `especificacoes.dimensoes`;
- `especificacoes.capacidade`;
- `especificacoes.estrutura`;
- `especificacoes.acabamento`;
- `especificacoes.personalizacao`;
- `especificacoes.garantia`;
- `precoPublico`, somente quando `exibirPreco` for explicitamente autorizado.

O contrato está documentado em `schemas/produto.schema.json`.

## Regra editorial

Ausência de informação não deve ser substituída por suposição. No site/PDF, a interface pode apresentar `Sob consulta`; na fonte de dados, o campo pode permanecer ausente ou `null` até haver confirmação.

Não inferir a partir de fotografia:

- dimensão;
- capacidade de carga;
- espessura de aço;
- sistema de pintura;
- peso do equipamento;
- garantia;
- materiais específicos;
- mecanismo interno.

## Auditoria

Execute:

```bash
node scripts/auditar-dados-produtos.mjs
```

A auditoria separa dois conceitos:

1. **erro estrutural**, que bloqueia publicação, como produto ativo sem imagem ou preço habilitado sem valor válido;
2. **dado técnico pendente**, que não bloqueia a base e deve continuar como informação não confirmada.

## Informações necessárias da empresa

Para completar esta tarefa comercialmente, solicitar ficha técnica ou dados confirmados dos equipamentos, especialmente dimensões, capacidade, acabamento, opções de personalização e garantia.

A política de exibição de preços também precisa ser definida pela empresa: sem preço, apenas PDF, ou site + PDF.
