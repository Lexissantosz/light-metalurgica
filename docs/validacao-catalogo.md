# LM-022 — Validação da base oficial de equipamentos

## Status

🛠️ Em andamento

## Objetivo

Validar os dados da tabela oficial da Light Fitness antes de transformar a lista de equipamentos na base definitiva utilizada pelo site, catálogo digital em PDF e QR Codes.

## Fonte

Planilha profissional de equipamentos fornecida pela Light Fitness.

## Regras definidas

- Cada equipamento terá um `id` interno único e sequencial no sistema.
- O código fornecido pela empresa será preservado no campo `codigo`.
- O código comercial não será utilizado como identificador interno enquanto existirem duplicidades.
- O valor de venda será armazenado separadamente do custo.
- O custo é informação interna e nunca será exibido publicamente.
- Informações técnicas não confirmadas não serão inventadas.
- Equipamentos sem foto poderão existir na base, mas não serão publicados no catálogo visual até receberem uma imagem válida.
- Dados do site, PDF e QR Codes deverão partir da mesma fonte de dados.

## Problemas identificados

### Códigos duplicados

#### Código 2004784708006

Aparece em:

- FLEXORA EM PÉ MODELO NOVO
- FRONT DOWN HAMMER

#### Código 2048536878005

Aparece em:

- MÁQUINA BÚLGARO MULTIFUNCIONAL
- MÁQUINA DE ANTEBRAÇO

#### Código 2071725904407

Aparece em:

- SUPINO DECLINADO SENTADO MODELO ROBÓTICO
- SUPINO INCLINADO SENTADO MODELO ROBÓTICO

### Informação aparentemente ausente

- SUPORTE SCOTT COM REGULAGEM possui valor de R$ 3.900,00, mas o custo não aparece informado na tabela recebida.

## Decisões pendentes

- Confirmar os códigos corretos dos equipamentos com código duplicado.
- Confirmar o custo do SUPORTE SCOTT COM REGULAGEM.
- Definir quais preços serão exibidos no catálogo PDF.
- Definir se algum preço será exibido diretamente no site.