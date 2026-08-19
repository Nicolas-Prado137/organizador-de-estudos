/* ==========================================================================
   ESTUDOFLUX - DASHBOARD VIEW
   ========================================================================== */

import { store } from '../store.js';

export function renderDashboardView(container) {
  const state = store.state;
  const today = new Date();
  // Sunday is 0 in JS, map Monday=0 to Sunday=6 for Brazilian weekly layout
  const dayOfWeek = (today.getDay() + 6) % 7; 
  const todayStr = today.toISOString().split('T')[0];

  // Get subjects scheduled for today
  const todaySubjectIds = state.schedule.days[dayOfWeek] || [];
  const todaySubjects = todaySubjectIds
    .map(id => state.subjects.find(s => s.id === id))
    .filter(s => s && s.status === 'active');

  // Today's Spaced Reviews (due today or overdue)
  const pendingReviews = state.reviews.filter(r => r.dueDate <= todayStr && r.status !== 'completed');

  // Check if study already done today
  const hasStudiedToday = state.userStats.lastStudyDate === todayStr;
  const quote = store.getRandomQuote();

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <h1>Dashboard Principal</h1>
        <p>Visão geral dos estudos e revisões noturnas de hoje (${today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })})</p>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary" id="btn-quick-study">
          <i data-lucide="play-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
          </i>
          Iniciar Sessão
        </button>
      </div>
    </div>

    <div class="view-content">
      <div class="dashboard-grid">
        
        <!-- Motivational Banner & Streak Metrics -->
        <div class="card motivation-banner col-span-12">
          <div class="card-body">
            <div class="motivation-quote">"${quote}"</div>
            
            <div class="streak-metrics">
              <div class="streak-box">
                <div class="streak-icon-flame">🔥</div>
                <div>
                  <div class="streak-num">${state.userStats.currentStreak || 0} dias</div>
                  <div class="streak-label">Sequência Atual (Streak)</div>
                </div>
              </div>

              <div class="streak-box">
                <div class="streak-icon-flame" style="filter: hue-rotate(90deg);">🏆</div>
                <div>
                  <div class="streak-num" style="color: #10b981;">${state.userStats.bestStreak || 0} dias</div>
                  <div class="streak-label">Maior Recorde Alcançado</div>
                </div>
              </div>

              <div class="streak-box">
                <div class="streak-icon-flame" style="filter: hue-rotate(180deg);">⏱️</div>
                <div>
                  <div class="streak-num" style="color: #8b5cf6;">${Math.round((state.userStats.totalMinutesStudied || 0) / 60)}h</div>
                  <div class="streak-label">Horas Totais Estudadas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Today's Subjects Column -->
        <div class="col-span-7">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                Matérias do Dia
              </h2>
              <span class="day-badge">${todaySubjects.length} planejada(s)</span>
            </div>

            <div class="card-body">
              ${todaySubjects.length === 0 ? `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                  <p>Nenhuma matéria agendada para hoje na grade semanal.</p>
                  <button class="btn btn-secondary btn-sm" id="go-to-weekly" style="margin-top: 1rem;">Configurar Grade Semanal</button>
                </div>
              ` : todaySubjects.map(sub => {
                let nextTopicTitle = 'Modo Simples (Estudo livre/geral)';
                if (sub.mode === 'detailed' && sub.topics && sub.topics.length > 0) {
                  const currentTopic = sub.topics[sub.currentTopicIndex] || sub.topics[0];
                  nextTopicTitle = `Assunto do dia: "${currentTopic.title}"`;
                }

                return `
                  <div class="subject-item-card" style="--subject-color: ${sub.color};">
                    <div class="subject-info">
                      <h3>
                        <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background-color:${sub.color};"></span>
                        ${sub.name}
                      </h3>
                      <div class="topic-badge">
                        <span>📖 ${nextTopicTitle}</span>
                      </div>
                    </div>

                    <button class="btn btn-primary btn-sm btn-complete-study" data-id="${sub.id}">
                      ✓ Concluir
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Night Spaced Reviews Column -->
        <div class="col-span-5">
          <div class="card night-reviews-card">
            <div class="card-header">
              <h2 class="card-title">
                <span class="night-badge">🌙 A partir das ${state.userStats.nightReviewTime || '22:00'}</span>
                Revisões de Hoje
              </h2>
              <span class="day-badge">${pendingReviews.length} pendente(s)</span>
            </div>

            <div class="card-body">
              ${pendingReviews.length === 0 ? `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                  <p>🎉 Nenhuma revisão pendente para esta noite!</p>
                  <p style="font-size: 0.8rem; margin-top: 0.5rem; color: var(--text-muted);">As revisões futuras surgem automaticamente nos dias 3, 7, 15 e 21 após estudar.</p>
                </div>
              ` : pendingReviews.map(rev => {
                const sub = state.subjects.find(s => s.id === rev.subjectId);
                const subName = sub ? sub.name : 'Matéria';
                const subColor = sub ? sub.color : 'var(--accent-primary)';

                return `
                  <div class="review-item" style="border-left: 3px solid ${subColor};">
                    <div>
                      <div style="font-weight: 700; font-size: 0.9rem;">${subName}</div>
                      <div style="font-size: 0.8rem; color: var(--text-secondary);">${rev.topicTitle}</div>
                      <div style="font-size: 0.75rem; color: var(--accent-night); font-weight: 600; margin-top: 0.2rem;">
                        Intervalo: ${rev.intervalDays} dias (Prevista: ${rev.scheduledTime})
                      </div>
                    </div>

                    <div style="display: flex; gap: 0.35rem;">
                      <button class="btn btn-primary btn-sm btn-complete-review" data-id="${rev.id}" title="Concluir Revisão">✓</button>
                      <button class="btn btn-secondary btn-sm btn-postpone-review" data-id="${rev.id}" title="Adiar +1 Dia">+1d</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  // Attach Event Listeners
  const completeButtons = container.querySelectorAll('.btn-complete-study');
  completeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const subjectId = e.currentTarget.getAttribute('data-id');
      store.completeStudy(subjectId, 45); // 45 minutes study session default
      window.showToast('Estudo concluído com sucesso! 4 revisões futuras foram agendadas para as 22h (dias 3, 7, 15 e 21).', 'success');
      renderDashboardView(container);
    });
  });

  const completeReviewButtons = container.querySelectorAll('.btn-complete-review');
  completeReviewButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const revId = e.currentTarget.getAttribute('data-id');
      store.completeReview(revId);
      window.showToast('Revisão marcada como concluída! Memória de longo prazo fortalecida.', 'success');
      renderDashboardView(container);
    });
  });

  const postponeReviewButtons = container.querySelectorAll('.btn-postpone-review');
  postponeReviewButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const revId = e.currentTarget.getAttribute('data-id');
      store.postponeReview(revId);
      window.showToast('Revisão adiada para amanhã.', 'warning');
      renderDashboardView(container);
    });
  });

  const quickStudyBtn = container.querySelector('#btn-quick-study');
  if (quickStudyBtn) {
    quickStudyBtn.addEventListener('click', () => {
      if (todaySubjects.length > 0) {
        store.completeStudy(todaySubjects[0].id, 45);
        window.showToast(`Sessão de ${todaySubjects[0].name} concluída! Revisões agendadas.`, 'success');
        renderDashboardView(container);
      } else {
        window.showToast('Cadastre ou configure matérias na grade semanal para iniciar.', 'warning');
      }
    });
  }

  const goToWeekly = container.querySelector('#go-to-weekly');
  if (goToWeekly) {
    goToWeekly.addEventListener('click', () => {
      document.querySelector('[data-view="weekly"]')?.click();
    });
  }
}
