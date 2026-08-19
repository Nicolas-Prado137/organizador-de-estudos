# ⚡ EstudoFlux
> **Plataforma de Organização de Estudos com Revisão Espaçada, Streak e Checkpoints**
EstudoFlux é uma aplicação web completa para quem quer estudar com consistência e inteligência. Combine planejamento semanal, revisão espaçada científica, gamificação motivacional e backup automático — tudo funcionando direto no navegador, sem instalação.
---
## 🖥️ Como Usar
Sem instalação, sem servidor, sem internet obrigatória.
1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` diretamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).
3. Pronto — comece a usar!
> Todos os dados são salvos automaticamente no **LocalStorage** do seu navegador.
---
## ✨ Funcionalidades
### 📚 Cadastro de Matérias
- **Modo Simples** — apenas o nome da matéria (ex: "História").
- **Modo Detalhado** — nome + lista de assuntos/tópicos em sequência (ex: "Matemática" → "Frações", "Equações", "Trigonometria"...).
- Cada sessão de estudo no modo detalhado avança automaticamente para o próximo assunto da lista.
- Reordenação manual de tópicos (▲/▼).
- Opção de **Pausar** matérias temporariamente sem perder histórico.
- Adicionar, editar e excluir matérias a qualquer momento.
### 📅 Grade Semanal
- Defina **quantas matérias estudar por dia** (1 a 5).
- **Sorteio Automático** — a plataforma distribui as matérias nos 7 dias da semana de forma aleatória e equilibrada.
- **Organização Manual via Drag & Drop** — arraste matérias diretamente para os dias desejados.
- A grade fica **fixada** para todas as semanas seguintes, até que você a altere manualmente.
- Botão **Limpar Grade** para recomeçar do zero.
### 🧠 Revisão Espaçada (3 / 7 / 15 / 21 dias)
- Ao concluir uma sessão de estudo, 4 revisões são agendadas automaticamente.
- Intervalos baseados em pesquisa científica de retenção de memória:
  | Revisão | Intervalo |
  |---------|-----------|
  | 1ª      | +3 dias   |
  | 2ª      | +7 dias   |
  | 3ª      | +15 dias  |
  | 4ª      | +21 dias  |
- Todas as revisões são agendadas para o **período noturno** (padrão: **22:00**, ajustável).
- Ações por revisão: **Concluir ✓**, **Adiar +1 dia** ou **Marcar como Perdida ✗**.
- Revisões atrasadas são destacadas com alerta visual.
### 🔥 Streak e Gamificação
- **Contador de Sequência (Streak)** — dias consecutivos com pelo menos uma sessão de estudo ou revisão concluída.
- **Maior Recorde** — seu melhor streak histórico.
- **Alerta de Risco** — banner de aviso caso o dia ainda não tenha registro de estudo.
- **Heatmap de Atividade** estilo GitHub — visualize os últimos 119 dias de estudos com intensidade de cor.
- **Selos e Conquistas** desbloqueáveis:
  | Selo | Critério |
  |------|----------|
  | 🚀 Primeira Jornada | Concluir 1 sessão de estudo |
  | 🔥 Semana Imparável | 7 dias consecutivos de streak |
  | 🧠 Mestre da Retenção | 15 revisões espaçadas concluídas |
  | 🌙 Foco Noturno | Revisar após as 22h |
  | 🏆 Lenda dos 30 Dias | 30 dias consecutivos de streak |
### 💾 Checkpoints e Backup
- **Checkpoints Automáticos** — salvos automaticamente antes de cada mudança estrutural (sorteio, alteração de grade, importação, exclusão de matéria).
- **Checkpoints Manuais** — crie pontos nomeados a qualquer momento.
- **Restauração em 1 clique** — volte ao estado exato de qualquer checkpoint salvo.
- Histórico mantém os **15 checkpoints mais recentes**.
### 📤 Exportação e Importação de Planos de Estudo
- **Exportar** — salva o plano atual (matérias, tópicos, grade semanal, configurações) em arquivo `.json`.
- **Importar** — carrega um plano de outro dispositivo ou de um backup:
  - **Substituir** — substitui completamente o plano atual.
  - **Mesclar** — adiciona apenas as matérias novas sem apagar as existentes.
### 📊 Estatísticas
- Total de sessões de estudo concluídas.
- Total de revisões realizadas.
- Taxa de sucesso em revisões (concluídas vs. perdidas).
- Ranking das matérias mais estudadas com barra de progresso.
---
## 🎨 Design
- **Dark Mode** por padrão — ideal para uso noturno (na hora das revisões).
- Alternador para **Light Mode** com persistência.
- Glassmorphism, gradientes suaves e micro-animações.
- Tipografia **Plus Jakarta Sans** (Google Fonts).
- Layout **responsivo** para desktop e mobile.
- Navegação mobile via barra inferior.
---
## 🗂️ Estrutura do Projeto
```
EstudoFlux/
│
└── index.html          # Aplicação completa (HTML + CSS + JS em arquivo único)
```
> O projeto foi desenvolvido como um **Single File App** — todo o CSS e JavaScript estão embutidos diretamente no `index.html`. Isso garante funcionamento imediato sem necessidade de servidor, build ou dependências externas.
---
## 💡 Modelo de Dados (LocalStorage)
|
 Chave              
|
 Conteúdo                                                         
|
|
--------------------
|
------------------------------------------------------------------
|
|
`ef_state_v2`
|
 Estado completo: matérias, grade, revisões, logs, stats, selos  
|
|
`ef_checkpoints_v2`
|
 Histórico de até 15 snapshots para restauração                  
|
|
`ef_theme`
|
 Preferência de tema (dark/light)                                
|
### Formato do arquivo de exportação (JSON)
```json
{
  "version": "1.1",
  "exportedAt": "2026-08-19T00:00:00.000Z",
  "subjects": [...],
  "schedule": {
    "maxPerDay": 2,
    "days": { "0": ["s1","s3"], "1": ["s2","s4"], ... }
  },
  "nightTime": "22:00"
}
```
---
## 🔄 Fluxo de Uso Recomendado
```
1. Cadastre suas matérias (Simples ou Detalhado)
        ↓
2. Configure a Grade Semanal (Sorteio ou Manual)
        ↓
3. Acesse o Dashboard diariamente
        ↓
4. Conclua as matérias do dia → revisões são agendadas automaticamente
        ↓
5. À noite (a partir das 22h), revise os assuntos da seção "Revisões de Hoje"
        ↓
6. Mantenha seu Streak! 🔥
```
---
## 🛡️ Privacidade
Todos os dados são armazenados **exclusivamente no seu navegador** via `localStorage`. Nenhuma informação é enviada para servidores externos.
---
## 🤝 Tecnologias Utilizadas
|Este projeto foi realizado com o auxílio da IA Gemini 3.6 flash.                                  
-------------------------------------
| HTML5             
| Estrutura semântica                 
| CSS3 (Vanilla)    
| Design system, dark mode, animações 
| JavaScript (ES6+) 
| Lógica, roteamento, LocalStorage    
| Google Fonts      
| Tipografia (Plus Jakarta Sans)      
---
## 📄 Licença
Este projeto é de uso pessoal e livre. Sinta-se à vontade para adaptar conforme suas necessidades.
