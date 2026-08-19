/* ==========================================================================
   ESTUDOFLUX - CHECKPOINTS & STUDY PLAN MANAGEMENT VIEW
   ========================================================================== */

import { store } from '../store.js';

export function renderCheckpointsView(container) {
  const checkpoints = store.checkpoints;

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <h1>Checkpoints e Planos de Estudo</h1>
        <p>Pontos de restauração automáticos, exportação e importação de planos em formato JSON.</p>
      </div>

      <div class="view-actions">
        <button class="btn btn-primary" id="btn-create-manual-checkpoint">
          💾 Salvar Checkpoint Manual
        </button>
        <button class="btn btn-secondary" id="btn-export-plan">
          📥 Exportar Plano (JSON)
        </button>
        <button class="btn btn-outline" id="btn-import-plan-modal">
          📤 Importar Plano (JSON)
        </button>
      </div>
    </div>

    <div class="view-content">
      
      <!-- Checkpoints List -->
      <div class="card" style="margin-bottom: 2rem;">
        <div class="card-header">
          <h3 class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Histórico de Checkpoints da Plataforma
          </h3>
          <span class="day-badge">${checkpoints.length} salvo(s)</span>
        </div>

        <div class="card-body">
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
            A plataforma grava checkpoints automaticamente antes de mudanças estruturais (sorteios, alterações na grade, edições). Você pode restaurar qualquer ponto anterior instantaneamente.
          </p>

          ${checkpoints.length === 0 ? `
            <p style="text-align: center; color: var(--text-muted); padding: 2rem;">Nenhum checkpoint registrado.</p>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${checkpoints.map(chk => {
                const dateObj = new Date(chk.timestamp);
                const formattedDate = dateObj.toLocaleDateString('pt-BR', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                return `
                  <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
                    <div>
                      <div style="font-weight: 700; font-size: 0.95rem;">${chk.label}</div>
                      <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">
                        🕒 Salvo em: ${formattedDate} | Matérias: ${chk.data.subjects ? chk.data.subjects.length : 0}
                      </div>
                    </div>

                    <div style="display: flex; gap: 0.5rem;">
                      <button class="btn btn-primary btn-sm btn-restore-chk" data-id="${chk.id}">
                        🔄 Restaurar
                      </button>
                      <button class="btn btn-danger btn-sm btn-delete-chk" data-id="${chk.id}">
                        Excluir
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>

    </div>

    <!-- Modal Importar Plano -->
    <div class="modal-overlay" id="modal-import-plan">
      <div class="modal-card">
        <div class="modal-header">
          <h3 style="font-weight: 700;">Importar / Adicionar Plano de Estudo</h3>
          <button style="background:none; border:none; color:var(--text-primary); font-size:1.25rem; cursor:pointer;" id="btn-close-import-modal">&times;</button>
        </div>

        <form id="form-import-plan">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Cole o conteúdo JSON do Plano de Estudo:</label>
              <textarea id="textarea-import-json" class="form-control" placeholder='{"version":"1.0", "subjects": [...]}' required style="min-height: 140px; font-family: monospace; font-size: 0.8rem;"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Modo de Importação</label>
              <select id="select-import-mode" class="form-control">
                <option value="replace">Substituir Plano Atual Completo</option>
                <option value="merge">Mesclar Matérias ao Plano Existente</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-import-modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Importar Plano</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // EVENT LISTENERS
  const createManualBtn = container.querySelector('#btn-create-manual-checkpoint');
  createManualBtn.addEventListener('click', () => {
    const label = prompt('Digite uma descrição para o checkpoint:', 'Checkpoint Manual');
    if (label) {
      store.createCheckpoint(label);
      window.showToast('Checkpoint salvo com sucesso!', 'success');
      renderCheckpointsView(container);
    }
  });

  const exportBtn = container.querySelector('#btn-export-plan');
  exportBtn.addEventListener('click', () => {
    const jsonStr = store.exportStudyPlanJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano_de_estudos_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.showToast('Plano de estudos exportado para download!', 'success');
  });

  // Import Modal listeners
  const importModal = container.querySelector('#modal-import-plan');
  const openImportBtn = container.querySelector('#btn-import-plan-modal');
  const closeImportBtn = container.querySelector('#btn-close-import-modal');
  const cancelImportBtn = container.querySelector('#btn-cancel-import-modal');
  const importForm = container.querySelector('#form-import-plan');

  openImportBtn.addEventListener('click', () => importModal.classList.add('active'));
  closeImportBtn.addEventListener('click', () => importModal.classList.remove('active'));
  cancelImportBtn.addEventListener('click', () => importModal.classList.remove('active'));

  importForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const jsonText = container.querySelector('#textarea-import-json').value;
    const mode = container.querySelector('#select-import-mode').value;

    try {
      store.importStudyPlanJSON(jsonText, mode);
      window.showToast('Plano de estudos importado com sucesso!', 'success');
      importModal.classList.remove('active');
      renderCheckpointsView(container);
    } catch (err) {
      alert('Erro ao importar JSON. Verifique se a estrutura do arquivo está correta.');
    }
  });

  // Restore and Delete Checkpoints
  container.querySelectorAll('.btn-restore-chk').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Deseja restaurar a plataforma para este checkpoint?')) {
        if (store.restoreCheckpoint(id)) {
          window.showToast('Plataforma restaurada com sucesso!', 'success');
          renderCheckpointsView(container);
        }
      }
    });
  });

  container.querySelectorAll('.btn-delete-chk').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      store.deleteCheckpoint(id);
      renderCheckpointsView(container);
    });
  });
}
