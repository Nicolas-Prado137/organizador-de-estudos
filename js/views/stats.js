/* ==========================================================================
   ESTUDOFLUX - STATISTICS & ACHIEVEMENTS VIEW (WITH HEATMAP)
   ========================================================================== */

import { store } from '../store.js';

export function renderStatsView(container) {
  const state = store.state;
  const logs = state.studyLogs || [];
  const reviews = state.reviews || [];
  const achievements = state.achievements || [];

  // Generate GitHub-style Heatmap for the past 16 weeks (112 days)
  const heatmapCells = [];
  const today = new Date();
  
  // Count study occurrences per date
  const activityByDate = {};
  logs.forEach(log => {
    activityByDate[log.date] = (activityByDate[log.date] || 0) + 1;
  });
  reviews.filter(r => r.status === 'completed').forEach(rev => {
    const revDate = rev.completedAt ? rev.completedAt.split('T')[0] : rev.dueDate;
    activityByDate[revDate] = (activityByDate[revDate] || 0) + 1;
  });

  // Calculate 16 weeks back
  for (let i = 111; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = activityByDate[dateStr] || 0;

    let level = 0;
    if (count === 1) level = 1;
    else if (count === 2) level = 2;
    else if (count === 3) level = 3;
    else if (count >= 4) level = 4;

    heatmapCells.push({ date: dateStr, count, level });
  }

  // Subject completion distribution
  const subjectStats = {};
  logs.forEach(log => {
    const sub = state.subjects.find(s => s.id === log.subjectId);
    const name = sub ? sub.name : 'Matéria';
    subjectStats[name] = (subjectStats[name] || 0) + 1;
  });

  const totalReviewsCompleted = reviews.filter(r => r.status === 'completed').length;
  const totalReviewsMissed = reviews.filter(r => r.status === 'missed').length;
  const reviewSuccessRate = (totalReviewsCompleted + totalReviewsMissed) > 0 
    ? Math.round((totalReviewsCompleted / (totalReviewsCompleted + totalReviewsMissed)) * 100) 
    : 100;

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <h1>Estatísticas & Conquistas</h1>
        <p>Acompanhe o seu progresso no tempo, taxa de retenção e selos desbloqueados.</p>
      </div>
    </div>

    <div class="view-content">
      
      <!-- GitHub Style Heatmap -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header">
          <h3 class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Heatmap de Atividade Diária de Estudos
          </h3>
          <span class="day-badge">Últimos 112 dias</span>
        </div>

        <div class="card-body">
          <div class="heatmap-container">
            <div class="heatmap-grid">
              ${heatmapCells.map(cell => `
                <div class="heatmap-cell" data-level="${cell.level}" title="${cell.date}: ${cell.count} sessão(ões)"></div>
              `).join('')}
            </div>

            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.4rem; font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.75rem;">
              <span>Menos</span>
              <div class="heatmap-cell" data-level="0"></div>
              <div class="heatmap-cell" data-level="1"></div>
              <div class="heatmap-cell" data-level="2"></div>
              <div class="heatmap-cell" data-level="3"></div>
              <div class="heatmap-cell" data-level="4"></div>
              <span>Mais</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Summary -->
      <div class="dashboard-grid" style="margin-bottom: 1.5rem;">
        <div class="col-span-4 card">
          <div style="text-align: center;">
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--accent-primary);">${logs.length}</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">Sessões de Estudo Concluídas</div>
          </div>
        </div>

        <div class="col-span-4 card">
          <div style="text-align: center;">
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--accent-success);">${totalReviewsCompleted}</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">Revisões Espaçadas Realizadas</div>
          </div>
        </div>

        <div class="col-span-4 card">
          <div style="text-align: center;">
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--accent-warning);">${reviewSuccessRate}%</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">Taxa de Sucesso em Revisões</div>
          </div>
        </div>
      </div>

      <!-- Achievements & Badges Gallery -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            Galeria de Conquistas e Selos
          </h3>
        </div>

        <div class="card-body">
          <div class="badges-grid">
            ${achievements.map(ach => {
              const isUnlocked = !!ach.unlockedAt;
              return `
                <div class="badge-item ${isUnlocked ? '' : 'locked'}">
                  <div class="badge-icon">${ach.icon}</div>
                  <div class="badge-name">${ach.name}</div>
                  <div class="badge-desc">${ach.desc}</div>
                  ${isUnlocked ? `
                    <div style="font-size: 0.65rem; color: var(--accent-success); font-weight: 700; margin-top: 0.2rem;">
                      Desbloqueado!
                    </div>
                  ` : `
                    <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 0.2rem;">Bloqueado</div>
                  `}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

    </div>
  `;
}
