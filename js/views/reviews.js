/* ==========================================================================
   ESTUDOFLUX - SPACED REPETITION REVIEWS VIEW
   ========================================================================== */

import { store } from '../store.js';

export function renderReviewsView(container) {
  const state = store.state;
  const reviews = state.reviews;
  const todayStr = new Date().toISOString().split('T')[0];

  // Grouping reviews by Due Date
  const groupedReviews = {};
  reviews.forEach(rev => {
    if (!groupedReviews[rev.dueDate]) {
      groupedReviews[rev.dueDate] = [];
    }
    groupedReviews[rev.dueDate].push(rev);
  });

  const sortedDates = Object.keys(groupedReviews).sort();

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <h1>Sistema de Revisão Espaçada (3, 7, 15 e 21 dias)</h1>
        <p>Acompanhe e gerencie todas as suas revisões agendadas para o período noturno.</p>
      </div>

      <div class="view-actions">
        <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-secondary); padding: 0.4rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <label style="font-size: 0.85rem; font-weight: 600;">🌙 Horário Noturno:</label>
          <input type="time" id="input-night-time" value="${state.userStats.nightReviewTime || '22:00'}" class="form-control" style="width: auto; padding: 0.2rem 0.5rem;" />
        </div>
      </div>
    </div>

    <div class="view-content">
      <div class="card" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(99, 102, 241, 0.1)); border-color: rgba(168, 85, 247, 0.3);">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="font-size: 2.5rem;">🧠</div>
          <div>
            <h3 style="font-weight: 700; font-size: 1.05rem;">Como Funciona o Algoritmo Espaçado?</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">
              Ao estudar qualquer assunto, a plataforma agenda automaticamente 4 revisões futuras: nos intervalos de <strong>3, 7, 15 e 21 dias</strong> a partir das <strong>${state.userStats.nightReviewTime || '22:00'}</strong>. Isso garante retenção de até 90% do conteúdo no longo prazo.
            </p>
          </div>
        </div>
      </div>

      ${sortedDates.length === 0 ? `
        <div class="card" style="text-align: center; padding: 3rem;">
          <p style="color: var(--text-secondary);">Nenhuma revisão agendada no momento. Conclua uma matéria no Dashboard para gerar suas primeiras revisões espaçadas!</p>
        </div>
      ` : sortedDates.map(dateStr => {
        const isToday = dateStr === todayStr;
        const isOverdue = dateStr < todayStr;
        const dayRevList = groupedReviews[dateStr];
        const pendingCount = dayRevList.filter(r => r.status === 'pending').length;

        const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
          weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        });

        return `
          <div class="card" style="margin-bottom: 1.25rem; ${isToday ? 'border-color: var(--accent-night); background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(168,85,247,0.1));' : ''}">
            <div class="card-header">
              <h3 class="card-title">
                ${isToday ? '🌙 Hoje' : (isOverdue ? '⚠️ Atrasada' : '📅')} - ${formattedDate}
              </h3>
              <span class="day-badge" style="${isToday ? 'background: var(--accent-night); color: #fff;' : ''}">${pendingCount} pendente(s) / ${dayRevList.length} total</span>
            </div>

            <div class="card-body">
              ${dayRevList.map(rev => {
                const sub = state.subjects.find(s => s.id === rev.subjectId);
                const subName = sub ? sub.name : 'Matéria Excluída';
                const subColor = sub ? sub.color : 'var(--accent-primary)';
                const isCompleted = rev.status === 'completed';
                const isPostponed = rev.status === 'postponed';

                return `
                  <div class="review-item ${isCompleted ? 'review-status-completed' : ''}" style="border-left: 4px solid ${subColor};">
                    <div>
                      <div style="font-weight: 700; font-size: 0.95rem;">
                        <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${subColor};"></span>
                        ${subName}
                      </div>
                      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">${rev.topicTitle}</div>
                      <div style="font-size: 0.75rem; color: var(--accent-night); font-weight: 600; margin-top: 0.3rem;">
                        Intervalo: +${rev.intervalDays} dias | Agendada para: ${rev.scheduledTime || '22:00'} ${isPostponed ? '(Adiada)' : ''}
                      </div>
                    </div>

                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                      ${isCompleted ? `
                        <span style="color: var(--accent-success); font-weight: 700; font-size: 0.85rem;">✓ Concluída</span>
                      ` : `
                        <button class="btn btn-primary btn-sm btn-complete-rev" data-id="${rev.id}">✓ Concluir</button>
                        <button class="btn btn-secondary btn-sm btn-postpone-rev" data-id="${rev.id}">+1d Adiar</button>
                      `}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // EVENT LISTENERS
  const nightTimeInput = container.querySelector('#input-night-time');
  nightTimeInput.addEventListener('change', (e) => {
    store.state.userStats.nightReviewTime = e.target.value;
    store.saveState();
    window.showToast(`Horário de revisão atualizado para ${e.target.value}`, 'info');
    renderReviewsView(container);
  });

  container.querySelectorAll('.btn-complete-rev').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      store.completeReview(id);
      window.showToast('Revisão marcada como concluída!', 'success');
      renderReviewsView(container);
    });
  });

  container.querySelectorAll('.btn-postpone-rev').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      store.postponeReview(id);
      window.showToast('Revisão adiada para o próximo dia.', 'warning');
      renderReviewsView(container);
    });
  });
}
