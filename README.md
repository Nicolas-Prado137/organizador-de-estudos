# ⚡ EstudoFlux

> **Plataforma de Organização de Estudos com Flashcards 3D, Exportação/Importação de Cards, Revisão Espaçada, Streak e Auto-Salvamento no PC**

EstudoFlux é uma aplicação web completa para quem quer estudar com consistência e inteligência. Combine planejamento semanal, **flashcards interativos com virada de 2 minutos e exportação/importação independente**, revisão espaçada científica, gamificação motivacional, salvamento no navegador e **sincronização com arquivos no computador** — tudo funcionando direto no navegador, sem instalação.

---

## 📍 Localização do Projeto no Seu Computador

O projeto está armazenado na pasta:
```text
C:\Users\nprad\OneDrive\Documentos\Estudos
```

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

## 🎴 Flashcards Interativos & Importação/Exportação

Acesse a opção **`🎴 Flashcards`** no menu lateral para criar, praticar, exportar e importar baralhos de cartões:

- **Seleção de Matéria**: Vincule cada flashcard à sua respectiva matéria cadastrada.
- **Frente do Card (Tema / Assunto)**: Exibe a pergunta ou conceito que você quer praticar.
- **Verso do Card (Informações / Resposta)**: Contém as explicações detalhadas escritas por você.
- **Virada Automática em 2 Minutos**:
  - Cronômetro regressivo e barra de progresso visual de **2 minutos (120 segundos)**.
  - Ao esgotar o tempo, o card gira em **3D** automaticamente revelando o verso!
- **Botão Manual de Verso**: Clique no próprio card ou no botão **`🔄 Girar Card / Ver Verso`** para virar o card a qualquer momento.
- **📥 Exportar Flashcards**: Baixa um arquivo `.json` dedicado contendo apenas os seus flashcards criados.
- **📤 Importar Flashcards**: Permite carregar um arquivo de flashcards do computador ou colar o código JSON diretamente, com as opções:
  - **Mesclar**: Adiciona os novos flashcards sem apagar os existentes.
  - **Substituir**: Substitui toda a lista de flashcards atuais.

---

## 💻 Salvamento no Computador e no Navegador

A plataforma oferece salvamento duplo para garantir que você nunca perca seus dados:

1. **LocalStorage do Navegador (Padrão)**: Todos os seus dados são salvos automaticamente no navegador a cada alteração.
2. **Auto-Salvamento e Leitura do PC**:
   - **`📂 Abrir do PC`**: Abre a janela nativa do Windows para você selecionar qualquer arquivo `.json` salvo no computador e carregar seus dados instantaneamente.
   - **`💻 Auto-Salvar no PC`**: Vincula a plataforma a um arquivo `.json` no seu disco rígido. Toda mudança feita na tela é gravada automaticamente no arquivo local.

---

## ✨ Funcionalidades

### 🎴 Flashcards com Temporizador de 2 Minutos & Backup
- Escolha a matéria cadastrada no sistema.
- Defina o tema/assunto na frente e a resposta/explicativo no verso.
- Animação em 3D com rotação de 180 graus.
- Temporizador regressivo de 2 minutos com barra de progresso.
- Exportação e importação dedicada de decks de flashcards em formato JSON.

### 📚 Cadastro de Matérias
- **Modo Simples** — apenas o nome da matéria (ex: "História").
- **Modo Detalhado** — nome + lista de assuntos/tópicos em sequência (ex: "Matemática" → "Frações", "Equações", "Trigonometria"...).
- Cada sessão de estudo no modo detalhado avança automaticamente para o próximo assunto da lista.
- Reordenação manual de tópicos (▲/▼).
- Opção de **Pausar** matérias temporariamente sem perder histórico.

### 📅 Grade Semanal
- Defina **quantas matérias estudar por dia** (1 a 5).
- **Sorteio Automático** — a plataforma distribui as matérias nos 7 dias da semana de forma aleatória e equilibrada.
- **Organização Manual via Drag & Drop** — arraste matérias diretamente para os dias desejados.

### 🧠 Revisão Espaçada (3 / 7 / 15 / 21 dias)
- Ao concluir uma sessão de estudo, 4 revisões são agendadas automaticamente.
- Período noturno (padrão **22:00**).

### 🔥 Streak e Gamificação
- **Contador de Sequência (Streak)** — dias consecutivos de estudo.
- **Heatmap de Atividade** estilo GitHub (últimos 119 dias).
- **Selos e Conquistas** desbloqueáveis.

### 💾 Checkpoints e Backup Generais
- Checkpoints Automáticos e Manuais.
- Exportação e Importação completa do plano de estudo.

---

## 🎨 Design

- **Dark Mode** por padrão com suporte a **Light Mode**.
- Animação 3D Flip para os Flashcards.
- Design responsivo para desktop e mobile.

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
