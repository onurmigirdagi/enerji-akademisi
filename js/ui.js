import { MODULES } from './config.js';

export function toggleLoading(authBtn, isLoading, isLoginMode) {
    const span = authBtn.querySelector('.btn-text');
    const spinner = authBtn.querySelector('.loader-spinner');

    if (isLoading) {
        authBtn.disabled = true;
        span.textContent = 'İşleniyor...';
        if (spinner) spinner.classList.remove('hidden');
    } else {
        authBtn.disabled = false;
        span.textContent = isLoginMode ? 'Giriş Yap' : 'Kayıt Ol';
        if (spinner) spinner.classList.add('hidden');
    }
}

export function renderCourseGrid(level, container, hasAssessment) {
    // Module titles matching the original design
    const moduleTitles = {
        1: 'Enerji Verimliliği',
        2: 'Günlük Verimlilik',
        3: 'Kurumsal Liderlik'
    };

    const moduleDescs = {
        1: 'Temel Enerji Bilinci',
        2: 'Davranışsal Değişiklikler',
        3: 'Kurumsal Enerji Stratejileri'
    };

    container.innerHTML = `
        <h3 class="section-title" style="margin-top: 0;">Eğitim Programı</h3>
        <div class="stats-overview">
            ${[1, 2, 3].map(modId => {
        let state = 'locked';

        if (hasAssessment) {
            if (modId < level) state = 'completed';
            else if (modId === level) state = 'active';
            else state = 'locked';
        }

        // Card class and content based on state
        let cardClass = 'stat-box';
        let mainValue = '';
        let unit = '';

        if (state === 'locked') {
            cardClass = 'stat-box';
            mainValue = '🔒';
            unit = '';
        } else if (state === 'active') {
            cardClass = 'stat-box green-theme';
            mainValue = 'Modül';
            unit = modId;
        } else if (state === 'completed') {
            cardClass = 'stat-box highlight';
            mainValue = '✓';
            unit = 'Bitti';
        }

        return `
                <div class="${cardClass}" onclick="window.openModuleModal(${modId})" style="${state !== 'locked' ? 'cursor: pointer;' : ''}">
                    <div class="stat-title">${moduleTitles[modId]}</div>
                    <div class="stat-number">${mainValue} <span class="unit">${unit}</span></div>
                    <div class="stat-desc">${moduleDescs[modId]}</div>
                </div>
                `;
    }).join('')}
        </div>
    `;
}


// Modal Logic
export function openModuleModal(moduleId) {
    const mod = MODULES[moduleId];
    if (!mod) return;

    // Check if locked (optional logic, usually UI shouldn't allow click, but good safety)
    // Since we rely on global access via onclick, we'll re-check simple state or just allow.
    // For now, allow viewing any module content if clicked (render ensures only active/completed have cursors).

    const modal = document.getElementById('module-modal');
    document.getElementById('modal-title').textContent = mod.title;
    document.getElementById('modal-body').innerHTML = mod.content || '<p>İçerik hazırlanıyor...</p>';

    // Video Logic
    const vidPlaceholder = document.getElementById('modal-video-placeholder');
    const vidEmbed = document.getElementById('modal-video-embed');
    const completeBtn = document.getElementById('complete-module-btn');

    // Reset button state
    completeBtn.disabled = true;
    completeBtn.style.opacity = '0.5';
    completeBtn.style.cursor = 'not-allowed';
    completeBtn.title = 'Video tamamlanmadan geçilemez';

    if (mod.videoEmbed) {
        // Show Embed
        vidEmbed.innerHTML = mod.videoEmbed;
        vidEmbed.classList.remove('hidden');
        vidPlaceholder.classList.add('hidden');

        // Video Completion Logic
        const videoElement = vidEmbed.querySelector('video');
        if (videoElement) {
            videoElement.addEventListener('ended', () => {
                completeBtn.disabled = false;
                completeBtn.style.opacity = '1';
                completeBtn.style.cursor = 'pointer';
                completeBtn.title = '';
            });
        }
    } else if (mod.videoPlaceholder) {
        // Show Placeholder - No real video so enable button immediately (or keep disabled if strict)
        // For now, let's enable it if there's no actual video to watch
        vidEmbed.classList.add('hidden');
        vidEmbed.innerHTML = ''; // Stop any playing video
        vidPlaceholder.classList.remove('hidden');

        completeBtn.disabled = false;
        completeBtn.style.opacity = '1';
        completeBtn.style.cursor = 'pointer';
        completeBtn.title = '';

    } else {
        // No Video - Enable immediately
        vidEmbed.classList.add('hidden');
        vidEmbed.innerHTML = '';
        vidPlaceholder.classList.add('hidden');

        completeBtn.disabled = false;
        completeBtn.style.opacity = '1';
        completeBtn.style.cursor = 'pointer';
        completeBtn.title = '';
    }

    modal.classList.remove('hidden');

    // Close logic
    document.getElementById('close-modal').onclick = () => {
        modal.classList.add('hidden');
        vidEmbed.innerHTML = ''; // Stop video on close
    };

    // Close on outside click
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    };

    // Complete logic (simple mock)
    completeBtn.onclick = () => {
        if (!completeBtn.disabled) {
            modal.classList.add('hidden');
            // In real app, would call API to complete module
        }
    };
}

// Attach to window for inline onclicks
window.openModuleModal = openModuleModal;
