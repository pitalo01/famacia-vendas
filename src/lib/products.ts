// Importações dos dados de produto
const featuredProducts = [
  {
    id: "1",
    name: "Dipirona Sódica 1g com 10 comprimidos",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 12.99,
    oldPrice: 19.99,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "2",
    name: "Amoxicilina 500mg com 20 cápsulas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 45.50,
    requiresPrescription: true,
    inStock: true,
  },
  {
    id: "3",
    name: "Vitamina C 1g com 30 comprimidos efervescentes",
    image: "https://images.unsplash.com/photo-1585435557885-28ebd3b15de4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 25.90,
    oldPrice: 35.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "4",
    name: "Losartana 50mg com 30 comprimidos",
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 18.75,
    requiresPrescription: true,
    inStock: true,
  },
  {
    id: "5",
    name: "Protetor Solar FPS 60",
    image: "https://images.unsplash.com/photo-1556227702-a1d34a6eba25?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 42.90,
    oldPrice: 55.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "6",
    name: "Sabonete Antiacne",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4abbd90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 15.50,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "7",
    name: "Xarope para Tosse",
    image: "https://images.unsplash.com/photo-1550572017-42915b4f8d74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 24.99,
    oldPrice: 29.99,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "8",
    name: "Colírio Lubrificante",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 19.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "9",
    name: "Suplemento Whey Protein",
    image: "https://images.unsplash.com/photo-1578186990408-42255a3dc72e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", 
    price: 89.90,
    oldPrice: 109.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "10",
    name: "Kit Primeiros Socorros",
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 65.00,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "11",
    name: "Pomada Cicatrizante",
    image: "https://images.unsplash.com/photo-1584308666984-91a927ee8269?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 17.80,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "12",
    name: "Vitamina D3 2000UI",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 39.90,
    oldPrice: 49.90,
    requiresPrescription: false,
    inStock: true,
  },
];

// Product categories for the specialized rows
const healthProducts = [
  {
    id: "saude1",
    name: "Termômetro Digital",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 19.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "saude2",
    name: "Medidor de Pressão Arterial",
    image: "https://images.unsplash.com/photo-1563360668-3273bb865ad3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 129.90,
    oldPrice: 159.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "saude3",
    name: "Oxímetro de Pulso",
    image: "https://images.unsplash.com/photo-1631563019676-dba501a0ddf9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 89.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "saude4",
    name: "Vitamina C 1000mg",
    image: "https://images.unsplash.com/photo-1577348628134-7be655111c11?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 22.90,
    oldPrice: 27.90,
    requiresPrescription: false,
    inStock: true,
  },
];

const hygieneProducts = [
  {
    id: "hig1",
    name: "Sabonete Antibacteriano",
    image: "https://images.unsplash.com/photo-1584473457406-6240486418e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 7.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "hig2",
    name: "Álcool em Gel 70%",
    image: "https://images.unsplash.com/photo-1585717456878-10c8f2bb73f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 15.90,
    oldPrice: 19.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "hig3",
    name: "Escova Dental",
    image: "https://images.unsplash.com/photo-1612837017391-4b6b7b0be2e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 9.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "hig4",
    name: "Kit Higiene Viagem",
    image: "https://images.unsplash.com/photo-1585741279714-7db01a860c73?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 29.90,
    oldPrice: 34.90,
    requiresPrescription: false,
    inStock: true,
  },
];

// Tipo de produto básico que estamos usando nos cards
export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  requiresPrescription?: boolean;
  inStock?: boolean;
}

// Tipo estendido com informações detalhadas para a página de detalhes
export interface ProductDetails extends Product {
  description?: string;
  features?: string[];
  brand?: string;
  rating?: number;
  ratingCount?: number;
  seller?: string;
  category?: string;
  subcategory?: string;
}

// Dados específicos de descrição para cada produto
const productDescriptions: Record<string, { description: string, features: string[] }> = {
  "1": {
    description: "A Dipirona Sódica 1g é um medicamento analgésico e antitérmico, indicado para o alívio da dor e redução da febre. Eficaz contra dores de cabeça, dores musculares e outros tipos de dores moderadas.",
    features: [
      "Alivia dores de intensidade leve a moderada",
      "Combate estados febris",
      "Efeito rápido após a administração",
      "Comprimido de fácil deglutição"
    ]
  },
  "2": {
    description: "A Amoxicilina 500mg é um antibiótico de amplo espectro utilizado para tratar diversas infecções bacterianas. Cada cápsula contém 500mg do princípio ativo, com tratamento típico durando de 7 a 10 dias conforme prescrição médica.",
    features: [
      "Antibiótico da classe das penicilinas",
      "Tratamento de infecções do trato respiratório",
      "Eficaz contra infecções de ouvido, nariz e garganta",
      "Necessita de prescrição médica"
    ]
  },
  "3": {
    description: "Vitamina C 1g efervescente fornece suplementação de ácido ascórbico, essencial para o sistema imunológico. A fórmula efervescente facilita a absorção e oferece uma maneira agradável de consumir a vitamina diariamente.",
    features: [
      "Fortalece o sistema imunológico",
      "Contribui para a formação de colágeno",
      "Possui propriedades antioxidantes",
      "Formato efervescente de fácil ingestão"
    ]
  },
  "4": {
    description: "Losartana 50mg é um medicamento anti-hipertensivo que atua bloqueando a ação da angiotensina II, substância que causa aumento da pressão arterial. Indicado para o tratamento de hipertensão e proteção renal em pacientes com diabetes tipo 2.",
    features: [
      "Controle eficaz da pressão arterial",
      "Administração em dose única diária",
      "Proteção adicional para pacientes diabéticos",
      "Necessita de prescrição médica"
    ]
  },
  "5": {
    description: "Protetor Solar FPS 60 oferece alta proteção contra os raios UVA e UVB, prevenindo queimaduras solares e danos causados pela exposição ao sol. Sua fórmula não oleosa é de rápida absorção e resistente à água.",
    features: [
      "Alta proteção contra raios UVA e UVB",
      "Fórmula resistente à água",
      "Não oleoso, de rápida absorção",
      "Protege contra o envelhecimento precoce da pele"
    ]
  },
  "6": {
    description: "Sabonete Antiacne é especialmente formulado para peles com tendência à acne, ajudando a controlar a oleosidade excessiva e combater as bactérias causadoras de espinhas e cravos, sem ressecar a pele.",
    features: [
      "Controle de oleosidade",
      "Ação antibacteriana",
      "Não resseca a pele",
      "Uso diário para prevenção de acne"
    ]
  },
  "7": {
    description: "Xarope para Tosse é um medicamento formulado para aliviar a tosse seca ou produtiva. Sua composição ajuda a fluidificar o catarro e facilitar sua eliminação, além de acalmar a irritação na garganta.",
    features: [
      "Alivia a tosse seca e produtiva",
      "Facilita a eliminação do catarro",
      "Acalma a irritação na garganta",
      "Sabor agradável para melhor adesão ao tratamento"
    ]
  },
  "8": {
    description: "Colírio Lubrificante é indicado para aliviar o ressecamento ocular, proporcionando conforto imediato. Sua fórmula suave imita a composição natural das lágrimas, sendo ideal para usuários de lentes de contato e pessoas que sofrem com olhos secos.",
    features: [
      "Alívio imediato do ressecamento ocular",
      "Compatível com lentes de contato",
      "Fórmula sem conservantes",
      "Embalagem prática para uso diário"
    ]
  },
  "9": {
    description: "Suplemento Whey Protein é uma proteína de alta qualidade derivada do leite, ideal para praticantes de atividades físicas. Contribui para a recuperação muscular após os exercícios e auxilia no ganho de massa magra.",
    features: [
      "Alto teor de proteínas de rápida absorção",
      "Auxilia na recuperação muscular",
      "Contribui para o ganho de massa magra",
      "Sabor agradável e fácil dissolução"
    ]
  },
  "10": {
    description: "Kit Primeiros Socorros contém itens essenciais para atendimento emergencial em casos de pequenos acidentes domésticos. Inclui bandagens, antissépticos, tesoura, pinça e outros itens básicos para cuidados imediatos.",
    features: [
      "Itens essenciais para emergências domésticas",
      "Embalagem compacta e fácil de transportar",
      "Produtos de alta qualidade",
      "Manual de instruções para uso adequado"
    ]
  },
  "11": {
    description: "Pomada Cicatrizante é indicada para auxílio no tratamento de pequenos ferimentos, queimaduras leves e irritações cutâneas. Sua fórmula exclusiva acelera o processo natural de cicatrização e ajuda a prevenir infecções.",
    features: [
      "Acelera o processo de cicatrização",
      "Forma barreira protetora contra bactérias",
      "Hidrata a área afetada",
      "Pode ser utilizada em diferentes tipos de lesões superficiais"
    ]
  },
  "12": {
    description: "Vitamina D3 2000UI é um suplemento vitamínico essencial para a saúde óssea e imunológica. A vitamina D auxilia na absorção de cálcio e fósforo, contribuindo para ossos e dentes fortes e saudáveis.",
    features: [
      "Contribui para saúde óssea e muscular",
      "Auxilia no fortalecimento do sistema imunológico",
      "Dosagem ideal para manutenção dos níveis adequados",
      "Fácil administração diária"
    ]
  },
  "saude1": {
    description: "Termômetro Digital de alta precisão para medição rápida e segura da temperatura corporal. Design ergonômico e display de fácil leitura, ideal para uso familiar em todas as idades.",
    features: [
      "Medição rápida e precisa",
      "Sinal sonoro ao final da medição",
      "Display de fácil leitura",
      "Desligamento automático para economia de bateria"
    ]
  },
  "saude2": {
    description: "Medidor de Pressão Arterial digital com tecnologia avançada para monitoramento preciso e confiável da pressão arterial. Armazena as últimas medições e identifica possíveis arritmias cardíacas.",
    features: [
      "Medição automática e precisa",
      "Memória para múltiplas medições",
      "Detecção de arritmia cardíaca",
      "Display grande de fácil leitura"
    ]
  },
  "saude3": {
    description: "Oxímetro de Pulso portátil para medição rápida e não invasiva dos níveis de oxigênio no sangue (SpO2) e frequência cardíaca. Ideal para monitoramento da saúde respiratória e cardíaca.",
    features: [
      "Mede níveis de oxigênio no sangue (SpO2)",
      "Monitora frequência cardíaca",
      "Resultados em segundos",
      "Compacto e portátil"
    ]
  },
  "saude4": {
    description: "Vitamina C 1000mg é um suplemento de alta dosagem que auxilia no fortalecimento do sistema imunológico e na proteção contra radicais livres. Ideal para períodos de baixa imunidade ou maior exposição a fatores de estresse.",
    features: [
      "Alta concentração para máxima eficácia",
      "Auxilia na absorção de ferro",
      "Protege contra danos oxidativos",
      "Contribui para produção de colágeno"
    ]
  },
  "hig1": {
    description: "Sabonete Antibacteriano elimina 99,9% das bactérias, proporcionando limpeza profunda com proteção prolongada. Sua fórmula suave mantém a hidratação natural da pele e pode ser usado diariamente.",
    features: [
      "Elimina 99,9% das bactérias",
      "Proteção prolongada",
      "Não resseca a pele",
      "Fragrância suave e refrescante"
    ]
  },
  "hig2": {
    description: "Álcool em Gel 70% para higienização das mãos sem necessidade de água. Elimina 99,9% dos germes e bactérias, com fórmula que contém hidratantes para evitar o ressecamento da pele.",
    features: [
      "Eficácia comprovada contra vírus e bactérias",
      "Secagem rápida",
      "Fórmula com hidratantes",
      "Prático para uso em qualquer lugar"
    ]
  },
  "hig3": {
    description: "Escova Dental com cerdas macias e cabeça anatômica para uma limpeza eficaz e confortável. Seu cabo ergonômico proporciona melhor controle durante a escovação, alcançando todas as áreas da boca.",
    features: [
      "Cerdas macias para proteção da gengiva",
      "Cabo ergonômico antiderrapante",
      "Cabeça anatômica para alcançar áreas difíceis",
      "Indicador de troca de escova"
    ]
  },
  "hig4": {
    description: "Kit Higiene Viagem contém produtos essenciais em tamanhos adequados para transporte em bagagem de mão. Inclui xampu, condicionador, sabonete líquido, creme dental e escova dental em embalagem prática e compacta.",
    features: [
      "Produtos em tamanho adequado para viagens",
      "Embalagem compacta e resistente",
      "Itens essenciais para higiene pessoal",
      "Aprovado para transporte em bagagem de mão"
    ]
  }
};

// Mapeamento de informações adicionais como marca, rating, etc.
const productBrands: Record<string, string> = {
  "1": "Genérico",
  "2": "Medley",
  "3": "Cebion",
  "4": "EMS",
  "5": "La Roche-Posay",
  "6": "Neutrogena",
  "7": "Vick",
  "8": "Lacrifilm",
  "9": "Growth",
  "10": "Johnson & Johnson",
  "11": "Neodex",
  "12": "Sundown",
  "saude1": "G-Tech",
  "saude2": "Omron",
  "saude3": "Contec",
  "saude4": "Vitaminlife",
  "hig1": "Protex",
  "hig2": "Asseptgel",
  "hig3": "Colgate",
  "hig4": "Needs"
};

// Lista combinada de todos os produtos
const allProducts: Product[] = [
  ...featuredProducts,
  ...healthProducts,
  ...hygieneProducts,
];

// Função para obter um produto pelo ID
export const getProductById = (id: string): ProductDetails | null => {
  const baseProduct = allProducts.find(product => product.id === id);
  
  if (!baseProduct) {
    return null;
  }

  // Combinando o produto base com as informações detalhadas
  return {
    ...baseProduct,
    description: productDescriptions[id]?.description || "Descrição não disponível para este produto.",
    features: productDescriptions[id]?.features || ["Informações sobre o produto em breve."],
    brand: productBrands[id] || "Marca não especificada",
    rating: 4.5, // Valor padrão
    ratingCount: Math.floor(Math.random() * 200) + 50, // Valor aleatório entre 50 e 250
    seller: "Farmácia Virtual Encantada",
  };
};

// Dados dos produtos para exportação
export const featuredProductsData = featuredProducts;
export const healthProductsData = healthProducts;
export const hygieneProductsData = hygieneProducts; 