/* ==========================================================================
   ESTUDOFLUX - DATA STORE & APP STATE MANAGEMENT
   ========================================================================== */

const STORAGE_KEY = 'estudoflux_state_v1';
const CHECKPOINTS_KEY = 'estudoflux_checkpoints_v1';

// Motivational quotes collection
const MOTIVATIONAL_QUOTES = [
  "A constância é a chave que transforma esforço em conquista extraordinária.",
  "Estudar 20 minutos todos os dias supera estudar 5 horas em apenas um dia.",
  "A revisão de hoje é o conhecimento inabalável de amanhã.",
  "Grandes aprovações são construídas em pequenas sessões diárias de foco.",
  "O aprendizado espaçado fixa o conhecimento na sua memória de longo prazo.",
  "Mantenha o fogo aceso: seu streak é a prova do seu compromisso!",
  "Conhecimento acumulado com disciplina é o melhor investimento do seu tempo."
];

// Initial Seed Demo Data if platform is first opened
const DEFAULT_INITIAL_STATE = {
  subjects: [
    {
      id: 'sub_1',
      name: 'Matemática',
      color: '#6366f1',
      mode: 'detailed', // 'simple' or 'detailed'
      status: 'active', // 'active' or 'paused'
      topics: [
        { id: 'top_1', title: 'Frações e Porcentagem', completed: false, lastStudied: null },
        { id: 'top_2', title: 'Equações do 2º Grau', completed: false, lastStudied: null },
        { id: 'top_3', title: 'Trigonometria no Triângulo Retângulo', completed: false, lastStudied: null },
        { id: 'top_4', title: 'Funções Exponenciais e Logaritmos', completed: false, lastStudied: null }
      ],
      currentTopicIndex: 0
    },
    {
      id: 'sub_2',
      name: 'Português & Redação',
      color: '#8b5cf6',
      mode: 'detailed',
      status: 'active',
      topics: [
        { id: 'top_5', title: 'Sintaxe da Oração e Período', completed: false, lastStudied: null },
        { id: 'top_6', title: 'Concordância Verbal e Nominal', completed: false, lastStudied: null },
        { id: 'top_7', title: 'Crase e Regência', completed: false, lastStudied: null },
        { id: 'top_8', title: 'Estrutura da Redação Dissertativa', completed: false, lastStudied: null }
      ],
      currentTopicIndex: 0
    },
    {
      id: 'sub_3',
      name: 'História Geral',
      color: '#06b6d4',
      mode: 'simple',
      status: 'active',
      topics: [],
      currentTopicIndex: 0
    },
    {
      id: 'sub_4',
      name: 'Física',
      color: '#f59e0b',
      mode: 'detailed',
      status: 'active',
      topics: [
        { id: 'top_9', title: 'Cinemática Escalar', completed: false, lastStudied: null },
        { id: 'top_10', title: 'Leis de Newton e Dinâmica', completed: false, lastStudied: null },
        { id: 'top_11', title: 'Trabalho e Energia', completed: false, lastStudied: null }
      ],
      currentTopicIndex: 0
    }
  ],
  schedule: {
    maxPerDay: 2,
    days: {
      0: ['sub_1', 'sub_3'], // Segunda
      1: ['sub_2', 'sub_4'], // Terça
      2: ['sub_1', 'sub_2'], // Quarta
      3: ['sub_3', 'sub_4'], // Quinta
      4: ['sub_1', 'sub_4'], // Sexta
      5: ['sub_2'],          // Sábado
      6: []                  // Domingo
    }
  },
  reviews: [],
  studyLogs: [],
  userStats: {
    currentStreak: 0,
    bestStreak: 0,
    lastStudyDate: null,
    totalMinutesStudied: 0,
    nightReviewTime: '22:00' // Horário noturno padrão a partir das 22h
  },
  achievements: [
    { id: 'ach_1', name: 'Primeira Jornada', desc: 'Conclua seu primeiro dia de estudos', icon: '🚀', unlockedAt: null },
    { id: 'ach_2', name: 'Semana Imparável', desc: 'Alcance um streak de 7 dias seguidos', icon: '🔥', unlockedAt: null },
    { id: 'ach_3', name: 'Mestre da Retenção', desc: 'Realize 15 revisões espaçadas', icon: '🧠', unlockedAt: null },
    { id: 'ach_4', name: 'Foco Noturno', desc: 'Conclua uma revisão após as 22:00', icon: '🌙', unlockedAt: null },
    { id: 'ach_5', name: 'Lenda dos 30 Dias', desc: 'Manter 30 dias de sequência ininterrupta', icon: '🏆', unlockedAt: null }
  ]
};

class Store {
  constructor() {
    this.state = this.loadState();
    this.checkpoints = this.loadCheckpoints();
    this.listeners = [];
    
    // Auto-create initial checkpoint if none exists
    if (this.checkpoints.length === 0) {
      this.createCheckpoint('Estado Inicial Padrão');
    }
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveState();
    this.listeners.forEach(l => l(this.state));
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Erro ao carregar estado do LocalStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Erro ao salvar no LocalStorage:', e);
    }
  }

  // CHECKPOINTS SYSTEM
  loadCheckpoints() {
    try {
      const raw = localStorage.getItem(CHECKPOINTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Erro ao carregar checkpoints:', e);
    }
    return [];
  }

  saveCheckpoints() {
    try {
      localStorage.setItem(CHECKPOINTS_KEY, JSON.stringify(this.checkpoints));
    } catch (e) {
      console.error('Erro ao salvar checkpoints:', e);
    }
  }

  createCheckpoint(label = 'Checkpoint Automático') {
    const snapshot = {
      id: 'chk_' + Date.now(),
      timestamp: new Date().toISOString(),
      label: label,
      data: JSON.parse(JSON.stringify(this.state))
    };
    // Keep maximum 15 checkpoints
    this.checkpoints.unshift(snapshot);
    if (this.checkpoints.length > 15) {
      this.checkpoints.pop();
    }
    this.saveCheckpoints();
    return snapshot;
  }

  restoreCheckpoint(checkpointId) {
    const target = this.checkpoints.find(c => c.id === checkpointId);
    if (target) {
      // Create auto safety checkpoint before restoring
      this.createCheckpoint('Ponto de Segurança Antes da Restauração');
      this.state = JSON.parse(JSON.stringify(target.data));
      this.notify();
      return true;
    }
    return false;
  }

  deleteCheckpoint(checkpointId) {
    this.checkpoints = this.checkpoints.filter(c => c.id !== checkpointId);
    this.saveCheckpoints();
  }

  // EXPORT / IMPORT STUDY PLAN
  exportStudyPlanJSON() {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      subjects: this.state.subjects,
      schedule: this.state.schedule,
      userStats: {
        nightReviewTime: this.state.userStats.nightReviewTime
      }
    };
    return JSON.stringify(exportData, null, 2);
  }

  importStudyPlanJSON(jsonString, mode = 'replace') { // 'replace' or 'merge'
    try {
      const data = JSON.parse(jsonString);
      if (!data.subjects || !Array.isArray(data.subjects)) {
        throw new Error('Formato de Plano de Estudo inválido.');
      }
      
      this.createCheckpoint('Backup Antes da Importação');

      if (mode === 'replace') {
        this.state.subjects = data.subjects;
        if (data.schedule) this.state.schedule = data.schedule;
        if (data.userStats?.nightReviewTime) {
          this.state.userStats.nightReviewTime = data.userStats.nightReviewTime;
        }
      } else if (mode === 'merge') {
        // Merge subjects
        data.subjects.forEach(sub => {
          const existing = this.state.subjects.find(s => s.id === sub.id || s.name.toLowerCase() === sub.name.toLowerCase());
          if (!existing) {
            this.state.subjects.push(sub);
          }
        });
      }

      this.notify();
      return true;
    } catch (e) {
      console.error('Falha ao importar JSON:', e);
      throw e;
    }
  }

  // SUBJECT MANAGEMENT
  addSubject(subjectData) {
    this.createCheckpoint(`Adicionada matéria ${subjectData.name}`);
    const newSubject = {
      id: 'sub_' + Date.now(),
      name: subjectData.name,
      color: subjectData.color || '#6366f1',
      mode: subjectData.mode || 'simple',
      status: 'active',
      topics: subjectData.topics || [],
      currentTopicIndex: 0
    };
    this.state.subjects.push(newSubject);
    this.notify();
    return newSubject;
  }

  updateSubject(id, updatedData) {
    const index = this.state.subjects.findIndex(s => s.id === id);
    if (index !== -1) {
      this.state.subjects[index] = { ...this.state.subjects[index], ...updatedData };
      this.notify();
    }
  }

  togglePauseSubject(id) {
    const sub = this.state.subjects.find(s => s.id === id);
    if (sub) {
      sub.status = sub.status === 'active' ? 'paused' : 'active';
      this.notify();
    }
  }

  deleteSubject(id) {
    this.createCheckpoint('Exclusão de matéria');
    this.state.subjects = this.state.subjects.filter(s => s.id !== id);
    // Remove from schedule
    Object.keys(this.state.schedule.days).forEach(day => {
      this.state.schedule.days[day] = this.state.schedule.days[day].filter(subId => subId !== id);
    });
    this.notify();
  }

  // TOPICS MANAGEMENT
  addTopicToSubject(subjectId, topicTitle) {
    const sub = this.state.subjects.find(s => s.id === subjectId);
    if (sub) {
      sub.topics.push({
        id: 'top_' + Date.now(),
        title: topicTitle,
        completed: false,
        lastStudied: null
      });
      this.notify();
    }
  }

  reorderTopics(subjectId, fromIndex, toIndex) {
    const sub = this.state.subjects.find(s => s.id === subjectId);
    if (sub && sub.topics) {
      const [moved] = sub.topics.splice(fromIndex, 1);
      sub.topics.splice(toIndex, 0, moved);
      this.notify();
    }
  }

  // WEEKLY SCHEDULE & AUTO DRAW
  updateSchedule(newDays, maxPerDay) {
    this.createCheckpoint('Alteração de Grade Semanal');
    this.state.schedule.days = newDays;
    if (maxPerDay) this.state.schedule.maxPerDay = parseInt(maxPerDay);
    this.notify();
  }

  autoDrawSchedule() {
    this.createCheckpoint('Sorteio Automático da Grade');
    const activeSubjects = this.state.subjects.filter(s => s.status === 'active');
    const max = this.state.schedule.maxPerDay || 2;
    const newDays = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    
    if (activeSubjects.length === 0) return;

    let pool = [...activeSubjects.map(s => s.id)];
    
    // Distribute shuffle
    for (let day = 0; day < 7; day++) {
      if (pool.length === 0) {
        pool = [...activeSubjects.map(s => s.id)];
      }
      // Shuffle pool
      pool.sort(() => Math.random() - 0.5);
      
      const count = Math.min(max, pool.length);
      for (let i = 0; i < count; i++) {
        newDays[day].push(pool.pop());
      }
    }
    
    this.state.schedule.days = newDays;
    this.notify();
  }

  // STUDY COMPLETION & SPACED REPETITION SCHEDULER
  completeStudy(subjectId, durationMinutes = 30) {
    const todayStr = new Date().toISOString().split('T')[0];
    const sub = this.state.subjects.find(s => s.id === subjectId);
    if (!sub) return;

    let topicTitle = 'Estudo Geral';

    if (sub.mode === 'detailed' && sub.topics && sub.topics.length > 0) {
      // Pick current topic in sequential order
      let topicObj = sub.topics[sub.currentTopicIndex] || sub.topics.find(t => !t.completed) || sub.topics[0];
      topicTitle = topicObj.title;
      topicObj.completed = true;
      topicObj.lastStudied = todayStr;

      // Advance index for next time
      sub.currentTopicIndex = (sub.currentTopicIndex + 1) % sub.topics.length;
    }

    // Log study
    this.state.studyLogs.push({
      id: 'log_' + Date.now(),
      date: todayStr,
      subjectId: subjectId,
      topicTitle: topicTitle,
      durationMinutes: parseInt(durationMinutes),
      completedAt: new Date().toISOString()
    });

    // Schedule Spaced Repetitions (3, 7, 15, 21 days after today)
    const intervals = [3, 7, 15, 21];
    const nightTime = this.state.userStats.nightReviewTime || '22:00';

    intervals.forEach(days => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + days);
      const dueDateStr = dueDate.toISOString().split('T')[0];

      this.state.reviews.push({
        id: 'rev_' + Date.now() + '_' + days,
        subjectId: subjectId,
        topicTitle: topicTitle,
        originalDate: todayStr,
        dueDate: dueDateStr,
        scheduledTime: nightTime,
        intervalDays: days,
        status: 'pending' // 'pending', 'completed', 'postponed', 'missed'
      });
    });

    // Update Streak and Stats
    this.updateStreakAndStats(todayStr, parseInt(durationMinutes));
    this.checkAchievements();
    this.notify();
  }

  // REVIEW ACTIONS
  completeReview(reviewId) {
    const rev = this.state.reviews.find(r => r.id === reviewId);
    if (rev) {
      rev.status = 'completed';
      rev.completedAt = new Date().toISOString();
      const todayStr = new Date().toISOString().split('T')[0];
      this.updateStreakAndStats(todayStr, 15); // Add 15 mins for review
      this.checkAchievements();
      this.notify();
    }
  }

  postponeReview(reviewId) {
    const rev = this.state.reviews.find(r => r.id === reviewId);
    if (rev) {
      const nextDate = new Date(rev.dueDate);
      nextDate.setDate(nextDate.getDate() + 1);
      rev.dueDate = nextDate.toISOString().split('T')[0];
      rev.status = 'postponed';
      this.notify();
    }
  }

  markReviewMissed(reviewId) {
    const rev = this.state.reviews.find(r => r.id === reviewId);
    if (rev) {
      rev.status = 'missed';
      this.notify();
    }
  }

  // STREAK & ACHIEVEMENTS ENGINE
  updateStreakAndStats(todayStr, minutesAdded) {
    const stats = this.state.userStats;
    stats.totalMinutesStudied = (stats.totalMinutesStudied || 0) + minutesAdded;

    if (!stats.lastStudyDate) {
      stats.currentStreak = 1;
      stats.lastStudyDate = todayStr;
    } else {
      const last = new Date(stats.lastStudyDate);
      const today = new Date(todayStr);
      const diffTime = Math.abs(today - last);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day!
        stats.currentStreak += 1;
        stats.lastStudyDate = todayStr;
      } else if (diffDays === 0) {
        // Same day, streak stays current
      } else {
        // Streak broken
        stats.currentStreak = 1;
        stats.lastStudyDate = todayStr;
      }
    }

    if (stats.currentStreak > (stats.bestStreak || 0)) {
      stats.bestStreak = stats.currentStreak;
    }
  }

  checkAchievements() {
    const stats = this.state.userStats;
    const completedLogs = this.state.studyLogs.length;
    const completedReviews = this.state.reviews.filter(r => r.status === 'completed').length;
    const today = new Date();
    const currentHour = today.getHours();

    this.state.achievements.forEach(ach => {
      if (!ach.unlockedAt) {
        let unlock = false;
        if (ach.id === 'ach_1' && completedLogs >= 1) unlock = true;
        if (ach.id === 'ach_2' && stats.currentStreak >= 7) unlock = true;
        if (ach.id === 'ach_3' && completedReviews >= 15) unlock = true;
        if (ach.id === 'ach_4' && currentHour >= 22 && completedReviews >= 1) unlock = true;
        if (ach.id === 'ach_5' && stats.currentStreak >= 30) unlock = true;

        if (unlock) {
          ach.unlockedAt = new Date().toISOString();
        }
      }
    });
  }

  // GETTERS & HELPERS
  getRandomQuote() {
    const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[idx];
  }

  isStreakAtRisk() {
    const todayStr = new Date().toISOString().split('T')[0];
    const stats = this.state.userStats;
    if (stats.currentStreak > 0 && stats.lastStudyDate !== todayStr) {
      return true; // Streak not yet maintained today!
    }
    return false;
  }
}

export const store = new Store();
