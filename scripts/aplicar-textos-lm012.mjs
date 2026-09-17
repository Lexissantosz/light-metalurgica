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

  if (revisao.destaques) {
    produto.destaques = revisao.destaques;
  }
}

fs.writeFileSync(arquivo, `${JSON.stringify(catalogo, null, 2)}\n`, "utf8");
console.log(`LM-012: ${alterados} descrições revisadas.`);
