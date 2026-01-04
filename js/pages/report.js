import { generateAnalysis } from '../quiz.js';
import { MODULES } from '../config.js';
import { supabase, getCurrentUser } from '../auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const data = JSON.parse(localStorage.getItem('assessmentResults'));
    const createPlanBtn = document.getElementById('create-plan-btn');

    if (!data) {
        window.location.href = 'index.html'; // Redirect if no data
        return;
    }

    const { knowledge, behavior, totalScore, level } = data;

    const kPct = Math.round((knowledge / 13) * 100);
    const bPct = Math.round((behavior / 85) * 100);
    const tPct = Math.round((totalScore / 98) * 100);

    // Animate progress bars
    setTimeout(() => {
        const kFill = document.getElementById('prog-k-fill');
        const bFill = document.getElementById('prog-b-fill');
        const tFill = document.getElementById('prog-t-fill');

        if (kFill) kFill.style.width = `${kPct}%`;
        if (bFill) bFill.style.width = `${bPct}%`;
        if (tFill) tFill.style.width = `${tPct}%`;

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

    // Save Logic
    if (createPlanBtn) {
        createPlanBtn.addEventListener('click', async () => {
            console.log("Create Plan Clicked");
            createPlanBtn.disabled = true;
            createPlanBtn.textContent = 'Kaydediliyor...';

            try {
                const user = await getCurrentUser();

                // 1. Ensure LocalStorage is up to date (it should be)
                localStorage.setItem('assessmentResults', JSON.stringify(data));

                if (user) {
                    // 2. Save to Supabase
                    console.log('Saving to Supabase for user:', user.email);

                    const { data: rpcData, error } = await supabase.rpc('update_assessment_results', {
                        p_scores: data,
                        p_level: level,
                        p_email: user.email,
                        p_username: user.user_metadata?.username || user.email.split('@')[0]
                    });

                    if (error) {
                        console.error('RPC Error:', error);
                        alert('Kayıt sırasında bir hata oluştu: ' + error.message);
                        createPlanBtn.disabled = false;
                        createPlanBtn.textContent = 'Tekrar Dene';
                        return;
                    }

                    console.log('Saved successfully:', rpcData);
                } else {
                    console.log('User not logged in, saving locally only.');
                }

                // 3. Redirect to Dashboard
                window.location.href = 'index.html';

            } catch (err) {
                console.error('Unexpected error:', err);
                alert('Beklenmeyen bir hata oluştu.');
                createPlanBtn.disabled = false;
                createPlanBtn.textContent = 'Eğitim Planımı Oluştur';
            }
        });
    }
});
