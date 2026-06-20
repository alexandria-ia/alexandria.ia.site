# Manual de Identidade Visual & Design System - alexandria-tech

Este documento estabelece as diretrizes de design, branding, paleta de cores, tipografia e comportamento interativo do ecossistema **alexandria-tech**. O objetivo é padronizar a criação de novas interfaces e a manutenção de páginas existentes por agentes de Inteligência Artificial.

---

## 1. Filosofia de Marca (Branding)

A **alexandria-tech** representa o cruzamento entre a antiguidade clássica (inspirada na Grande Biblioteca de Alexandria) e a computação de alto desempenho futurista. 

- **Tom & Voz**: Técnico, misterioso, confiável, de elite e minimalista.
- **Conceito Visual**: Um "blueprint" digital escuro com marcações de medição técnica, iluminado por segredos dourados e alquímicos.
- **Logo Oficial**: O logo deve ser escrito em caixa baixa com tipografia de largura fixa ou serifada clássica entre colchetes em tons suaves:
  ```text
  [ alexandria-tech ]
  ```

---

## 2. Paleta de Cores (Tokens de Cores)

O sistema de cores baseia-se em um contraste de alto impacto entre fundos ultra-escuros (representando o desconhecido) e destaques em dourado clássico (representando o conhecimento e os tokens de IA).

| Nome do Token | Código CSS/HEX | Utilização Recomendada |
| :--- | :--- | :--- |
| `bg-deep` | `#05070B` | Fundo principal da página. |
| `bg-alt` | `#0A0F18` | Fundo de painéis secundários, cards e blocos flutuantes. |
| `accent` | `#D4AF5A` | Dourado principal para textos em shimmer, botões de ação e links ativos. |
| `accent-light` | `#E7C879` | Dourado suave para estados de hover e texto em destaque. |
| `accent-dark` | `#8C6A2A` | Dourado queimado para bordas sutis e sombras de relevo. |
| `text-primary` | `rgba(255,255,255,0.92)` | Cor do texto principal de leitura. |
| `text-secondary`| `#9EA5B3` | Cor de legendas, labels de formulários e descrições secundárias. |
| `text-muted` | `rgba(255,255,255,0.25)` | Identificadores de código de API, barras verticais e separadores. |
| `border-subtle` | `rgba(255,255,255,0.05)` | Divisores sutis e linhas de separação internas. |
| `border-card` | `rgba(255,255,255,0.08)` | Bordas externas de cards e modais transparentes. |

---

## 3. Tipografia

A tipografia combina uma fonte serifada geométrica para títulos de impacto e uma fonte sem serifa limpa para interfaces operacionais.

- **Títulos (Headings / Logos)**:
  - **Fonte**: `Marcellus` ou `Marcellus Prose` (Serifada clássica).
  - **Uso**: Em caixa alta (`uppercase`), com espaçamento extra de letras (`tracking-widest`) e leve achatamento no eixo Y (`scale-y-[0.85]` ou `scale-y-[0.9]`) para simular inscrições clássicas.
- **Interface e Leitura (Body / Buttons)**:
  - **Fonte**: `Inter` ou fontes Sans-Serif modernas de alta legibilidade.
  - **Uso**: Pesos médios a semi-negritos para contraste.
- **Códigos e Telemetria (Monospace)**:
  - **Fonte**: `JetBrains Mono`, `Fira Code` ou `Courier New`.
  - **Uso**: Dados de logs, IDs de transações, caminhos de arquivos e snippets de código.

---

## 4. Elementos Visuais e Temáticos

### A. Grade de Blueprint (`blueprint-grid`)
As páginas devem utilizar uma grade de engenharia de plano técnico no fundo. O padrão consiste em linhas horizontais e verticais finas com opacidade extremamente sutil.
```css
.blueprint-grid {
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.008) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.008) 1px, transparent 1px),
    linear-gradient(rgba(201, 165, 90, 0.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(201, 165, 90, 0.012) 1px, transparent 1px);
  background-size: 24px 24px, 24px 24px, 120px 120px, 120px 120px;
  pointer-events: none;
}
```

### B. Retículas e Miras Técnicas (`bp-cross`)
Para demarcar os cantos dos painéis de controle e cards flutuantes, utilizam-se miras técnicas de blueprint:
```css
.bp-cross {
  position: absolute;
  width: 11px;
  height: 11px;
  color: rgba(201, 165, 90, 0.35);
  pointer-events: none;
}
.bp-cross::before { top: 5px; left: 0; right: 0; height: 1px; content: ''; position: absolute; background: currentColor; }
.bp-cross::after { left: 5px; top: 0; bottom: 0; width: 1px; content: ''; position: absolute; background: currentColor; }
```

### C. Glassmorphism em Modais e Cards
Os cards devem parecer placas de vidro flutuando sobre a grade técnica:
- Fundo: `bg-bg-alt/90` com blur `backdrop-blur-[16px]`.
- Borda: Borda fina (`border border-border-card`).
- Efeito de Sombra: `shadow-[0_24px_64px_rgba(0,0,0,0.55)]`.

---

## 5. Micro-animações e Interações Dinâmicas

A interface deve parecer responsiva e ativa ao toque do usuário:

- **Efeito Shimmer no Texto Dourado**:
  ```css
  @keyframes shimmer-gold {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .shimmer-gold-text {
    background: linear-gradient(90deg, #D4AF5A 0%, #FFF2CC 25%, #E7C879 50%, #8C6A2A 75%, #D4AF5A 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer-gold 7s linear infinite;
  }
  ```
- **Conectores e Linhas Luminosas**: Linhas de ancoragem e fluxos verticais dinâmicos de luz ligando as seções da página.
- **Flutuações de Status**: Indicadores ativos piscando suavemente com `animate-[pulse-status_1.5s_infinite_linear]`.
- **Ancoragem de Links com Rolagem Suave**:
  ```css
  html {
    scroll-behavior: smooth;
  }
  ```

---

## 6. Padrões de Layout e Componentes

1. **Navbar**: Fundo semi-transparente fixo (`fixed top-0`) com efeito blur, link do logo centralizado/alinhado e links de navegação em caixa alta com sublinhado animado no hover.
2. **Footer**: Minimalista, limpo e utilitário. Sem links falsos ou colunas em branco; apenas links de rotas ativas da plataforma.
3. **Página de Área de Membros (`/members`)**: Dividida em Grid assimétrico (1/3 para controle de assinatura e atalhos de comunidade; 2/3 para console interativo de API/FAQ e estatísticas de afiliados).
4. **Página de Admin (`/admin`)**: Acesso com triplo fator (Usuário, Senha e Token SHA-256) em card isolado. Área logada com abas horizontais ou verticais de fácil transição de dados de telemetria.
