# LM-010 — SEO técnico

## Implementado

- metadados de título e descrição por página;
- Open Graph e Twitter Card;
- canonical calculado a partir da URL pública atual;
- metadados dinâmicos na página individual de produto;
- Schema.org `Organization`, `WebSite` e `Product`;
- favicon SVG da marca;
- gerador de `robots.txt` e `sitemap.xml` baseado na URL pública final;
- inclusão automática de produtos públicos no sitemap;
- workflow de validação para os arquivos de publicação.

## Regra importante

Nenhum domínio fictício é gravado no projeto. `robots.txt`, `sitemap.xml`, QR Codes e URLs absolutas de publicação só devem ser consolidados depois que `CATALOGO_SITE_URL` estiver configurada com a URL pública definitiva.

## Publicação

Com a Repository Variable `CATALOGO_SITE_URL` configurada, execute:

```bash
SITE_URL="https://dominio-publico" python scripts/gerar_seo_publicacao.py
```

O workflow `Validar SEO de publicação` executa a mesma geração e publica os arquivos como artifact para revisão.

## Validação final

- conferir títulos e descrições das páginas;
- abrir um produto e inspecionar `og:title`, `og:image` e Schema Product;
- confirmar canonical sem parâmetros desnecessários;
- validar `robots.txt` e `sitemap.xml` no domínio final;
- conferir favicon no navegador;
- testar compartilhamento do link em aplicativo que leia Open Graph.
