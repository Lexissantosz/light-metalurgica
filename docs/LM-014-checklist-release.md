# LM-014 — Checklist final de release

Esta checklist deve ser executada **uma única vez no release candidate integrado**, depois que todas as LMs técnicas estiverem reunidas e antes do merge final em `main`.

## 1. Pré-validação automatizada

```bash
node scripts/release-check.mjs
```

Não iniciar a publicação se houver erro bloqueante.

## 2. Home

- carregar sem erro no console;
- menu desktop e mobile;
- hero sem corte de título/acento;
- equipamento de destaque correto;
- três destaques abrindo páginas válidas;
- CTAs de catálogo e orçamento;
- nenhuma alegação comercial não confirmada.

## 3. Catálogo

- total de produtos/categorias correto;
- busca por nome;
- busca por categoria;
- busca por código quando houver;
- todos os filtros;
- filtro + busca combinados;
- estado sem resultados;
- cards, imagens, títulos e CTAs;
- lista de interesse;
- teclado/foco.

## 4. Produto individual

Testar uma amostra de categorias diferentes e também:

- URL sem ID;
- ID inexistente;
- imagem;
- categoria/código;
- descrição;
- ficha comercial;
- preço oculto quando não autorizado;
- relacionados sem repetir o atual;
- orçamento específico;
- compartilhar link;
- adicionar à lista de interesse.

## 5. Lista de interesse

- adicionar três equipamentos;
- impedir duplicado;
- persistir entre páginas;
- remover item;
- limpar lista;
- abrir pedido conjunto;
- confirmar preenchimento do formulário;
- testar WhatsApp quando o número real estiver configurado.

## 6. Contato

- nenhum placeholder;
- nomes de vendedores corretos;
- todos os WhatsApps em celular real;
- Instagram oficial;
- e-mail/telefone, se publicados;
- localidade/endereço conforme autorização da empresa;
- formulário vazio deve bloquear campos obrigatórios;
- envio real pelo Formspree;
- carregamento, sucesso e erro;
- impedir envio duplicado.

## 7. Catálogo digital e PDF

- abrir `catalogo.html`;
- contagem e produtos corretos;
- download do PDF;
- capa;
- índice;
- todas as páginas sem sobreposição/corte;
- imagens corretas;
- data/versão;
- nenhum custo interno;
- preços apenas quando autorizados;
- contatos corretos;
- QR da capa e amostra de produtos.

## 8. QR Codes

Em celular real:

- QR do site;
- QR do catálogo;
- pelo menos cinco produtos de IDs diferentes;
- validar URL de destino;
- imprimir ao menos uma amostra em tamanho de uso real;
- manter margem branca do QR.

## 9. Responsividade

Testar aproximadamente:

- 360 px;
- 390/412 px;
- 640 px;
- 768 px;
- 980 px;
- 1280 px;
- desktop largo;
- celular em paisagem.

Critérios: sem rolagem horizontal de layout, sobreposição, texto cortado, botão inacessível ou imagem deformada.

## 10. Acessibilidade

- navegar só com teclado;
- foco visível;
- link “Pular para o conteúdo”;
- menu mobile com teclado e Escape;
- labels do formulário;
- alt das imagens;
- `prefers-reduced-motion`;
- contraste após identidade laranja.

## 11. SEO

- favicon;
- title/description de cada página;
- canonical;
- Open Graph;
- página de produto com `Product` JSON-LD;
- `robots.txt`;
- `sitemap.xml`;
- URL pública correta, sem localhost.

## 12. Performance

Executar Lighthouse em desktop e mobile para Home, Catálogo e Produto. Registrar problemas relevantes antes do merge.

## 13. Deploy

Depois da aprovação manual:

1. autorizar os merges;
2. garantir `main` integrada e limpa;
3. executar novamente `node scripts/release-check.mjs`;
4. confirmar GitHub Pages habilitado para GitHub Actions;
5. o workflow `Deploy GitHub Pages` publica a `main`;
6. abrir a URL pública em aba anônima e celular;
7. repetir smoke test: Home → Catálogo → Produto → Contato → PDF.

## Critério de conclusão

LM-014 só vai para Concluído depois de o site público passar pelo smoke test final e os QR Codes abrirem URLs publicadas.
