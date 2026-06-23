export interface Agent {
  id: number;
  name: string;
  icon: string;
  desc: string;
  model: string;
  cat: 'dev' | 'juridico' | 'marketing' | 'engenharia' | 'negocios' | 'saude' | 'educacao' | 'outro';
  color: string;
  tag: 'popular' | 'new' | 'pro' | '';
  plan: 'free' | 'pro';
  custom?: boolean;
}

export const DEFAULT_AGENTS: Agent[] = [
  {
    id: 1,
    name: 'CodeMaster',
    icon: 'fa-solid fa-laptop-code',
    desc: 'Revisão de código, debug, arquitetura e boas práticas.',
    model: 'Qwen2.5-Coder',
    cat: 'dev',
    color: '#1D9E75',
    tag: 'popular',
    plan: 'free'
  },
  {
    id: 2,
    name: 'JurisIA',
    icon: 'fa-solid fa-scale-balanced',
    desc: 'Contratos, petições, análise jurídica e legislação brasileira.',
    model: 'Llama 3.1 70B',
    cat: 'juridico',
    color: '#534AB7',
    tag: 'popular',
    plan: 'pro'
  },
  {
    id: 3,
    name: 'RedatorPro',
    icon: 'fa-solid fa-pen-nib',
    desc: 'Copy, artigos, posts, e-mails e roteiros profissionais.',
    model: 'Llama 3.1 70B',
    cat: 'marketing',
    color: '#EF9F27',
    tag: 'popular',
    plan: 'free'
  },
  {
    id: 4,
    name: 'EngCalc',
    icon: 'fa-solid fa-helmet-safety',
    desc: 'Cálculos estruturais, laudos técnicos e normas ABNT.',
    model: 'Llama 3.1 70B',
    cat: 'engenharia',
    color: '#378ADD',
    tag: 'new',
    plan: 'pro'
  },
  {
    id: 5,
    name: 'FinanceBot',
    icon: 'fa-solid fa-sack-dollar',
    desc: 'Análise de investimentos, FIIs, ações e planejamento.',
    model: 'Qwen2.5 32B',
    cat: 'negocios',
    color: '#639922',
    tag: 'new',
    plan: 'pro'
  },
  {
    id: 6,
    name: 'SalesCoach',
    icon: 'fa-solid fa-bullseye',
    desc: 'Scripts de vendas, objeções, funil e fechamento.',
    model: 'Mistral 7B',
    cat: 'negocios',
    color: '#D4537E',
    tag: '',
    plan: 'free'
  },
  {
    id: 7,
    name: 'DataAnalyst',
    icon: 'fa-solid fa-chart-bar',
    desc: 'Análise de dados, SQL, Python, pandas e visualizações.',
    model: 'Qwen2.5-Coder',
    cat: 'dev',
    color: '#7F77DD',
    tag: 'new',
    plan: 'pro'
  },
  {
    id: 8,
    name: 'TradutorTech',
    icon: 'fa-solid fa-globe',
    desc: 'Tradução técnica especializada BR/EN/ES com contexto.',
    model: 'Qwen2.5 32B',
    cat: 'marketing',
    color: '#0F6E56',
    tag: '',
    plan: 'free'
  },
  {
    id: 9,
    name: 'MedAssist',
    icon: 'fa-solid fa-stethoscope',
    desc: 'Referências médicas, bulas, CID-10 e protocolos clínicos.',
    model: 'Llama 3.1 70B',
    cat: 'saude',
    color: '#A32D2D',
    tag: 'new',
    plan: 'pro'
  },
  {
    id: 10,
    name: 'ProfessorIA',
    icon: 'fa-solid fa-graduation-cap',
    desc: 'Explicações didáticas, resumos, quizzes e planos de aula.',
    model: 'Llama 3.1 70B',
    cat: 'educacao',
    color: '#185FA5',
    tag: '',
    plan: 'free'
  },
  {
    id: 11,
    name: 'HRCoach',
    icon: 'fa-solid fa-handshake',
    desc: 'Currículos, entrevistas, avaliações de desempenho e RH.',
    model: 'Mistral 7B',
    cat: 'negocios',
    color: '#854F0B',
    tag: '',
    plan: 'free'
  },
  {
    id: 12,
    name: 'SecBot',
    icon: 'fa-solid fa-lock',
    desc: 'Análise de vulnerabilidades, pentest e segurança de código.',
    model: 'Qwen2.5-Coder',
    cat: 'dev',
    color: '#E24B4A',
    tag: 'pro',
    plan: 'pro'
  }
];
