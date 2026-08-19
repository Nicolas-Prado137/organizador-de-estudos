/* ==========================================================================
   ESTUDOFLUX - WEEKLY GRID & DISTRIBUTION VIEW
   ========================================================================== */

import { store } from '../store.js';

const DAY_NAMES = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

export function renderWeeklyView(container) {
  const state = store.state;
  const activeSubjects = state.subjects.filter(s => s.status === 'active');
  const maxPerDay = state.schedule.maxPerDay || 2;

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <h1>Grade Semanal de Estudos</h1>
        <p>Defina quantas matérias estudar por dia e escolha entre sorteio automático ou arranjo manual (Drag & Drop).</p>
      </div>

      <div class="view-actions">
        <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-secondary); padding: 0.4rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <label style="font-size: 0.85rem; font-weight: 600;">Máx. por dia:</label>
          <select id="select-max-per-day" class="form-control" style="width: auto; padding: 0.2rem 0.5rem;">
            <option value="1" ${maxPerDay === 1 ? 'selected' : ''}>1 matéria</option>
            <option value="2" ${maxPerDay === 2 ? 'selected' : ''}>2 matérias</option>
            <option value="3" ${maxPerDay === 3 ? 'selected' : ''}>3 matérias</option>
            <option value="4" ${maxPerDay === 4 ? 'selected' : ''}>4 matérias</option>
          </select>
        </div>

        <button class="btn btn-secondary" id="btn-auto-draw">
          🎲 Sorteio Automático
        </button>

        <button class="btn btn-outline" id="btn-reset-draw">
          🔄 Refazer Sorteio
        </button>
      </div>
    </div>

    <div class="view-content">
      <div class="card" style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="font-weight: 700; font-size: 1rem;">Matérias Disponíveis para Distribuição</h3>
            <p style="font-size: 0.825rem; color: var(--text-secondary);">Arraste as matérias abaixo para os dias desejados ou use o Sorteio Automático.</p>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${activeSubjects.map(sub => `
              <span class="draggable-subject-card" draggable="true" data-subid="${sub.id}" style="--subject-color: ${sub.color}; font-size: 0.8rem; padding: 0.35rem 0.75rem;">
                ${sub.name}
              </span>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="weekly-grid-container">
        ${DAY_NAMES.map((dayName, dayIndex) => {
          const daySubIds = state.schedule.days[dayIndex] || [];
          const daySubjects = daySubIds
            .map(id => state.subjects.find(s => s.id === id))
            .filter(s => s && s.status === 'active');

          return `
            <div class="day-column" data-dayindex="${dayIndex}">
              <div class="day-header">
                <span class="day-title">${dayName}</span>
                <span class="day-badge">${daySubjects.length}/${maxPerDay}</span>
              </div>

              <div class="day-subject-list" data-dayindex="${dayIndex}">
                ${daySubjects.map(sub => `
                  <div class="draggable-subject-card" draggable="true" data-subid="${sub.id}" data-dayindex="${dayIndex}" style="--subject-color: ${sub.color};">
                    <span>${sub.name}</span>
                    <button class="btn-remove-from-day" data-subid="${sub.id}" data-dayindex="${dayIndex}" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1rem;" title="Remover deste dia">&times;</button>
                  </div>
                `).join('')}
                
                ${daySubjects.length === 0 ? `
                  <div style="border: 2px dashed var(--border-color); border-radius: var(--radius-sm); height: 80px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.8rem; font-style: italic;">
                    Arraste uma matéria para cá
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // EVENT LISTENERS & DRAG AND DROP
  const maxSelect = container.querySelector('#select-max-per-day');
  maxSelect.addEventListener('change', (e) => {
    store.updateSchedule(state.schedule.days, parseInt(e.target.value));
    renderWeeklyView(container);
  });

  const autoDrawBtn = container.querySelector('#btn-auto-draw');
  autoDrawBtn.addEventListener('click', () => {
    store.autoDrawSchedule();
    window.showToast('Grade semanal sorteada com sucesso!', 'success');
    renderWeeklyView(container);
  });

  const resetDrawBtn = container.querySelector('#btn-reset-draw');
  resetDrawBtn.addEventListener('click', () => {
    store.autoDrawSchedule();
    window.showToast('Sorteio refeito e fixado!', 'info');
    renderWeeklyView(container);
  });

  // Remove subject from specific day
  container.querySelectorAll('.btn-remove-from-day').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const subId = e.currentTarget.getAttribute('data-subid');
      const dayIndex = parseInt(e.currentTarget.getAttribute('data-dayindex'));
      
      const newDays = { ...state.schedule.days };
      newDays[dayIndex] = newDays[dayIndex].filter(id => id !== subId);
      store.updateSchedule(newDays, state.schedule.maxPerDay);
      renderWeeklyView(container);
    });
  });

  // Setup HTML5 Drag and Drop
  let draggedSubId = null;

  container.querySelectorAll('.draggable-subject-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedSubId = e.currentTarget.getAttribute('data-subid');
      e.dataTransfer.setData('text/plain', draggedSubId);
      e.currentTarget.style.opacity = '0.5';
    });

    card.addEventListener('dragend', (e) => {
      e.currentTarget.style.opacity = '1';
      draggedSubId = null;
    });
  });

  container.querySelectorAll('.day-column').forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.classList.add('drag-over');
    });

    col.addEventListener('dragleave', () => {
      col.classList.remove('drag-over');
    });

    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      
      const dayIndex = parseInt(col.getAttribute('data-dayindex'));
      if (!draggedSubId) return;

      const newDays = { ...state.schedule.days };
      const currentList = newDays[dayIndex] || [];

      // Check limit
      if (currentList.length >= maxPerDay) {
        window.showToast(`Limite máximo de ${maxPerDay} matérias por dia atingido!`, 'warning');
        return;
      }

      if (!currentList.includes(draggedSubId)) {
        currentList.push(draggedSubId);
        newDays[dayIndex] = currentList;
        store.updateSchedule(newDays, state.schedule.maxPerDay);
        window.showToast('Matéria adicionada ao dia!', 'success');
        renderWeeklyView(container);
      }
    });
  });
}
