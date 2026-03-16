const produtos = [
  {
    id: 1,
    nome: "Leg Press 45",
    descricao: "Equipamento robusto para treino de pernas, com estrutura firme e visual profissional para academias e estúdios.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/leg-press-45.png"
  },
  {
    id: 2,
    nome: "Cadeira Extensora",
    descricao: "Máquina voltada para exercícios de quadríceps, oferecendo estabilidade, conforto e acabamento de alto padrão.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/cadeira-extensora.png"
  },
  {
    id: 3,
    nome: "Elevação Pélvica 2D",
    descricao: "Equipamento projetado para treinos de glúteos e posteriores, com estrutura reforçada e presença profissional.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/elevacao-pelvica-2d.png"
  },
  {
    id: 4,
    nome: "Hack Machine",
    descricao: "Máquina para treinos intensos de pernas, com construção robusta e excelente estabilidade durante a execução.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/hack-machine.png"
  },
  {
    id: 5,
    nome: "Mesa Flexora",
    descricao: "Equipamento voltado para fortalecimento de posteriores de coxa, com estrutura firme e ergonomia adequada.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/mesa-flexora.png"
  },
  {
    id: 6,
    nome: "Abdutora em Pé",
    descricao: "Máquina desenvolvida para treinos de glúteos e quadril, oferecendo estabilidade e execução confortável.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/abdutora-em-pe.png"
  },
  {
    id: 7,
    nome: "Peck Deck",
    descricao: "Equipamento para exercícios de peitoral com movimento controlado e excelente estabilidade estrutural.",
    categoria: "Peito",
    imagem: "./arquivos/imagens/produtos/peck-deck.png"
  },
  {
    id: 8,
    nome: "Máquina Bíceps Rosca Scott",
    descricao: "Equipamento específico para treino de bíceps com apoio adequado e execução segura.",
    categoria: "Braços",
    imagem: "./arquivos/imagens/produtos/rosca-scott.png"
  },
  {
    id: 9,
    nome: "Remada Sentada Articulada",
    descricao: "Máquina voltada para fortalecimento das costas, com movimento articulado e excelente biomecânica.",
    categoria: "Costas",
    imagem: "./arquivos/imagens/produtos/remada-sentada-articulada.png"
  },
  {
    id: 10,
    nome: "Graviton",
    descricao: "Equipamento multifuncional para exercícios de barra e paralelas com assistência de peso.",
    categoria: "Funcional",
    imagem: "./arquivos/imagens/produtos/graviton.png"
  },
  {
    id: 11,
    nome: "Supino Declinado",
    descricao: "Equipamento para treino de peitoral inferior com estrutura estável e design profissional.",
    categoria: "Peito",
    imagem: "./arquivos/imagens/produtos/supino-declinado.png"
  },
  {
    id: 12,
    nome: "Supino Inclinado",
    descricao: "Máquina desenvolvida para treinos de peitoral superior com excelente estabilidade.",
    categoria: "Peito",
    imagem: "./arquivos/imagens/produtos/supino-inclinado.png"
  },
  {
    id: 13,
    nome: "Smith Machine",
    descricao: "Estrutura guiada para exercícios variados, oferecendo segurança e estabilidade durante os treinos.",
    categoria: "Funcional",
    imagem: "./arquivos/imagens/produtos/smith-machine.png"
  },
  {
    id: 14,
    nome: "Banco Lombar",
    descricao: "Banco para exercícios de lombar e fortalecimento do core, com estrutura firme e resistente.",
    categoria: "Bancos e Suportes",
    imagem: "./arquivos/imagens/produtos/banco-lombar.png"
  },
  {
    id: 15,
    nome: "Cross Over Angular",
    descricao: "Equipamento multifuncional para treinos de peitoral, costas e membros superiores.",
    categoria: "Funcional",
    imagem: "./arquivos/imagens/produtos/cross-over-angular.png"
  },
  {
    id: 16,
    nome: "Cross Over Tradicional",
    descricao: "Máquina versátil para exercícios diversos com cabos, ideal para academias completas.",
    categoria: "Funcional",
    imagem: "./arquivos/imagens/produtos/cross-over-tradicional.png"
  },
  {
    id: 17,
    nome: "Cadeira Flexora",
    descricao: "Equipamento voltado para treino de posteriores de coxa com conforto e estabilidade.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/cadeira-flexora.png"
  },
  {
    id: 18,
    nome: "Puxada Alta com Remada Baixa",
    descricao: "Equipamento combinado para exercícios de dorsais e costas com ótima biomecânica.",
    categoria: "Costas",
    imagem: "./arquivos/imagens/produtos/puxada-alta-remada-baixa.png"
  },
  {
    id: 19,
    nome: "Cadeira Extensora Unilateral",
    descricao: "Máquina para exercícios de quadríceps com execução unilateral e maior controle muscular.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/cadeira-extensora-unilateral.png"
  },
  {
    id: 20,
    nome: "Panturrilha Sentada Burrinho",
    descricao: "Equipamento voltado para treino de panturrilhas com estrutura reforçada.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/panturrilha-sentada.png"
  },
  {
    id: 21,
    nome: "Puxada Alta Articulada",
    descricao: "Máquina para exercícios de dorsais com movimento articulado e execução confortável.",
    categoria: "Costas",
    imagem: "./arquivos/imagens/produtos/puxada-alta-articulada.png"
  },
  {
    id: 22,
    nome: "Suporte Búlgaro",
    descricao: "Equipamento auxiliar para exercícios unilaterais e treinos funcionais.",
    categoria: "Bancos e Suportes",
    imagem: "./arquivos/imagens/produtos/suporte-bulgaro.png"
  },
  {
    id: 23,
    nome: "Puxada Alta Articulada Modelo Robótico",
    descricao: "Versão avançada de puxada alta com design moderno e biomecânica aprimorada.",
    categoria: "Costas",
    imagem: "./arquivos/imagens/produtos/puxada-robotica.png"
  },
  {
    id: 24,
    nome: "Banco Supino Reto",
    descricao: "Banco versátil para exercícios de supino e diversos treinos com pesos livres.",
    categoria: "Bancos e Suportes",
    imagem: "./arquivos/imagens/produtos/banco-supino-reto.png"
  },
  {
    id: 25,
    nome: "Remada Curvada com Guias Lineares",
    descricao: "Equipamento projetado para exercícios intensos de dorsais com estabilidade guiada.",
    categoria: "Costas",
    imagem: "./arquivos/imagens/produtos/remada-curvada.png"
  },
  {
    id: 26,
    nome: "Máquina de Antebraço",
    descricao: "Equipamento específico para fortalecimento de antebraços com execução confortável.",
    categoria: "Braços",
    imagem: "./arquivos/imagens/produtos/maquina-antebraco.png"
  },
  {
    id: 27,
    nome: "Flexora em Pé",
    descricao: "Máquina para exercícios de posteriores de coxa com execução unilateral.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/flexora-em-pe.png"
  },
  {
    id: 28,
    nome: "Máquina de Tríceps Francês",
    descricao: "Equipamento voltado para exercícios de tríceps com apoio confortável e execução segura.",
    categoria: "Braços",
    imagem: "./arquivos/imagens/produtos/triceps-frances.png"
  },
  {
    id: 29,
    nome: "Agachamento VSquat",
    descricao: "Máquina profissional para treinos de agachamento com estabilidade e conforto.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/vsquat.png"
  },
  {
    id: 30,
    nome: "Agachamento Belt Squat Sumô",
    descricao: "Equipamento voltado para exercícios de agachamento com foco em glúteos e pernas.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/belt-squat-sumo.png"
  },
  {
    id: 31,
    nome: "Banco 90°",
    descricao: "Banco versátil para diversos exercícios de musculação e apoio em treinos livres.",
    categoria: "Bancos e Suportes",
    imagem: "./arquivos/imagens/produtos/banco-90.png"
  },
  {
    id: 32,
    nome: "Agachamento Pêndulo",
    descricao: "Máquina de agachamento com movimento pendular que proporciona biomecânica eficiente.",
    categoria: "Pernas",
    imagem: "./arquivos/imagens/produtos/agachamento-pendulo.png"
  }
];