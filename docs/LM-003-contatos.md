# LM-003 — Dados reais de contato

## Objetivo

Eliminar números, perfis e localizações fictícias do site e manter uma única fonte pública de contato.

## Fonte

Os canais oficiais ficam em:

`data/contato.json`

Campos disponíveis:

- `whatsappPrincipal`;
- `instagram`;
- `email`;
- `telefone`;
- `localidadePublica`;
- `enderecoPublico`;
- `vendedores` (`nome` + `whatsapp`).

## Dados confirmados

- WhatsApp principal: Michael Dias — +55 (61) 99689-1288
- Vendas 1: Jhade Duarte — +55 (62) 98110-2262
- Vendas 2: Leandro Santos — +55 (61) 98185-3332
- Instagram: @lightfitness_equipamentos
- E-mail: lightmetalurgica@gmail.com
- Localidade pública: Setor Industrial de Ceilândia, Brasília - DF
- Endereço público: Quadra 9, nº 10/12, Lote 10/12 - Setor Industrial de Ceilândia, Brasília - DF - CEP 72265-090

## Comportamento seguro

Canais não informados permanecem `null` e ficam ocultos. O site não usa número, perfil ou endereço fictício como fallback.

`js/contatos.js` também disponibiliza os dados confirmados em `window.LIGHT_CONTACT`, permitindo reutilização pela lista de interesse, PDF e outras funcionalidades depois da integração.

## Validação

Execute:

```bash
node scripts/validar-contatos.mjs
```

O validador rejeita placeholders óbvios, verifica formato básico de e-mail/Instagram/telefone e informa canais ainda pendentes.

A rodada manual final deve confirmar que os links de WhatsApp, Instagram e e-mail abrem os destinos corretos em desktop e celular.
