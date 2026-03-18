const produtos = [
  {
    id: 1,
    nome: "Abdutora em Pé",
    descricao: "Equipamento para treino de glúteos e quadril com estrutura firme e execução estável.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/abdutora-em-pe.png"
  },
  {
    id: 2,
    nome: "Agachamento Belt Squat Sumô",
    descricao: "Máquina para treinos de pernas e glúteos com excelente estabilidade e presença profissional.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/agachamento-belt-squat-sumo.png"
  },
  {
    id: 3,
    nome: "Agachamento Pêndulo",
    descricao: "Equipamento robusto para treinos intensos de pernas com biomecânica eficiente.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/agachamento-pendulo.png"
  },
  {
    id: 4,
    nome: "Agachamento VSquat",
    descricao: "Máquina profissional para agachamento com conforto, estabilidade e segurança.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/agachamento-vsquat.png"
  },
  {
    id: 5,
    nome: "Banco 90°",
    descricao: "Banco versátil para apoio em exercícios variados com estrutura resistente.",
    categoria: "Bancos e Suportes",
    imagem: "./arquivos/imagens/produtos/banco-90.png"
  },
  {
    id: 6,
    nome: "Banco Lombar",
    descricao: "Equipamento para fortalecimento da lombar e exercícios de core com apoio firme.",
    categoria: "Bancos e Suportes",
    imagem: "./arquivos/imagens/produtos/banco-lombar.png"
  },
  {
    id: 7,
    nome: "Banco Supino Reto",
    descricao: "Banco robusto para exercícios de supino e treinos com pesos livres.",
    categoria: "Bancos e Suportes",
    imagem: "./arquivos/imagens/produtos/banco-supino-reto.png"
  },
  {
    id: 8,
    nome: "Cadeira Extensora",
    descricao: "Máquina para treino de quadríceps com excelente estabilidade e acabamento profissional.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/cadeira-extensora.png"
  },
  {
    id: 9,
    nome: "Cadeira Extensora Unilateral",
    descricao: "Equipamento para treino unilateral de quadríceps com maior controle de execução.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/cadeira-extensora-unilateral.png"
  },
  {
    id: 10,
    nome: "Cadeira Flexora",
    descricao: "Máquina desenvolvida para exercícios de posteriores de coxa com conforto e firmeza.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/cadeira-flexora.png"
  },
  {
    id: 11,
    nome: "Cross Over Angular",
    descricao: "Equipamento versátil para treinos com cabos, ideal para academias e estúdios.",
    categoria: "Funcional",
    imagem: "./arquivos/imagens/produtos/cross-over-angular.png"
  },
  {
    id: 12,
    nome: "Cross Over Tradicional",
    descricao: "Máquina multifuncional para exercícios diversos com excelente presença visual.",
    categoria: "Funcional",
    imagem: "./arquivos/imagens/produtos/cross-over-trad.png"
  },
  {
    id: 13,
    nome: "Elevação Pélvica 2D",
    descricao: "Equipamento voltado para glúteos e posteriores com estrutura reforçada.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/elevacao-pelvica-2d.png"
  },
  {
    id: 14,
    nome: "Flexora em Pé",
    descricao: "Máquina para treino unilateral de posteriores com execução confortável.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/flexora-em-pe.png"
  },
  {
    id: 15,
    nome: "Graviton",
    descricao: "Equipamento funcional para barra e paralelas assistidas com estrutura profissional.",
    categoria: "Funcional",
    imagem: "./arquivos/imagens/produtos/graviton.png"
  },
  {
    id: 16,
    nome: "Hack Machine",
    descricao: "Máquina robusta para treinos intensos de pernas com estabilidade e segurança.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/hack-machine.png"
  },
  {
    id: 17,
    nome: "Leg Press 45",
    descricao: "Equipamento para treino de pernas com estrutura forte e excelente presença visual.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/leg-press-45.png"
  },
  {
    id: 18,
    nome: "Máquina Bíceps Rosca Scott",
    descricao: "Equipamento específico para treino de bíceps com apoio estável e execução segura.",
    categoria: "Braços",
    imagem: "./arquivos/imagens/produtos/maquina-biceps-rosca-scott.png"
  },
  {
    id: 19,
    nome: "Máquina de Antebraço",
    descricao: "Máquina voltada para fortalecimento de antebraços com uso confortável.",
    categoria: "Braços",
    imagem: "./arquivos/imagens/produtos/maquina-de-antebraco.png"
  },
  {
    id: 20,
    nome: "Máquina de Tríceps Francês",
    descricao: "Equipamento para treino de tríceps com estrutura firme e acabamento profissional.",
    categoria: "Braços",
    imagem: "./arquivos/imagens/produtos/maquina-de-triceps-frances.png"
  },
  {
    id: 21,
    nome: "Mesa Flexora",
    descricao: "Máquina para treino de posteriores de coxa com estabilidade e ergonomia.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/mesa-flexora.png"
  },
  {
    id: 22,
    nome: "Panturrilha Sentada Burrinho",
    descricao: "Equipamento para treino de panturrilhas com estrutura reforçada e execução estável.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/panturrilha-sentada-burrinho.png"
  },
  {
    id: 23,
    nome: "Peck Deck",
    descricao: "Máquina para exercícios de peitoral com movimento controlado e ótimo acabamento.",
    categoria: "Peito",
    imagem: "./arquivos/imagens/produtos/peck-deck.png"
  },
  {
    id: 24,
    nome: "Puxada Alta Articulada",
    descricao: "Equipamento para treino de dorsais com movimento articulado e boa biomecânica.",
    categoria: "Costas",
    imagem: "./arquivos/imagens/produtos/puxada-alta-articulada.png"
  },
  {
    id: 25,
    nome: "Puxada Alta Articulada Modelo Robótico",
    descricao: "Versão avançada da puxada alta com design moderno e estrutura profissional.",
    categoria: "Costas",
    imagem: "./arquivos/imagens/produtos/puxada-alta-articulada-modelo-robotico.png"
  },
  {
    id: 26,
    nome: "Puxada Alta com Remada Baixa",
    descricao: "Equipamento combinado para treinos completos de costas com ótima versatilidade.",
    categoria: "Costas",
    imagem: "./arquivos/imagens/produtos/puxada-alta-com-remada-baixa.png"
  },
  {
    id: 27,
    nome: "Remada Curvada c/ Guias Lineares",
    descricao: "Máquina para treino intenso de dorsais com movimento guiado e estável.",
    categoria: "Costas",
    imagem: "./arquivos/imagens/produtos/remada-curvada-c-guias-lineares.png"
  },
  {
    id: 28,
    nome: "Remada Senta Articulada",
    descricao: "Equipamento para fortalecimento das costas com biomecânica eficiente.",
    categoria: "Costas",
    imagem: "./arquivos/imagens/produtos/remada-senta-articulada.png"
  },
  {
    id: 29,
    nome: "Smith Machine",
    descricao: "Estrutura guiada para exercícios diversos com mais estabilidade e segurança.",
    categoria: "Funcional",
    imagem: "./arquivos/imagens/produtos/smith-machine.png"
  },
  {
    id: 30,
    nome: "Supino Declinado",
    descricao: "Máquina para treino de peitoral inferior com estrutura firme e visual profissional.",
    categoria: "Peito",
    imagem: "./arquivos/imagens/produtos/supino-declinado.png"
  },
  {
    id: 31,
    nome: "Supino Inclinado",
    descricao: "Equipamento para treino de peitoral superior com excelente estabilidade.",
    categoria: "Peito",
    imagem: "./arquivos/imagens/produtos/supino-inclinado.png"
  },
  {
    id: 32,
    nome: "Suporte Búlgaro",
    descricao: "Estrutura de apoio para exercícios unilaterais e treinos funcionais.",
    categoria: "Bancos e Suportes",
    imagem: "./arquivos/imagens/produtos/suporte-bulgaro.png"
  }
];