# LM-017 — Catálogo PDF automático

## Como funciona

O catálogo em PDF é gerado por `scripts/gerar_catalogo_pdf.py` usando a mesma base `data/produtos.json` consumida pelo site.

Apenas produtos com `ativoNoSite: true` entram no PDF. Isso evita publicar máquinas que ainda não possuem foto ou dados mínimos para exibição.

## Conteúdo do PDF

- capa com identidade escura e destaque laranja;
- quantidade de equipamentos, versão e data de atualização;
- índice por categoria;
- agrupamento dos produtos por categoria;
- imagem do equipamento quando o arquivo existir;
- nome, categoria, descrição curta e código validado quando disponível;
- preço público somente quando `exibirPreco` estiver habilitado e houver valor válido;
- fallback `Sob consulta` para dados técnicos não confirmados;
- QR Code da página individual quando a URL pública do site estiver configurada;
- QR Code do catálogo online na capa quando a URL pública do catálogo estiver configurada;
- dados comerciais somente quando fornecidos por configuração/variáveis reais.

## Automação no GitHub

O workflow `.github/workflows/catalogo-pdf.yml`:

1. instala ReportLab;
2. gera o PDF;
3. valida a assinatura básica do arquivo;
4. publica o PDF como artifact em Pull Requests;
5. em alterações aprovadas na `main`, grava automaticamente `arquivos/catalogo-light-metalurgica.pdf` no repositório.

O commit automático do PDF não dispara o workflow novamente porque o próprio arquivo PDF não faz parte dos caminhos que acionam a automação.

## Variáveis do repositório

Para que QR Codes e contatos reais sejam incluídos, cadastrar em GitHub Repository Variables:

- `CATALOGO_SITE_URL` - URL base publicada, por exemplo `https://dominio.com/`;
- `CATALOGO_URL` - URL estável da página `catalogo.html`;
- `CATALOGO_WHATSAPP` - contato comercial confirmado;
- `CATALOGO_INSTAGRAM` - perfil oficial confirmado;
- `CATALOGO_EMAIL` - e-mail comercial, se houver.

Se essas variáveis estiverem vazias, o gerador não inventa valores e simplesmente omite os dados correspondentes.

## Regeneração manual

```bash
pip install -r requirements-catalogo.txt
python scripts/gerar_catalogo_pdf.py
python scripts/validar_catalogo_pdf.py
```

## Validação visual

O script foi desenvolvido com layout programático em ReportLab. Antes do lançamento final, revisar visualmente o artifact do workflow com as fotos definitivas e confirmar:

- sem imagens cortadas;
- sem textos sobrepostos;
- sem páginas vazias desnecessárias;
- QR Codes legíveis em celular real;
- contraste e identidade alinhados com o site;
- contatos reais corretos.
