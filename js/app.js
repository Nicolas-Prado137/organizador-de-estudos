/* ==========================================================================
   ESTUDOFLUX - MAIN APPLICATION ROUTER & CONTROLLER
   ========================================================================== */

import { store } from './store.js';
import { renderDashboardView } from './views/dashboard.js';
import { renderWeeklyView } from './views/weekly.js';
import { renderSubjectsView } from './views/subjects.js';
import { renderReviewsView } from './views/reviews.js';
import { renderCheckpointsView } from './views/checkpoints.js';
import { renderStatsView } from './views/stats.js';

class App {
  constructor() {
    this.currentView = 'dashboard';
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupNavigation();
    this.setupGlobalToast();
    this.checkStreakAlert();
    this.render();

    // Subscribe to store updates
    store.subscribe(() => {
      this.checkStreakAlert();
    });
  }

  setupTheme() {
    const savedTheme = localStorage.getItem('estudoflux_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('estudoflux_theme', next);
        themeToggleBtn.querySelector('.theme-text').textContent = next === 'dark' ? 'Modo Escuro' : 'Modo Claro';
      });
    }
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll('[data-view]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const viewName = e.currentTarget.getAttribute('data-view');
        this.switchView(viewName);
      });
    });
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Update active nav button
    document.querySelectorAll('.nav-item').forEach(item => {
      const btn = item.querySelector('[data-view]');
      if (btn && btn.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    this.render();
  }

  checkStreakAlert() {
    const alertBar = document.getElementById('streak-alert-bar');
    if (!alertBar) return;

    if (store.isStreakAtRisk()) {
      alertBar.style.display = 'flex';
    } else {
      alertBar.style.display = 'none';
    }
  }

  setupGlobalToast() {
    window.showToast = (message, type = 'info') => {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <span>${type === 'success' ? '✅' : (type === 'warning' ? '⚠️' : 'ℹ️')}</span>
        <div>${message}</div>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    };
  }

  render() {
    const viewContainer = document.getElementById('main-content-view');
    if (!viewContainer) return;

    switch (this.currentView) {
      case 'dashboard':
        renderDashboardView(viewContainer);
        break;
      case 'weekly':
        renderWeeklyView(viewContainer);
        break;
      case 'subjects':
        renderSubjectsView(viewContainer);
        break;
      case 'reviews':
        renderReviewsView(viewContainer);
        break;
      case 'checkpoints':
        renderCheckpointsView(viewContainer);
        break;
      case 'stats':
        renderStatsView(viewContainer);
        break;
      default:
        renderDashboardView(viewContainer);
    }
  }
}

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
