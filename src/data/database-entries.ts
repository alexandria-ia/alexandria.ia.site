export interface DbEntry {
  id: string;
  filename: string;
  meta: string;
  content: string;
}

export interface Category {
  key: string;
  name: string;
  iconName: string;
  files: DbEntry[];
}

export const databaseCategories: Category[] = [
  {
    key: "general",
    name: "Geral",
    iconName: "Globe",
    files: [
      {
        id: "general_base",
        filename: "segundo_cerebro_geral.json",
        meta: "1.1 KB · 350 Tokens",
        content: `{\n  "segundo_cerebro": {\n    "contexto": "regras_gerais_negocio",\n    "evitar_alucinacao": true,\n    "temperamento": "estrito"\n  }\n}`
      },
      {
        id: "general_plan",
        filename: "planejamento_estrategico.json",
        meta: "1.3 KB · 450 Tokens",
        content: `{\n  "planejamento": {\n    "objetivo": "expansao_market_share",\n    "foco": "retencao_clientes_pro",\n    "horizonte_anos": 3\n  }\n}`
      }
    ]
  },
  {
    key: "legal",
    name: "Jurídico",
    iconName: "Scale",
    files: [
      {
        id: "civil_law",
        filename: "segundo_cerebro_juridico.json",
        meta: "2.4 KB · 800 Tokens",
        content: `{\n  "segundo_cerebro": {\n    "contexto": "direito_civil_brasileiro",\n    "priorizar_codigo_civil": true,\n    "limite_alucinacao": 0.0\n  }\n}`
      },
      {
        id: "contract_analysis",
        filename: "analise_contratos.json",
        meta: "2.8 KB · 950 Tokens",
        content: `{\n  "analise_risco": {\n    "contexto": "revisao_clausulas_aditivas",\n    "verificar_multas": true,\n    "seguranca_juridica": "maxima"\n  }\n}`
      }
    ]
  },
  {
    key: "medical",
    name: "Médico",
    iconName: "HeartPulse",
    files: [
      {
        id: "cid10_mapping",
        filename: "segundo_cerebro_medico.json",
        meta: "3.2 KB · 1.100 Tokens",
        content: `{\n  "segundo_cerebro": {\n    "contexto": "mapeamento_anamnese_direta",\n    "evitar_receituario_offlabel": true\n  }\n}`
      },
      {
        id: "pharmacology_check",
        filename: "farmacologia_interacoes.json",
        meta: "3.8 KB · 1.350 Tokens",
        content: `{\n  "interacoes_medicamentosas": {\n    "contexto": "bula_contraindicacoes",\n    "alertar_dosagem_maxima": true,\n    "prioridade": "critica"\n  }\n}`
      }
    ]
  },
  {
    key: "code",
    name: "Código",
    iconName: "Code",
    files: [
      {
        id: "clean_arch",
        filename: "segundo_cerebro_codigo.json",
        meta: "2.1 KB · 700 Tokens",
        content: `{\n  "segundo_cerebro": {\n    "contexto": "clean_architecture_instructions",\n    "regras_typescript": true\n  }\n}`
      },
      {
        id: "git_flow",
        filename: "regras_git_flow.json",
        meta: "1.6 KB · 520 Tokens",
        content: `{\n  "git_rules": {\n    "contexto": "workflow_pull_requests",\n    "exigir_testes_verificados": true,\n    "mensagem_commit": "semantic_commits"\n  }\n}`
      }
    ]
  },
  {
    key: "finance",
    name: "Finanças",
    iconName: "DollarSign",
    files: [
      {
        id: "investment_analysis",
        filename: "analise_investimentos.json",
        meta: "2.7 KB · 920 Tokens",
        content: `{\n  "finance": {\n    "contexto": "valuation_fluxo_caixa",\n    "modelo": "desconto_dividendos",\n    "margem_seguranca": 0.20\n  }\n}`
      },
      {
        id: "risk_control",
        filename: "controle_risco_compliance.json",
        meta: "3.0 KB · 1.050 Tokens",
        content: `{\n  "compliance": {\n    "contexto": "regras_prevencao_fraude",\n    "basileia_iii": true,\n    "limite_exposicao": 0.15\n  }\n}`
      }
    ]
  },
  {
    key: "education",
    name: "Educação",
    iconName: "BookOpen",
    files: [
      {
        id: "didactic_plan",
        filename: "plano_ensino_personalizado.json",
        meta: "1.9 KB · 650 Tokens",
        content: `{\n  "pedagogico": {\n    "contexto": "metodologias_ativas_didatica",\n    "gamificacao": true,\n    "faixa_etaria": "ensino_medio"\n  }\n}`
      },
      {
        id: "didactic_eval",
        filename: "avaliacao_didatica.json",
        meta: "2.3 KB · 780 Tokens",
        content: `{\n  "avaliacao": {\n    "contexto": "competencias_bncc",\n    "taxonomia_bloom": true,\n    "foco_habilidades": ["empatia", "raciocinio_logico"]\n  }\n}`
      }
    ]
  },
  {
    key: "marketing",
    name: "Marketing",
    iconName: "Megaphone",
    files: [
      {
        id: "copywriting",
        filename: "copywriting_vendas.json",
        meta: "2.6 KB · 880 Tokens",
        content: `{\n  "copywriting": {\n    "contexto": "gatilhos_mentais_persuasao",\n    "estrutura": "aida_attention_interest_desire_action",\n    "tom_voz": "autoridade_empatica"\n  }\n}`
      },
      {
        id: "funnel_leads",
        filename: "persona_leads_funil.json",
        meta: "1.8 KB · 640 Tokens",
        content: `{\n  "marketing_funil": {\n    "contexto": "jornada_compra_cliente",\n    "segmentacao": "b2b_saas",\n    "scoring_minimo_lead": 75\n  }\n}`
      }
    ]
  },
  {
    key: "data_science",
    name: "Dados",
    iconName: "Database",
    files: [
      {
        id: "preprocessing",
        filename: "pipeline_pre_processamento.json",
        meta: "3.4 KB · 1.150 Tokens",
        content: `{\n  "data_science": {\n    "contexto": "engenharia_features_outliers",\n    "escala": "standard_scaler",\n    "tratar_nulos": "mediana"\n  }\n}`
      },
      {
        id: "model_metrics",
        filename: "metricas_avaliacao_modelos.json",
        meta: "2.5 KB · 820 Tokens",
        content: `{\n  "metricas": {\n    "contexto": "validacao_cruzada",\n    "foco": "f1_score_precision_recall",\n    "limite_overfitting": 0.05\n  }\n}`
      }
    ]
  },
  {
    key: "design",
    name: "Design",
    iconName: "Palette",
    files: [
      {
        id: "visual_identity",
        filename: "diretrizes_identidade_visual.json",
        meta: "2.2 KB · 730 Tokens",
        content: `{\n  "design_sistema": {\n    "contexto": "regras_identidade_marca",\n    "acessibilidade_wcag": true,\n    "contraste_minimo": 4.5\n  }\n}`
      },
      {
        id: "midjourney_prompts",
        filename: "generativo_prompt_midjourney.json",
        meta: "1.9 KB · 600 Tokens",
        content: `{\n  "prompt_generator": {\n    "contexto": "hiperrealismo_parametros",\n    "midjourney_v6": true,\n    "proporcao_tela": "16:9"\n  }\n}`
      }
    ]
  },
  {
    key: "logistics",
    name: "Logística",
    iconName: "Truck",
    files: [
      {
        id: "fleet_routing",
        filename: "roteirizacao_frotas_otimizada.json",
        meta: "2.9 KB · 900 Tokens",
        content: `{\n  "logistica": {\n    "contexto": "algoritmo_menor_distancia",\n    "evitar_pedagios": false,\n    "calculo_combustivel": "litros_por_km"\n  }\n}`
      },
      {
        id: "inventory_control",
        filename: "controle_inventario_demanda.json",
        meta: "2.4 KB · 810 Tokens",
        content: `{\n  "estoque": {\n    "contexto": "previsao_ressuprimento",\n    "curva_abc": true,\n    "nivel_servico": 0.95\n  }\n}`
      }
    ]
  },
  {
    key: "security",
    name: "Segurança",
    iconName: "Shield",
    files: [
      {
        id: "firewall_rules",
        filename: "regras_firewall_hardening.json",
        meta: "3.1 KB · 1.050 Tokens",
        content: `{\n  "ciberseguranca": {\n    "contexto": "politicas_hardening_linux",\n    "bloquear_ssh_root": true,\n    "nivel_criptografia": "tls_1_3"\n  }\n}`
      },
      {
        id: "intrusion_logs",
        filename: "analise_logs_intrusao.json",
        meta: "2.8 KB · 980 Tokens",
        content: `{\n  "devsecops_auditoria": {\n    "contexto": "assinaturas_ataques_conhecidos",\n    "alertar_sql_injection": true,\n    "severidade": "alta"\n  }\n}`
      }
    ]
  },
  {
    key: "hr",
    name: "Pessoas",
    iconName: "Users",
    files: [
      {
        id: "performance_eval",
        filename: "avaliacao_desempenho_feedbacks.json",
        meta: "1.8 KB · 590 Tokens",
        content: `{\n  "gestao_pessoas": {\n    "contexto": "modelo_feedbacks_360",\n    "metas_smart": true,\n    "frequencia": "trimestral"\n  }\n}`
      },
      {
        id: "cv_screening",
        filename: "triagem_curriculos_ats.json",
        meta: "2.0 KB · 680 Tokens",
        content: `{\n  "ats_recrutamento": {\n    "contexto": "extração_competencias_chave",\n    "ranquear_candidatos": true,\n    "peso_experiencia": 0.60\n  }\n}`
      }
    ]
  },
  // Futuristic niche: Agriculture/Weather (Agropecuária/Clima)
  {
    key: "agriculture",
    name: "Agropecuária",
    iconName: "Sprout",
    files: [
      {
        id: "crop_yield",
        filename: "previsao_safra_precisao.json",
        meta: "2.6 KB · 850 Tokens",
        content: `{\n  "smart_farming": {\n    "contexto": "monitoramento_sensores_solo",\n    "index_ndvi": 0.72,\n    "irrigacao_automatica": true,\n    "umidade_alvo": "65%"\n  }\n}`
      },
      {
        id: "weather_risk",
        filename: "analise_risco_climatico.json",
        meta: "3.1 KB · 1.020 Tokens",
        content: `{\n  "climatologia": {\n    "contexto": "previsao_geadas_estiagem",\n    "probabilidade_anomalia": 0.12,\n    "modelo_preditivo": "ecmwf_ensemble",\n    "alertar_produtores": true\n  }\n}`
      }
    ]
  },
  // Futuristic niche: Space Exploration (Aeroespacial/Física)
  {
    key: "space",
    name: "Espacial",
    iconName: "Rocket",
    files: [
      {
        id: "orbit_calc",
        filename: "calculo_orbita_transferencia.json",
        meta: "3.5 KB · 1.200 Tokens",
        content: `{\n  "aeroespacial": {\n    "contexto": "orbita_transferencia_hohmann",\n    "apoastro_km": 42164,\n    "periastro_km": 244,\n    "delta_v_necessario_ms": 3820\n  }\n}`
      },
      {
        id: "telemetry_sat",
        filename: "telemetria_constelacao_satelites.json",
        meta: "2.9 KB · 950 Tokens",
        content: `{\n  "constelacao": {\n    "satelites_ativos": 72,\n    "frequencia_operacao": "Ka-band",\n    "saude_bateria_percent": 98.6,\n    "sistema_propulsao": "ion_thruster"\n  }\n}`
      }
    ]
  },
  // Futuristic niche: Neuroscience (Neurociência/BCI)
  {
    key: "neuroscience",
    name: "Neurociência",
    iconName: "Brain",
    files: [
      {
        id: "eeg_classification",
        filename: "classificacao_ondas_eeg.json",
        meta: "3.9 KB · 1.400 Tokens",
        content: `{\n  "bci_interface": {\n    "contexto": "classificador_motor_imagery",\n    "filtros_bandpass": [8, 30],\n    "precisao_alvo": 0.94,\n    "canais_ativos": ["C3", "Cz", "C4"]\n  }\n}`
      },
      {
        id: "synaptic_plasticity",
        filename: "modelagem_plasticidade_sinaptica.json",
        meta: "2.8 KB · 910 Tokens",
        content: `{\n  "neuroplasticidade": {\n    "contexto": "stdp_spike_timing_dependent",\n    "constante_tempo_ms": 20,\n    "taxa_aprendizado_sinapse": 0.005\n  }\n}`
      }
    ]
  },
  // Futuristic niche: Customer Experience (Atendimento/CX)
  {
    key: "customer_service",
    name: "Atendimento",
    iconName: "Headphones",
    files: [
      {
        id: "sentiment_routing",
        filename: "roteamento_sentimento_chamados.json",
        meta: "2.2 KB · 720 Tokens",
        content: `{\n  "atendimento_cx": {\n    "contexto": "analise_sentimento_tempo_real",\n    "escalar_detratores": true,\n    "tempo_resposta_alvo_min": 5\n  }\n}`
      },
      {
        id: "faq_automation",
        filename: "automacao_faq_resolucao.json",
        meta: "3.0 KB · 1.050 Tokens",
        content: `{\n  "faq_agent": {\n    "contexto": "respostas_auto_ajuda",\n    "confianca_minima_disparo": 0.85,\n    "encaminhar_humano_se_falhar": true\n  }\n}`
      }
    ]
  },
  // Futuristic niche: Game Dev (Desenvolvimento de Jogos)
  {
    key: "gaming",
    name: "Jogos",
    iconName: "Gamepad2",
    files: [
      {
        id: "npc_behavior",
        filename: "comportamento_npc_arvore_decisao.json",
        meta: "3.3 KB · 1.100 Tokens",
        content: `{\n  "npc_ia": {\n    "contexto": "behavior_tree_combate",\n    "distancia_ataque": 5.0,\n    "vida_baixa_recuar": true,\n    "patrulha_waypoints": 8\n  }\n}`
      },
      {
        id: "procedural_generation",
        filename: "geracao_procedural_terreno.json",
        meta: "2.7 KB · 890 Tokens",
        content: `{\n  "procedural": {\n    "semente": 847392,\n    "algoritmo": "perlin_noise_octaves",\n    "frequencia_base": 0.005,\n    "altura_maxima_metros": 250\n  }\n}`
      }
    ]
  },
  // Futuristic niche: E-commerce (Vendas/E-commerce)
  {
    key: "e_commerce",
    name: "E-commerce",
    iconName: "ShoppingBag",
    files: [
      {
        id: "recommendation_engine",
        filename: "motor_recomendacao_produtos.json",
        meta: "3.0 KB · 980 Tokens",
        content: `{\n  "recomendacao": {\n    "contexto": "filtragem_colaborativa_item",\n    "itens_similares_max": 5,\n    "peso_compra_recente": 0.70,\n    "excluir_ja_adquiridos": true\n  }\n}`
      },
      {
        id: "churn_prediction",
        filename: "predicao_churn_assinantes.json",
        meta: "2.4 KB · 820 Tokens",
        content: `{\n  "churn_ia": {\n    "contexto": "analise_inatividade_usuario",\n    "dias_inatividade_alerta": 14,\n    "disparar_cupom_retencao": true,\n    "desconto_percent": 15\n  }\n}`
      }
    ]
  }
];
