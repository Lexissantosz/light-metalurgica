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

## Comportamento seguro

Enquanto um dado não estiver confirmado, o valor permanece `null` e o canal correspondente fica oculto. O site não usa número/perfil de exemplo como fallback.

`js/contatos.js` também disponibiliza os dados confirmados em `window.LIGHT_CONTACT`, permitindo reutilização pela lista de interesse, PDF e outras funcionalidades depois da integração.

## Validação

Execute:

```bash
node scripts/validar-contatos.mjs
```

O validador rejeita placeholders óbvios, verifica formato básico de e-mail/Instagram/telefone e informa canais ainda pendentes.

## Informações que ainda precisam vir da empresa

- WhatsApp principal ou WhatsApps dos vendedores;
- nome dos vendedores que devem aparecer;
- Instagram oficial;
- e-mail comercial, caso exista;
- telefone convencional, se houver;
- localidade/endereço que a empresa deseja publicar.

Não preencher nenhum desses campos por inferência.
