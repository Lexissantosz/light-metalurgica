# LM-015 — Estratégia de importação da lista oficial

## Objetivo

Incorporar a tabela oficial de equipamentos ao catálogo sem quebrar os 10 produtos demonstrativos já publicados e sem expor informações internas.

## Regras adotadas

- A tabela oficial possui 91 linhas de equipamentos e 88 códigos distintos.
- Os códigos `2004784708006`, `2048536878005` e `2071725904407` aparecem duas vezes e foram confirmados pela empresa como duplicidades intencionais.
- `codigo` é um código comercial e não funciona como identificador único do sistema.
- Cada registro recebe um `id` interno único.
- O registro oficial já existente do Abdominal Máquina Mod Import mantém o `id` 1.
- As demais 90 linhas oficiais recebem IDs de 30 a 119.
- Os 10 produtos demonstrativos atuais mantêm seus IDs, imagens, estado ativo e destaques da Home.
- Esses 10 registros ficam marcados com `origem: "catalogo-demonstrativo"` e `mapeamentoOficialPendente: true` até que a equivalência com itens da tabela oficial seja confirmada.
- Os 91 registros oficiais ficam marcados com `origem: "tabela-oficial"`.
- Equipamentos oficiais sem imagem permanecem com `ativoNoSite: false`.
- Preços públicos continuam desativados.
- Custos internos não são armazenados em `data/produtos.json`.
- Categorias dos novos registros foram inferidas pelo nome do equipamento apenas para organização inicial e ficam com `categoriaValidada: false`.
- `nomeOriginal` preserva exatamente o nome presente na tabela oficial.

## Estado após a importação

- 101 registros totais em `data/produtos.json`;
- 91 registros oficiais;
- 10 registros demonstrativos preservados;
- 10 produtos ativos no site;
- 101 IDs únicos;
- 101 slugs únicos;
- 88 códigos oficiais distintos;
- nenhuma alteração intencional no comportamento público atual do catálogo.

## Próximas validações

1. Confirmar com a empresa quais dos 10 produtos demonstrativos correspondem a equipamentos oficiais.
2. Migrar imagem e destaque para o registro oficial correspondente quando a equivalência for confirmada.
3. Validar categorias comerciais.
4. Ativar novos equipamentos conforme fotos e dados forem disponibilizados.
5. Definir política de exibição de preço público.
