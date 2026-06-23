<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:claude.md-rules -->
# GEMINI.md - Regras Operacionais do Agente

## 1. Pense Antes de Agir
- Antes de escrever qualquer código, formule um plano claro e apresente-o.
- Se o pedido for vago ou ambíguo, **pergunte** para esclarecer — nunca assuma.
- Se a abordagem sugerida for complexa, proponha uma alternativa mais simples antes de executar.

## 2. Simplicidade Acima de Tudo
- Implemente **apenas** o que foi explicitamente solicitado.
- Proibido adicionar features, abstrações ou melhorias fora do escopo pedido.
- Prefira a solução mais direta e enxuta que resolve o problema.

## 3. Mudanças Cirúrgicas
- Altere **somente** o trecho de código diretamente relacionado à tarefa.
- Não refatore, renomeie ou reorganize nada que não foi pedido.
- Preserve toda a arquitetura e lógica existente ao redor da mudança.

## 4. Execução Baseada em Metas
- Antes de executar, defina critérios claros de sucesso para a tarefa.
- Após entregar, revise o próprio resultado contra esses critérios.
- Se o resultado não atingir os critérios, reitere automaticamente até atingi-los.
- Não encerre a tarefa enquanto os critérios não forem satisfeitos.
<!-- END:claude.md-rules -->

<!-- BEGIN:obsidian-rules -->
# Memória Persistente — Obsidian Vault

**Vault:** `E:\_Biblioteca\Notas Obsidian\Alexandria.IA\Alexandria.IA`

## Regra Principal
Sempre que uma implementação for concluída (feature, fix, refactor, config), **documente** no vault do Obsidian.

## Fluxo Obrigatório (Ler → Depois Escrever)

### 1. LEIA ANTES
Antes de criar ou editar qualquer nota, **leia o conteúdo existente** no vault:
- Liste os arquivos e pastas do vault para entender a estrutura atual.
- Leia as notas da pasta/módulo relacionado à mudança feita.
- Identifique se já existe uma nota sobre o assunto — se existir, **atualize-a** em vez de criar uma nova.

### 2. ESCREVA DEPOIS
Só após ler e entender o contexto existente, documente:
- **Atualizar nota existente** se o assunto já foi documentado.
- **Criar nota nova** apenas se for um assunto inédito no vault.

## Estrutura do Vault
Respeite a organização existente. Cada módulo do projeto tem sua própria pasta com subpastas:
- `Combos/` — Definições de combos e presets
- `Configuracao/` — Endpoints, URLs, configs
- `Documentacao/` — Arquitetura, conceitos, guias
- `Otimizacao/` — Roadmap, diagnósticos, melhorias

Se o módulo documentado ainda não tem pasta no vault, crie seguindo o mesmo padrão.

## Formato das Notas
- Use Markdown compatível com Obsidian.
- Links internos com `[[nome-da-nota]]` quando referenciar outras notas do vault.
- Inclua a data da alteração no corpo da nota (`> Atualizado em: YYYY-MM-DD`).
- Seja objetivo — documente **o que foi feito, por que, e decisões relevantes**.
<!-- END:obsidian-rules -->
