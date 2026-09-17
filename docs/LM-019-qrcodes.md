# LM-019 — QR Codes do site, catálogo e produtos

## Estratégia

Os QR Codes são usados para URLs públicas. Código de barras tradicional não foi adotado porque o objetivo é levar o cliente a páginas do site, não identificar itens em um estoque físico.

## Destinos

- `site.svg` aponta para a página inicial publicada;
- `catalogo.svg` aponta para a página estável `catalogo.html`;
- cada equipamento público recebe um QR Code próprio para `produto.html?id=<id>`;
- `manifest.json` registra o arquivo e a URL de cada QR gerado.

## Por que o QR principal não aponta direto para o PDF

O QR principal deve apontar para `catalogo.html`. O PDF pode ser substituído por uma versão mais nova sem mudar a URL impressa em cartões, folders ou outros materiais.

## Configuração obrigatória

Antes da geração final, cadastrar no GitHub:

- Repository Variable `CATALOGO_SITE_URL` com a URL base publicada;
- Repository Variable `CATALOGO_URL` com a URL pública de `catalogo.html`.

Exemplo apenas de formato:

```text
CATALOGO_SITE_URL=https://dominio-da-empresa.com/
CATALOGO_URL=https://dominio-da-empresa.com/catalogo.html
```

Não usar domínio de exemplo em produção.

## Geração

```bash
pip install -r requirements-qrcode.txt
python scripts/gerar_qrcodes.py
```

Os arquivos são gravados em `arquivos/qrcodes/`.

## Automação

O workflow `.github/workflows/qrcodes.yml` só executa a geração quando `CATALOGO_SITE_URL` estiver configurada. Em Pull Requests, os QR Codes são disponibilizados como artifact. Depois do merge em `main`, os arquivos podem ser gravados automaticamente no repositório.

## Validação manual obrigatória antes de imprimir

- testar `catalogo.svg` em pelo menos dois celulares;
- testar uma amostra de QR Codes de produtos de categorias diferentes;
- confirmar que o destino abre em HTTPS e sem redirecionamento quebrado;
- imprimir uma amostra em tamanho semelhante ao uso real;
- testar leitura com iluminação normal e distância razoável;
- não reduzir margem branca do QR Code;
- não colocar logotipo sobre o QR sem nova validação de leitura.
