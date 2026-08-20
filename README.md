# ⚡ EstudoFlux
> **Plataforma de Organização de Estudos com Revisão Espaçada, Streak, Checkpoints e Auto-Salvamento no PC**
EstudoFlux é uma aplicação web completa para quem quer estudar com consistência e inteligência. Combine planejamento semanal, revisão espaçada científica, gamificação motivacional, salvamento no navegador e **sincronização com arquivos no computador** — tudo funcionando direto no navegador, sem instalação.
---
### 📂 Como abrir no Windows:
1. Pressione **`Windows + E`** para abrir o **Explorador de Arquivos**.
2. Cole o caminho `C:\Users\nprad\OneDrive\Documentos\Estudos` na barra de endereço superior e pressione **Enter**.
3. Dê um **duplo clique em `index.html`** para abrir a plataforma diretamente no seu navegador.
---
## 🖥️ Como Usar
Sem instalação, sem servidor e sem necessidade de conexão com a internet.
1. Abra o arquivo `index.html` em qualquer navegador (Chrome, Edge, Firefox, Safari).
2. Pronto — comece a organizar seus estudos!
---
## 💻 Salvamento no Computador e no Navegador
A plataforma oferece salvamento duplo para garantir que você nunca perca seus dados:
1. **LocalStorage do Navegador (Padrão)**: Todos os seus dados são salvos automaticamente no navegador a cada alteração.
2. **Auto-Salvamento e Leitura do PC**:
   - **`📂 Abrir do PC`**: Abre a janela nativa do Windows para você selecionar qualquer arquivo `.json` salvo no computador e carregar seus dados instantaneamente.
   - **`💻 Auto-Salvar no PC`**: Vincula a plataforma a um arquivo `.json` no seu disco rígido. Toda mudança feita na tela é gravada automaticamente no arquivo local.
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
├── index.html          # Aplicação completa (HTML + CSS + JS em arquivo único)
└── README.md           # Documentação e guia do projeto
```
---
## 🛡️ Privacidade
Todos os dados são armazenados **exclusivamente no seu computador e navegador**. Nenhuma informação é enviada para servidores externos.
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
