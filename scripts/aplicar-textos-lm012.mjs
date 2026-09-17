import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const arquivo = path.join(root, "data", "produtos.json");
const catalogo = JSON.parse(fs.readFileSync(arquivo, "utf8"));

const revisoes = new Map([
  [1, {
    descricaoCurta: "Equipamento para exercícios da região abdominal em ambientes de treinamento.",
    destaques: [
      { titulo: "Aplicação", texto: "Exercícios voltados à região abdominal." },
      { titulo: "Uso", texto: "Modelo apresentado para academias e espaços de musculação." },
      { titulo: "Informações técnicas", texto: "Especificações adicionais sob consulta." }
    ]
  }],
  [7, { descricaoCurta: "Banco para exercícios de supino e outros movimentos com pesos livres em academias e espaços fitness." }],
  [8, { descricaoCurta: "Equipamento destinado ao exercício de extensão dos joelhos, utilizado em treinos de quadríceps." }],
  [12, { descricaoCurta: "Estação de cabos utilizada em diferentes exercícios de musculação e treinamento funcional." }],
  [13, { descricaoCurta: "Equipamento destinado à realização de exercícios de elevação pélvica." }],
  [16, { descricaoCurta: "Equipamento guiado utilizado em exercícios para membros inferiores." }],
  [17, { descricaoCurta: "Equipamento de musculação com plataforma inclinada para exercícios de membros inferiores." }],
  [18, { descricaoCurta: "Equipamento para exercícios de flexão de cotovelo com apoio para os braços." }],
  [23, { descricaoCurta: "Equipamento para exercícios de adução horizontal dos braços, utilizado em treinos de peitoral." }],
  [24, { descricaoCurta: "Equipamento articulado para exercícios de puxada alta." }],
  [29, { descricaoCurta: "Equipamento com barra guiada utilizado em diferentes exercícios de musculação." }]
]);

let alterados = 0;
for (const produto of catalogo.produtos || []) {
  const revisao = revisoes.get(Number(produto.id));
  if (!revisao) continue;

  if (revisao.descricaoCurta && produto.descricaoCurta !== revisao.descricaoCurta) {
    produto.descricaoCurta = revisao.descricaoCurta;
    alterados += 1;
  }

  if (revisao.destaques) produto.destaques = revisao.destaques;
}

fs.writeFileSync(arquivo, `${JSON.stringify(catalogo, null, 2)}\n`, "utf8");

const homePath = path.join(root, "index.html");
let home = fs.readFileSync(homePath, "utf8");
const revisoesHome = [
  [
    /Equipamentos de musculação para academias, estúdios e projetos\s+fitness que buscam resistência, acabamento profissional e presença\s+no ambiente\./m,
    "Equipamentos de musculação para academias, estúdios e espaços fitness, organizados para facilitar a consulta e a solicitação de orçamento."
  ],
  [/Estrutura robusta/g, "Catálogo organizado"],
  [/Equipamentos preparados para ambientes profissionais\./g, "Equipamentos apresentados por categoria para facilitar a consulta."],
  [/Biomecânica/g, "Informações objetivas"],
  [/Máquinas voltadas para movimentos eficientes\./g, "Dados disponíveis no catálogo e detalhes técnicos sob consulta."],
  [/Acabamento profissional/g, "Consulta comercial"],
  [/Visual pensado para integrar academias modernas\./g, "Modelos e imagens reunidos para apoiar a solicitação de orçamento."],
  [
    /A proposta une estrutura, funcionalidade e acabamento\s+profissional para oferecer soluções compatíveis com ambientes\s+que valorizam desempenho e apresentação\./m,
    "O catálogo reúne os modelos disponíveis e organiza as informações para consulta, comparação e contato com a equipe comercial."
  ]
];

let homeAlterada = false;
for (const [padrao, texto] of revisoesHome) {
  const nova = home.replace(padrao, texto);
  if (nova !== home) homeAlterada = true;
  home = nova;
}

if (homeAlterada) fs.writeFileSync(homePath, home, "utf8");

console.log(`LM-012: ${alterados} descrições de produto revisadas.`);
console.log(`LM-012: Home ${homeAlterada ? "revisada" : "já estava revisada"}.`);
