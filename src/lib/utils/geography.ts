/** Cape Verde geography: Island → Concelho/City (chained filters). */
export const ISLAND_CITIES: Record<string, string[]> = {
  Santiago: ["Praia", "Santa Catarina", "Santa Cruz", "São Domingos", "São Miguel", "Tarrafal"],
  "São Vicente": ["Mindelo"],
  Sal: ["Espargos", "Santa Maria"],
  "Boa Vista": ["Sal Rei"],
  "Santo Antão": ["Porto Novo", "Paul", "Ribeira Grande"],
  Fogo: ["São Filipe", "Santa Catarina do Fogo", "Mosteiros"],
  "São Nicolau": ["Ribeira Brava", "Tarrafal de São Nicolau"],
  Maio: ["Vila do Maio"],
  Brava: ["Nova Sintra"],
};

export const ISLANDS = Object.keys(ISLAND_CITIES);
