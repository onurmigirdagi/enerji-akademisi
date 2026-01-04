import { getCurrentUser, signIn, signUp, signOut, supabase } from '../auth.js';

import { toggleLoading, renderCourseGrid } from '../ui.js';

let isLoginMode = true;

document.addEventListener('DOMContentLoaded', async () => {

    // DOM Elements
    const loginWrapper = document.getElementById('login-section');
    const dashboard = document.getElementById('dashboard-section');
    const displayName = document.getElementById('user-display-name');
    const assessmentCTA = document.getElementById('assessment-cta');
    const personalizedGrid = document.getElementById('personalized-grid');

    const loginForm = document.getElementById('login-form');
    const authBtn = document.getElementById('auth-btn');
    const toggleAuthBtn = document.getElementById('toggle-auth-btn');
    const authTitle = document.getElementById('auth-title');
    const authError = document.getElementById('auth-error');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const passwordConfirmInput = document.getElementById('password-confirm');
    const toggleMsg = document.getElementById('toggle-msg');

    // 1. Check LocalStorage for Results (Immediate UI update)
    let hasLocalResults = false;
    let localLevel = 1;
    try {
        const localResults = JSON.parse(localStorage.getItem('assessmentResults'));
        if (localResults) {
            hasLocalResults = true;
            localLevel = localResults.level;
            assessmentCTA.classList.add('hidden');
        } else {
            assessmentCTA.classList.remove('hidden');
        }
        if (hasLocalResults) {
            personalizedGrid.classList.remove('hidden');
            renderCourseGrid(localLevel, personalizedGrid, hasLocalResults);
        } else {
            personalizedGrid.classList.add('hidden');
        }

    } catch (e) {
        console.log('Local storage check failed', e);
    }

    // 2. Check Session
    const user = await getCurrentUser();

    if (user) {
        // User logged in
        handleLoginSuccess(user);

        // Clean URL if hash present
        if (window.location.hash === '#dashboard') {
            history.replaceState(null, null, 'index.html');
        }
    } else {
        // No user session
        if (window.location.hash === '#dashboard') {
            history.replaceState(null, null, 'index.html');
        }
    }

    // 3. Event Listeners

    // Toggle Login/Register
    toggleAuthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;

        if (isLoginMode) {
            authTitle.textContent = 'Giriş Yap';
            authBtn.querySelector('.btn-text').textContent = 'Giriş Yap';
            toggleMsg.textContent = 'Hesabınız yok mu?';
            toggleAuthBtn.textContent = 'Kayıt Ol';
            confirmPasswordGroup.classList.add('hidden');
            passwordConfirmInput.removeAttribute('required');
        } else {
            authTitle.textContent = 'Hesap Oluştur';
            authBtn.querySelector('.btn-text').textContent = 'Kayıt Ol';
            toggleMsg.textContent = 'Zaten hesabınız var mı?';
            toggleAuthBtn.textContent = 'Giriş Yap';
            confirmPasswordGroup.classList.remove('hidden');
            passwordConfirmInput.setAttribute('required', 'required');
        }
        authError.style.display = 'none';
        authError.style.color = '#dc2626';
    });

    // Form Submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        toggleLoading(authBtn, true, isLoginMode);
        authError.style.display = 'none';
        authError.style.color = '#dc2626';

        try {
            if (isLoginMode) {
                // Login
                const { data, error } = await signIn(email, password);
                if (error) throw error;
                handleLoginSuccess(data.user);
            } else {
                // Register
                if (password !== passwordConfirm) {
                    throw new Error('Şifreler eşleşmiyor.');
                }
                const { data, error } = await signUp(email, password, email.split('@')[0]);
                if (error) throw error;
                if (data.user) {
                    // Prevent auto-login: Sign out immediately
                    await signOut();

                    // Switch to Login Mode
                    isLoginMode = true;
                    authTitle.textContent = 'Giriş Yap';
                    authBtn.querySelector('.btn-text').textContent = 'Giriş Yap';
                    toggleMsg.textContent = 'Hesabınız yok mu?';
                    toggleAuthBtn.textContent = 'Kayıt Ol';
                    confirmPasswordGroup.classList.add('hidden');
                    passwordConfirmInput.removeAttribute('required');

                    // Show Success Message
                    authError.textContent = 'Kayıt başarılı! Lütfen giriş yapınız.';
                    authError.style.color = '#059669'; // Emerald green
                    authError.style.display = 'block';

                    toggleLoading(authBtn, false, isLoginMode);
                    return;
                }
            }
        } catch (error) {
            console.error('Auth Error:', error);
            authError.textContent = error.message === 'Invalid login credentials'
                ? 'Hatalı e-posta veya şifre.'
                : 'Bir hata oluştu: ' + error.message;
            authError.style.display = 'block';
            authError.style.color = '#dc2626'; // Red for errors
            toggleLoading(authBtn, false, isLoginMode);
        }
    });

    // Guest Login
    guestBtn.addEventListener('click', () => {
        handleLoginSuccess({ email: 'misafir@user.com', user_metadata: { username: 'Misafir' }, is_anonymous: true });
    });

    // Start Assessment
    const startAssessmentBtn = document.getElementById('start-assessment-btn');
    if (startAssessmentBtn) {
        startAssessmentBtn.addEventListener('click', () => {
            window.location.href = 'assessment.html';
        });
    }

    // Helper: Handle Success
    async function handleLoginSuccess(user) {
        const name = user.user_metadata?.username || user.email.split('@')[0];
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        displayName.textContent = formattedName;

        // Persist User for Profile
        localStorage.setItem('appUser', JSON.stringify({
            username: formattedName,
            email: user.email
        }));

        // Switch Views
        loginWrapper.classList.add('hidden');
        dashboard.classList.remove('hidden');

        // GUEST handling
        if (user.is_anonymous) {
            const localResults = JSON.parse(localStorage.getItem('assessmentResults'));
            personalizedGrid.classList.remove('hidden');
            if (localResults) {
                assessmentCTA.classList.add('hidden');
                renderCourseGrid(localResults.level, personalizedGrid, true);
            } else {
                assessmentCTA.classList.remove('hidden');
                personalizedGrid.classList.add('hidden');
            }
            return;
        }

        // LOGGED IN USER handling
        try {
            let { data, error } = await supabase
                .from('profiles')
                .select('scores, level')
                .eq('id', user.id)
                .single();

            if (error || !data) {
                // Profile missing, attempt create
                const localResults = JSON.parse(localStorage.getItem('assessmentResults'));

                // DATA LEAK PROTECTION:
                // Only use localResults if they belong to:
                // 1. This user (re-login on same device)
                // 2. 'guest' (claiming a guest session)
                let validResults = null;
                if (localResults) {
                    if (localResults.ownerId === user.id) {
                        validResults = localResults;
                    } else if (localResults.ownerId === 'guest') {
                        validResults = localResults;
                    } else {
                        // Results belong to someone else. CLEAR THEM.
                        console.warn('Found results for another user. Clearing to prevent leak.');
                        localStorage.removeItem('assessmentResults');
                    }
                }

                const payload = {
                    id: user.id,
                    email: user.email,
                    username: formattedName,
                    updated_at: new Date(),
                    scores: validResults || null,
                    level: validResults ? validResults.level : null
                };
                const insertRes = await supabase.from('profiles').insert(payload).select().single();

                // Do not blindly show grid for new users
                // personalizedGrid.classList.remove('hidden');

                if (!insertRes.error) {
                    data = insertRes.data;
                    if (validResults) {
                        assessmentCTA.classList.add('hidden');
                        personalizedGrid.classList.remove('hidden');
                        renderCourseGrid(validResults.level, personalizedGrid, true);
                    } else {
                        // NEW USER (No valid results): Show CTA only
                        assessmentCTA.classList.remove('hidden');
                        personalizedGrid.classList.add('hidden');
                    }
                } else {
                    // Fallback: Error creating profile
                    assessmentCTA.classList.remove('hidden');
                    personalizedGrid.classList.add('hidden');
                }
            } else if (data && data.scores) {
                // Sync Down
                localStorage.setItem('assessmentResults', JSON.stringify({
                    knowledge: data.scores.knowledge,
                    behavior: data.scores.behavior,
                    totalScore: data.scores.totalScore,
                    level: data.level
                }));
                assessmentCTA.classList.add('hidden');
                personalizedGrid.classList.remove('hidden');
                renderCourseGrid(data.level, personalizedGrid, true);
            } else {
                // Sync Up
                const localResults = JSON.parse(localStorage.getItem('assessmentResults'));
                personalizedGrid.classList.remove('hidden');

                if (localResults) {
                    await supabase.from('profiles').update({
                        scores: localResults,
                        level: localResults.level,
                        updated_at: new Date()
                    }).eq('id', user.id);
                    assessmentCTA.classList.add('hidden');
                    renderCourseGrid(localResults.level, personalizedGrid, true);
                } else {
                    // Authenticated, no data -> Show CTA only
                    assessmentCTA.classList.remove('hidden');
                    personalizedGrid.classList.add('hidden');
                }
            }
        } catch (err) {
            console.error("Error in handleLoginSuccess:", err);
            // Fallback
            // personalizedGrid.classList.remove('hidden');
            const localResults = JSON.parse(localStorage.getItem('assessmentResults'));
            if (localResults) {
                assessmentCTA.classList.add('hidden');
                personalizedGrid.classList.remove('hidden');
                renderCourseGrid(localResults.level, personalizedGrid, true);
            } else {
                assessmentCTA.classList.remove('hidden');
                personalizedGrid.classList.add('hidden');
            }
        }
    }
});


// 4. Module Completion Handler
document.addEventListener('moduleCompleted', async (e) => {
    const { moduleId } = e.detail;

    // Get current state
    let localResults = JSON.parse(localStorage.getItem('assessmentResults'));
    if (!localResults) return; // Should not happen if grid is visible

    // Check if allowed to complete (must be current level)
    if (moduleId !== localResults.level) {
        console.warn('Cannot complete future or past modules out of order.');
        // Optional: Allow re-completing past modules? For now, no specific logic needed as it won't increment level.
        return;
    }

    // Increment Level
    if (localResults.level < 3) {
        localResults.level += 1;
        localResults.updatedAt = new Date().toISOString();

        // Save Local
        localStorage.setItem('assessmentResults', JSON.stringify(localResults));

        // Update UI
        renderCourseGrid(localResults.level, personalizedGrid, true);

        // Sync Supabase (if logged in)
        const user = await getCurrentUser();
        if (user) {
            try {
                await supabase.from('profiles').update({
                    level: localResults.level,
                    updated_at: new Date()
                }).eq('id', user.id);
            } catch (err) {
                console.error('Failed to sync progress:', err);
            }
        }
    } else {
        console.log('Max level reached!');
        // Already level 3.
    }
});
