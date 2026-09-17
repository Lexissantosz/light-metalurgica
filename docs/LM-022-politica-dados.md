# LM-022 — Política de códigos, preços e dados da tabela oficial

## Identificação interna

- `id` é o identificador técnico único do sistema.
- `codigo` é um código comercial/original da empresa e **não precisa ser único**.
- Códigos repetidos na fonte oficial não devem ser corrigidos automaticamente quando a empresa confirma que representam linhas/equipamentos distintos.

Duplicidades intencionais já registradas:

- `2004784708006`;
- `2048536878005`;
- `2071725904407`.

## Preço público

A regra segura padrão é:

- `exibirPreco: false`;
- `precoPublico: null`.

Um valor só pode aparecer no site/PDF quando houver autorização comercial explícita e o registro tiver simultaneamente:

```json
{
  "exibirPreco": true,
  "precoPublico": 1234.56
}
```

Isso permite que a empresa futuramente escolha preço no site, apenas no PDF ou nenhum preço sem reestruturar a base. Até essa decisão, o comportamento público é **Sob consulta / Solicitar orçamento**.

## Custos internos

Custos de produção/compra não pertencem à fonte pública `data/produtos.json`.

- não exibir custo no HTML;
- não enviar custo ao navegador;
- não incluir custo no PDF comercial;
- não incluir custo no manifest de QR Code;
- se a empresa quiser controlar custo no futuro, usar uma fonte privada separada e fora da publicação estática.

A ausência de custo identificada para `SUPORTE SCOTT COM REGULAGEM` (`2091327627801`) não bloqueia o catálogo público porque custo é dado interno. Continua registrada como pendência administrativa da fonte original.

## Dados ausentes

Campos técnicos não confirmados permanecem ausentes/`null` na fonte. A interface pode apresentar `Sob consulta`.

Não preencher por inferência:

- dimensões;
- capacidade de carga;
- peso;
- espessura/material;
- acabamento/pintura;
- garantia;
- mecanismos específicos.

## Categorias

Categorias inferidas durante a importação são úteis para organização, mas continuam com `categoriaValidada: false` até confirmação comercial.

## Resultado

A base pública pode evoluir sem expor custos e sem depender da unicidade dos códigos comerciais. O sistema usa IDs internos estáveis e adota ausência de preço como padrão seguro.
