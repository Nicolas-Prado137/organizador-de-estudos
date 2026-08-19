/* ==========================================================================
   ESTUDOFLUX - SUBJECTS & TOPICS MANAGEMENT VIEW
   ========================================================================== */

import { store } from '../store.js';

export function renderSubjectsView(container) {
  const state = store.state;

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <h1>Gestão de Matérias e Tópicos</h1>
        <p>Cadastre matérias no Modo Simples ou Detalhado (com sequência de tópicos reordenáveis).</p>
      </div>

      <div class="view-actions">
        <button class="btn btn-primary" id="btn-open-add-modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nova Matéria
        </button>
      </div>
    </div>

    <div class="view-content">
      <div class="subjects-grid">
        ${state.subjects.length === 0 ? `
          <div class="col-span-12 card" style="text-align: center; padding: 3rem;">
            <p>Nenhuma matéria cadastrada. Clique em "Nova Matéria" para começar!</p>
          </div>
        ` : state.subjects.map(sub => {
          const isPaused = sub.status === 'paused';
          const topicCount = sub.topics ? sub.topics.length : 0;
          const completedTopicsCount = sub.topics ? sub.topics.filter(t => t.completed).length : 0;

          return `
            <div class="subject-manage-card" style="--subject-color: ${sub.color}; ${isPaused ? 'opacity: 0.6;' : ''}">
              <div>
                <div class="subject-manage-header">
                  <h3 style="font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="display:inline-block; width:14px; height:14px; border-radius:50%; background-color:${sub.color};"></span>
                    ${sub.name}
                  </h3>
                  <span class="subject-mode-tag ${sub.mode === 'simple' ? 'tag-simple' : 'tag-detailed'}">
                    ${sub.mode === 'simple' ? 'Modo Simples' : 'Modo Detalhado'}
                  </span>
                </div>

                ${isPaused ? `
                  <div style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; padding: 0.25rem 0.6rem; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; margin-bottom: 0.75rem; display: inline-block;">
                    ⏸️ Matéria Pausada
                  </div>
                ` : ''}

                ${sub.mode === 'detailed' ? `
                  <div style="margin-top: 0.5rem; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.3rem;">
                      <span>Progresso de Assuntos</span>
                      <span>${completedTopicsCount}/${topicCount}</span>
                    </div>
                    <div style="width: 100%; height: 6px; background: var(--bg-input); border-radius: 3px; overflow: hidden;">
                      <div style="width: ${topicCount > 0 ? (completedTopicsCount/topicCount)*100 : 0}%; height: 100%; background: ${sub.color};"></div>
                    </div>
                  </div>

                  <div style="margin-bottom: 1rem;">
                    <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Lista de Assuntos (Sequencial):</label>
                    <ul style="list-style: none; margin-top: 0.4rem; max-height: 140px; overflow-y: auto;">
                      ${sub.topics && sub.topics.length > 0 ? sub.topics.map((t, idx) => `
                        <li style="font-size: 0.825rem; padding: 0.25rem 0; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-color);">
                          <span style="${t.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                            ${idx === sub.currentTopicIndex ? '👉 ' : ''}${t.title}
                          </span>
                          <div style="display: flex; gap: 0.2rem;">
                            ${idx > 0 ? `<button class="btn-move-topic" data-subid="${sub.id}" data-idx="${idx}" data-dir="up" style="border:none; background:none; color:var(--text-secondary); cursor:pointer;">▲</button>` : ''}
                            ${idx < sub.topics.length - 1 ? `<button class="btn-move-topic" data-subid="${sub.id}" data-idx="${idx}" data-dir="down" style="border:none; background:none; color:var(--text-secondary); cursor:pointer;">▼</button>` : ''}
                          </div>
                        </li>
                      `).join('') : '<li style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">Nenhum assunto cadastrado ainda.</li>'}
                    </ul>
                  </div>
                ` : `
                  <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">Estudo livre do conteúdo geral da matéria.</p>
                `}
              </div>

              <div style="display: flex; justify-content: space-between; gap: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
                <button class="btn btn-secondary btn-sm btn-toggle-pause" data-id="${sub.id}">
                  ${isPaused ? '▶️ Reativar' : '⏸️ Pausar'}
                </button>
                <div style="display: flex; gap: 0.35rem;">
                  ${sub.mode === 'detailed' ? `
                    <button class="btn btn-outline btn-sm btn-add-topic" data-id="${sub.id}">+ Assunto</button>
                  ` : ''}
                  <button class="btn btn-danger btn-sm btn-delete-sub" data-id="${sub.id}">Excluir</button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Modal Adicionar Matéria -->
    <div class="modal-overlay" id="modal-add-subject">
      <div class="modal-card">
        <div class="modal-header">
          <h3 style="font-weight: 700;">Cadastrar Nova Matéria</h3>
          <button style="background:none; border:none; color:var(--text-primary); font-size:1.25rem; cursor:pointer;" id="btn-close-modal">&times;</button>
        </div>

        <form id="form-add-subject">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Nome da Matéria</label>
              <input type="text" id="input-sub-name" class="form-control" placeholder="ex: Matemática, Direito Constitucional..." required />
            </div>

            <div class="form-group">
              <label class="form-label">Cor de Identificação</label>
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <input type="color" id="input-sub-color" value="#6366f1" style="width: 50px; height: 38px; border: none; border-radius: var(--radius-sm); cursor: pointer;" />
                <span style="font-size: 0.85rem; color: var(--text-secondary);">Selecione a cor para destacar na grade</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Modo de Estudo</label>
              <select id="input-sub-mode" class="form-control">
                <option value="simple">Modo Simples (Apenas o nome da matéria)</option>
                <option value="detailed">Modo Detalhado (Nome + Lista de assuntos/tópicos)</option>
              </select>
            </div>

            <div class="form-group" id="group-initial-topics" style="display: none;">
              <label class="form-label">Assuntos / Tópicos (um por linha)</label>
              <textarea id="input-sub-topics" class="form-control" placeholder="Frações&#10;Equações do 2º Grau&#10;Trigonometria"></textarea>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Cada dia de estudo trará automaticamente o próximo assunto da lista.</span>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar Matéria</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // EVENT LISTENERS
  const modal = container.querySelector('#modal-add-subject');
  const openModalBtn = container.querySelector('#btn-open-add-modal');
  const closeModalBtn = container.querySelector('#btn-close-modal');
  const cancelModalBtn = container.querySelector('#btn-cancel-modal');
  const modeSelect = container.querySelector('#input-sub-mode');
  const initialTopicsGroup = container.querySelector('#group-initial-topics');
  const addForm = container.querySelector('#form-add-subject');

  openModalBtn.addEventListener('click', () => modal.classList.add('active'));
  closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
  cancelModalBtn.addEventListener('click', () => modal.classList.remove('active'));

  modeSelect.addEventListener('change', (e) => {
    if (e.target.value === 'detailed') {
      initialTopicsGroup.style.display = 'block';
    } else {
      initialTopicsGroup.style.display = 'none';
    }
  });

  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = container.querySelector('#input-sub-name').value.trim();
    const color = container.querySelector('#input-sub-color').value;
    const mode = modeSelect.value;
    const topicsRaw = container.querySelector('#input-sub-topics').value;

    let topics = [];
    if (mode === 'detailed' && topicsRaw) {
      topics = topicsRaw.split('\n').filter(t => t.trim() !== '').map(t => ({
        id: 'top_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        title: t.trim(),
        completed: false,
        lastStudied: null
      }));
    }

    store.addSubject({ name, color, mode, topics });
    window.showToast('Matéria cadastrada com sucesso!', 'success');
    modal.classList.remove('active');
    renderSubjectsView(container);
  });

  // Action listeners for cards
  container.querySelectorAll('.btn-toggle-pause').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      store.togglePauseSubject(id);
      renderSubjectsView(container);
    });
  });

  container.querySelectorAll('.btn-delete-sub').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Deseja realmente excluir esta matéria?')) {
        store.deleteSubject(id);
        window.showToast('Matéria removida.', 'info');
        renderSubjectsView(container);
      }
    });
  });

  container.querySelectorAll('.btn-add-topic').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const topicTitle = prompt('Digite o nome do novo assunto:');
      if (topicTitle && topicTitle.trim() !== '') {
        store.addTopicToSubject(id, topicTitle.trim());
        window.showToast('Assunto adicionado!', 'success');
        renderSubjectsView(container);
      }
    });
  });

  container.querySelectorAll('.btn-move-topic').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const subId = e.currentTarget.getAttribute('data-subid');
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
      const dir = e.currentTarget.getAttribute('data-dir');
      const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
      store.reorderTopics(subId, idx, targetIdx);
      renderSubjectsView(container);
    });
  });
}
