# Light Metalúrgica

Site institucional e catálogo digital da Light Metalúrgica, desenvolvido para apresentar equipamentos profissionais de musculação, organizar o catálogo comercial e facilitar o contato para orçamento.

## Status

Projeto em desenvolvimento e profissionalização.

A estrutura pública atual trabalha com um catálogo centralizado em JSON e páginas dinâmicas de equipamentos. A ampliação da lista oficial, catálogo PDF, QR Codes, SEO, acessibilidade e deploy final fazem parte do roadmap ativo.

## Objetivos do projeto

- apresentar a marca com visual industrial e profissional;
- disponibilizar um catálogo de equipamentos simples de navegar;
- manter uma única fonte de dados reutilizável pelo site e materiais comerciais;
- facilitar pedidos de orçamento;
- preparar a base para catálogo PDF, QR Codes e compartilhamento direto de equipamentos;
- manter o projeto simples de atualizar conforme novas máquinas e fotos forem disponibilizadas.

## Funcionalidades atuais

- Home institucional responsiva;
- catálogo com busca e filtros por categoria;
- cards de equipamentos carregados dinamicamente;
- página individual por ID;
- produtos relacionados;
- carregamento de dados centralizado em `data/produtos.json`;
- destaques da Home derivados da mesma base de produtos;
- página Sobre;
- página de Contato;
- menu responsivo;
- CTAs de orçamento por equipamento.

## Tecnologias

- HTML5;
- CSS3;
- JavaScript Vanilla;
- JSON como fonte central de dados;
- Git e GitHub;
- Trello para acompanhamento das tarefas.

O projeto não depende de framework front-end, o que mantém a hospedagem estática simples e reduz a complexidade operacional.

## Estrutura principal

```text
light-metalurgica/
├── arquivos/
│   └── imagens/
│       └── produtos/
├── css/
│   ├── contato.css
│   ├── home.css
│   ├── produto.css
│   ├── produtos.css
│   ├── sobre.css
│   └── style.css
├── data/
│   └── produtos.json
├── js/
│   ├── catalogo-data.js
│   ├── home.js
│   ├── produto.js
│   ├── produtos.js
│   └── script.js
├── contato.html
├── index.html
├── produto.html
├── produtos.html
├── sobre.html
└── README.md
```

A estrutura pode receber novos arquivos conforme o roadmap, como geração de catálogo PDF, QR Codes e arquivos de deploy.

## Fonte de dados do catálogo

O catálogo público utiliza `data/produtos.json` como fonte central. A ideia é evitar informações duplicadas entre Home, catálogo e página individual.

Cada equipamento pode possuir campos como:

- ID interno;
- código comercial;
- nome;
- slug;
- categoria;
- descrição curta;
- imagem;
- visibilidade no site;
- preço público, quando autorizado;
- destaques comerciais;
- informações de origem e validação.

Custos internos não devem ser expostos na base pública usada pelo site.

## Execução local

Por utilizar `fetch()` para carregar o catálogo, o projeto deve ser aberto por um servidor local em vez de clicar diretamente nos arquivos HTML.

Uma opção simples no VS Code é utilizar a extensão Live Server.

Depois, acesse a URL disponibilizada pelo servidor, normalmente algo como:

```text
http://127.0.0.1:5500/
```

## Fluxo de desenvolvimento

As tarefas são identificadas por códigos `LM-XXX` no Trello e mantêm o mesmo identificador no GitHub.

Exemplo:

```text
Trello:  LM-023 — Atualizar identidade visual
Branch:  feat/lm-023-identidade-laranja
Commit:  feat(LM-023): atualiza identidade visual
PR:      feat(LM-023): atualiza identidade visual para laranja
```

Fluxo adotado:

```text
Trello
  ↓
Branch específica
  ↓
Implementação
  ↓
Commits
  ↓
Pull Request
  ↓
Revisão / testes manuais
  ↓
Merge autorizado
  ↓
Concluído
```

## Roadmap

Entre as melhorias planejadas ou em andamento estão:

- ampliação do catálogo com a lista oficial completa;
- identidade visual alinhada à marca;
- enriquecimento das fichas de equipamentos;
- catálogo digital em PDF gerado a partir da mesma base do site;
- página pública para visualizar e baixar o catálogo;
- QR Codes para site, catálogo e equipamentos;
- lista de interesse para orçamento;
- compartilhamento de equipamentos;
- melhorias de formulário;
- SEO técnico;
- acessibilidade e performance;
- testes finais e deploy.

## Cuidados com conteúdo comercial

Informações técnicas, dimensões, capacidade, garantia, materiais, preços e outras alegações específicas só devem ser publicadas quando confirmadas pela empresa.

Quando uma informação ainda não estiver validada, o projeto utiliza linguagem neutra como `Sob consulta` em vez de inventar dados.

## Repositório

Projeto mantido em:

`Lexissantosz/light-metalurgica`

## Licença e uso

Conteúdo institucional, imagens, identidade e informações comerciais pertencem à Light Metalúrgica e devem ser utilizados conforme autorização da empresa.
