export interface AcervoItem {
  tipo: 'mcp' | 'skill' | 'agente' | 'ferramenta' | 'doc';
  t: string;
  autor: string;
  mat: 'oficial' | 'comunidade' | 'experimental' | 'padrao';
  sum: string;
  desc: string;
  uso: string;
  inst: string;
  tags: string[];
  fonte: string;
  lic: string;
}

export interface EstanteInfo {
  nome: string;
  code: string;
  cor: string;
  ic: string;
  desc: string;
}

export const ESTANTES: Record<string, EstanteInfo> = {
  mcp: {
    nome: "MCP Servers",
    code: "MCP",
    cor: "#D4AF5A", // var(--accent)
    ic: "fa-solid fa-plug",
    desc: "Servidores Model Context Protocol — dão à IA acesso controlado a ferramentas e dados."
  },
  skill: {
    nome: "Skills",
    code: "SKL",
    cor: "#9EA5B3", // var(--text-secondary)
    ic: "fa-solid fa-lightbulb",
    desc: "Pastas de instruções que ensinam a IA a produzir um tipo de artefato com qualidade."
  },
  agente: {
    nome: "Agentes & Prompts",
    code: "AGT",
    cor: "#E7C879", // var(--accent-light)
    ic: "fa-solid fa-robot",
    desc: "Personas, padrões de prompt e arquétipos de agente reutilizáveis."
  },
  ferramenta: {
    nome: "Ferramentas & APIs",
    code: "FER",
    cor: "#FFFFFF",
    ic: "fa-solid fa-screwdriver-wrench",
    desc: "APIs e capacidades que um agente chama em tempo de execução."
  },
  doc: {
    nome: "Docs & Guias",
    code: "DOC",
    cor: "rgba(255, 255, 255, 0.25)", // var(--text-muted)
    ic: "fa-solid fa-file-lines",
    desc: "Especificações e guias de referência para construir com IA."
  }
};

export const ACERVO: AcervoItem[] = [
  /* ───── MCP SERVERS ───── */
  {
    tipo: "mcp",
    t: "Filesystem",
    autor: "Anthropic · referência",
    mat: "oficial",
    sum: "Lê, escreve e busca arquivos locais com controle de acesso por diretório.",
    desc: "Servidor de referência que expõe o sistema de arquivos à IA de forma controlada: listar, ler, escrever, mover e buscar dentro de diretórios autorizados.",
    uso: "Quando o agente precisa ler ou editar arquivos de um projeto local.",
    inst: "npx -y @modelcontextprotocol/server-filesystem /caminho",
    tags: ["arquivos", "io", "referência"],
    fonte: "https://github.com/modelcontextprotocol/servers",
    lic: "MIT"
  },
  {
    tipo: "mcp",
    t: "Fetch",
    autor: "Anthropic · referência",
    mat: "oficial",
    sum: "Busca uma URL e converte o conteúdo da web em Markdown limpo.",
    desc: "Recupera páginas da web e as converte para Markdown enxuto, otimizado para consumo por LLM.",
    uso: "Quando o agente precisa ler o conteúdo de uma página específica.",
    inst: "npx -y @modelcontextprotocol/server-fetch",
    tags: ["web", "scraping", "markdown"],
    fonte: "https://github.com/modelcontextprotocol/servers",
    lic: "MIT"
  },
  {
    tipo: "mcp",
    t: "Memory",
    autor: "Anthropic · referência",
    mat: "oficial",
    sum: "Memória persistente baseada em grafo de conhecimento.",
    desc: "Mantém um grafo de entidades e relações que persiste entre conversas.",
    uso: "Quando você quer que o agente acumule conhecimento ao longo do tempo.",
    inst: "npx -y @modelcontextprotocol/server-memory",
    tags: ["memória", "grafo", "persistência"],
    fonte: "https://github.com/modelcontextprotocol/servers",
    lic: "MIT"
  },
  {
    tipo: "mcp",
    t: "Git",
    autor: "Anthropic",
    mat: "oficial",
    sum: "Lê, busca e manipula repositórios Git diretamente.",
    desc: "Dá ao agente operações de Git como listar commits, diffs, criar branches e commitar alterações em repositórios locais.",
    uso: "Quando o agente trabalha num repositório Git local.",
    inst: "npx -y @modelcontextprotocol/server-git",
    tags: ["git", "versionamento", "dev"],
    fonte: "https://github.com/modelcontextprotocol/servers",
    lic: "MIT"
  },
  
  /* ───── SKILLS ───── */
  {
    tipo: "skill",
    t: "docx",
    autor: "Anthropic Skills",
    mat: "oficial",
    sum: "Cria e edita documentos Word.",
    desc: "Conjunto de instruções e esquemas XML que ensinam a IA a produzir arquivos .docx reais formatados, com tabelas, cabeçalhos e estilos consistentes.",
    uso: "Quando a entrega final precisa ser um relatório ou contrato no Microsoft Word.",
    inst: "Skill pública - acoplada via diretório de skills",
    tags: ["word", "documentos", "escrita"],
    fonte: "#",
    lic: "—"
  },
  {
    tipo: "skill",
    t: "pptx",
    autor: "Anthropic Skills",
    mat: "oficial",
    sum: "Monta decks de slides prontos.",
    desc: "Ensina a IA a produzir decks de slides estruturados .pptx com regras de contraste e layout profissional, a partir de briefings simples.",
    uso: "Para gerar apresentações comerciais, pitch decks ou materiais de treinamento.",
    inst: "Skill pública - acoplada via diretório de skills",
    tags: ["slides", "apresentação", "deck"],
    fonte: "#",
    lic: "—"
  },
  {
    tipo: "skill",
    t: "xlsx",
    autor: "Anthropic Skills",
    mat: "oficial",
    sum: "Cria e corrige planilhas com cálculos.",
    desc: "Adiciona colunas, fórmulas, análise de dados e gera arquivos Excel .xlsx estruturados a partir de dados tabulares ou do chat.",
    uso: "Para gerar relatórios financeiros, conciliações ou tabelas dinâmicas.",
    inst: "Skill pública - acoplada via diretório de skills",
    tags: ["planilha", "excel", "dados"],
    fonte: "#",
    lic: "—"
  },

  /* ───── AGENTES & PROMPTS ───── */
  {
    tipo: "agente",
    t: "Agente Jurídico",
    autor: "Padrão",
    mat: "comunidade",
    sum: "Lê contratos e responde sobre cláusulas de risco.",
    desc: "Persona e diretrizes de prompt de sistema especializada em análise contratual, direito civil brasileiro, LGPD e compliance operacional.",
    uso: "Triagem e auditoria rápida de contratos e termos de adesão.",
    inst: "Prompt de Sistema + Servidor MCP Filesystem",
    tags: ["jurídico", "contratos", "analise"],
    fonte: "#",
    lic: "—"
  },
  {
    tipo: "agente",
    t: "Code Review",
    autor: "Padrão",
    mat: "comunidade",
    sum: "Revisa Pull Requests e aponta potenciais bugs.",
    desc: "Agente especialista em engenharia de software que combina acesso Git e regras de clean code para revisar patches e sugerir refatorações.",
    uso: "Automatização de code review em pipelines locais de desenvolvimento.",
    inst: "Prompt de Sistema + Servidores MCP Git/Github",
    tags: ["código", "review", "git"],
    fonte: "#",
    lic: "—"
  },

  /* ───── FERRAMENTAS & APIs ───── */
  {
    tipo: "ferramenta",
    t: "Messages API",
    autor: "Anthropic",
    mat: "oficial",
    sum: "Endpoint principal para interagir com o Claude.",
    desc: "API REST baseada em streaming para enviar prompts de texto e imagens, gerenciar parâmetros de temperatura e receber respostas estruturadas.",
    uso: "Integração programática direta com modelos Claude 3/3.5/4.5.",
    inst: "POST https://api.anthropic.com/v1/messages",
    tags: ["api", "claude", "llm"],
    fonte: "https://docs.anthropic.com",
    lic: "—"
  },
  {
    tipo: "ferramenta",
    t: "Tool use",
    autor: "Anthropic",
    mat: "oficial",
    sum: "Chamada de função declarativa (Function Calling).",
    desc: "Permite descrever ferramentas e funções personalizadas através de esquemas JSON Schema para que o modelo decida quando e como executá-las.",
    uso: "Estender as capacidades dos agentes conectando APIs e ações externas.",
    inst: "Declarar parâmetro tools[] no payload de Mensagens",
    tags: ["tools", "agente", "api"],
    fonte: "https://docs.anthropic.com",
    lic: "—"
  },

  /* ───── DOCS & GUIAS ───── */
  {
    tipo: "doc",
    t: "Especificação MCP",
    autor: "Mcp.io",
    mat: "oficial",
    sum: "O protocolo padrão aberto para ferramentas de IA.",
    desc: "Documentação de referência do Model Context Protocol (MCP), detalhando a comunicação cliente-servidor, schemas de ferramentas, recursos e prompts.",
    uso: "Desenvolver novos servidores MCP ou integrar clientes adicionais.",
    inst: "Documentação oficial disponível em mcp.io",
    tags: ["mcp", "spec", "referência"],
    fonte: "https://modelcontextprotocol.io",
    lic: "—"
  }
];
