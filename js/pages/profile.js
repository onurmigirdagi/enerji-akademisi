import { signOut } from '../auth.js';
import { generateAnalysis, getLevelText } from '../quiz.js';
import { MODULES } from '../config.js';

// Load User Identity
const appUser = JSON.parse(localStorage.getItem('appUser'));
if (appUser && appUser.username) {
    document.getElementById('user-name').textContent = appUser.username;
}

// Logout Logic
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        console.log('Logout clicked');
        try {
            logoutBtn.textContent = 'Çıkış...';
            await signOut();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.clear(); // Aggressively clear everything (Supabase tokens + App Data)
            window.location.href = 'index.html';
        }
    });
}

const data = JSON.parse(localStorage.getItem('assessmentResults'));

if (!data) {
    document.getElementById('content').classList.add('hidden');
    document.getElementById('no-data').classList.remove('hidden');
} else {
    const { knowledge, behavior, totalScore, level } = data;

    const kPct = Math.round((knowledge / 13) * 100);
    const bPct = Math.round((behavior / 85) * 100);
    const tPct = Math.round((totalScore / 98) * 100);

    // Update stats
    document.getElementById('stat-knowledge').textContent = `${knowledge}/13`;
    document.getElementById('stat-behavior').textContent = `${behavior}/85`;
    document.getElementById('stat-total').textContent = `${totalScore}/98`;

    // Update level
    document.getElementById('level-text').textContent = getLevelText(level);

    // Animate progress bars
    setTimeout(() => {
        document.getElementById('prog-k-fill').style.width = `${kPct}%`;
        document.getElementById('prog-b-fill').style.width = `${bPct}%`;
        document.getElementById('prog-t-fill').style.width = `${tPct}%`;

        document.getElementById('prog-k-score').textContent = `${knowledge}/13 puan`;
        document.getElementById('prog-b-score').textContent = `${behavior}/85 puan`;
        document.getElementById('prog-t-score').textContent = `${totalScore}/98 puan`;

        document.getElementById('prog-k-pct').textContent = `${kPct}%`;
        document.getElementById('prog-b-pct').textContent = `${bPct}%`;
        document.getElementById('prog-t-pct').textContent = `${tPct}%`;
    }, 300);

    // Generate analysis
    const grid = document.getElementById('analysis-grid');
    const items = generateAnalysis(kPct, bPct, knowledge, behavior);

    grid.innerHTML = items.map(item => `
        <div class="analysis-item ${item.good ? 'strength' : 'weakness'}">
            <span class="icon">${item.good ? '✅' : '⚠️'}</span>
            <span>${item.text}</span>
        </div>
    `).join('');

    // Update module
    const mod = MODULES[level] || MODULES[2];
    document.getElementById('module-title').textContent = mod.title;
    document.getElementById('module-desc').textContent = mod.desc;

    // Button Listener
    const startBtn = document.getElementById('start-module-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const moduleId = level || 2;
            window.location.href = `index.html?openModule=${moduleId}`;
        });
    }
}
