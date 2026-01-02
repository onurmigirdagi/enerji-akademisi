/* Modern Logic script.js */
document.addEventListener('DOMContentLoaded', async () => {

    // Initialize Supabase FIRST
    const supabaseUrl = 'https://hrshbpljdbyilwzuadoj.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhyc2hicGxqZGJ5aWx3enVhZG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjEyMTgsImV4cCI6MjA4MjkzNzIxOH0.AcGgZePLd0DXqNvvFULTwh9mXRZ7iI66kuhpf8bHkRs';
    const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
    let currentUser = null;
    let isLoginMode = true;

    const loginWrapper = document.getElementById('login-section');
    const dashboard = document.getElementById('dashboard-section');
    const displayName = document.getElementById('user-display-name');

    // IMMEDIATE CHECK: Hide assessment CTA if results exist locally (prevents flash)
    try {
        const localResults = JSON.parse(localStorage.getItem('assessmentResults'));
        if (localResults) {
            document.getElementById('assessment-cta').classList.add('hidden');
            const grid = document.getElementById('personalized-grid');
            grid.classList.remove('hidden');
            renderModuleCard(localResults.level, grid);
        }
    } catch (e) {
        console.log('Local storage check failed', e);
    }

    // Check for existing session on page load
    const { data: { session } } = await _supabase.auth.getSession();

    if (session && session.user) {
        // User is already logged in, go straight to dashboard
        currentUser = session.user;
        const name = session.user.user_metadata?.username || session.user.email.split('@')[0];
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        displayName.textContent = formattedName;

        loginWrapper.classList.add('hidden');
        dashboard.classList.remove('hidden');

        // Load user data
        const { data } = await _supabase
            .from('profiles')
            .select('scores, level')
            .eq('id', session.user.id)
            .single();

        if (data && data.scores) {
            localStorage.setItem('assessmentResults', JSON.stringify({
                knowledge: data.scores.knowledge,
                behavior: data.scores.behavior,
                totalScore: data.scores.totalScore,
                level: data.level
            }));
            document.getElementById('assessment-cta').classList.add('hidden');
            const grid = document.getElementById('personalized-grid');
            grid.classList.remove('hidden');
            renderModuleCard(data.level, grid);
        } else {
            // Check localStorage
            const results = JSON.parse(localStorage.getItem('assessmentResults'));
            if (results) {
                document.getElementById('assessment-cta').classList.add('hidden');
                const grid = document.getElementById('personalized-grid');
                grid.classList.remove('hidden');
                renderModuleCard(results.level, grid);
            }
        }

        // Clean URL if hash present
        if (window.location.hash === '#dashboard') {
            history.replaceState(null, null, 'index.html');
        }
    } else if (window.location.hash === '#dashboard') {
        // No session but hash present - redirect to login
        history.replaceState(null, null, 'index.html');
    }

    // Selectors
    const loginForm = document.getElementById('login-form');
    const authBtn = document.getElementById('auth-btn');
    const guestBtn = document.getElementById('guest-btn');
    const toggleAuthBtn = document.getElementById('toggle-auth-btn');
    const authTitle = document.getElementById('auth-title');
    const authError = document.getElementById('auth-error');


    // Toggle Login/Register Mode
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const passwordConfirmInput = document.getElementById('password-confirm');

    toggleAuthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;

        const toggleMsg = document.getElementById('toggle-msg');

        if (isLoginMode) {
            authTitle.textContent = 'Giriş Yap';
            authBtn.querySelector('.btn-text').textContent = 'Giriş Yap';
            toggleMsg.textContent = 'Hesabınız yok mu? ';
            toggleAuthBtn.textContent = 'Kayıt Ol';
            confirmPasswordGroup.classList.add('hidden');
            passwordConfirmInput.removeAttribute('required');
        } else {
            authTitle.textContent = 'Hesap Oluştur';
            authBtn.querySelector('.btn-text').textContent = 'Kayıt Ol';
            toggleMsg.textContent = 'Zaten hesabınız var mı? ';
            toggleAuthBtn.textContent = 'Giriş Yap';
            confirmPasswordGroup.classList.remove('hidden');
            passwordConfirmInput.setAttribute('required', 'required');
        }
        authError.style.display = 'none';
    });

    // Spinner Helper
    const toggleLoading = (isLoading) => {
        const span = authBtn.querySelector('.btn-text');
        if (isLoading) {
            authBtn.disabled = true;
            span.textContent = 'İşleniyor...';
        } else {
            authBtn.disabled = false;
            span.textContent = isLoginMode ? 'Giriş Yap' : 'Kayıt Ol';
        }
    };

    // Main Auth Action
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted. Mode:', isLoginMode ? 'Login' : 'Register');
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        toggleLoading(true);
        authError.style.display = 'none';

        try {
            if (isLoginMode) {
                // Login
                const { data, error } = await _supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                if (error) throw error;
                handleLoginSuccess(data.user);
            } else {
                // Password match validation
                if (password !== passwordConfirm) {
                    throw new Error('Şifreler eşleşmiyor.');
                }

                // Sign Up
                const { data, error } = await _supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            username: email.split('@')[0]
                        }
                    }
                });
                if (error) throw error;

                // Create profile entry
                if (data.user) {
                    await _supabase.from('profiles').insert({
                        id: data.user.id,
                        username: email.split('@')[0],
                        email: email,
                        updated_at: new Date()
                    });
                    handleLoginSuccess(data.user);
                }
            }
        } catch (error) {
            console.error('Auth Error:', error);
            authError.textContent = error.message === 'Invalid login credentials'
                ? 'Hatalı e-posta veya şifre.'
                : 'Bir hata oluştu: ' + error.message;
            authError.style.display = 'block';
            toggleLoading(false);
        }
    });

    // Guest Action
    guestBtn.addEventListener('click', () => {
        handleLoginSuccess({ email: 'misafir@user.com', user_metadata: { username: 'Misafir' }, is_anonymous: true });
    });

    // Handle Successful Login
    async function handleLoginSuccess(user) {
        currentUser = user;
        const name = user.user_metadata?.username || user.email.split('@')[0];

        // Capitalize
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        displayName.textContent = formattedName;

        // Persist User Identity for Profile Page
        localStorage.setItem('appUser', JSON.stringify({
            username: formattedName,
            email: user.email
        }));

        // Switch Views
        loginWrapper.style.opacity = '0';
        setTimeout(async () => {
            loginWrapper.classList.add('hidden');
            dashboard.classList.remove('hidden');

            dashboard.animate([
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 400, easing: 'ease-out' });

            // Load Data from Supabase if not guest
            if (!user.is_anonymous) {
                const { data, error } = await _supabase
                    .from('profiles')
                    .select('scores, level')
                    .eq('id', user.id)
                    .single();

                if (data && data.scores) {
                    // Convert DB format to local app format if needed, or directly use
                    // For compatibility while switching, we can sync to localStorage
                    localStorage.setItem('assessmentResults', JSON.stringify({
                        knowledge: data.scores.knowledge,
                        behavior: data.scores.behavior,
                        totalScore: data.scores.totalScore,
                        level: data.level
                    }));

                    // Update UI
                    document.getElementById('assessment-cta').classList.add('hidden');
                    const grid = document.getElementById('personalized-grid');
                    grid.classList.remove('hidden');
                    renderModuleCard(data.level, grid);
                }
            } else {
                // Check localStorage for guest
                const results = JSON.parse(localStorage.getItem('assessmentResults'));
                if (results) {
                    document.getElementById('assessment-cta').classList.add('hidden');
                    const grid = document.getElementById('personalized-grid');
                    grid.classList.remove('hidden');
                    renderModuleCard(results.level, grid);
                }
            }

        }, 500);
    }

    /* --- ASSESSMENT SYSTEM LOGIC --- */

    // Elements
    const assessmentCTA = document.getElementById('assessment-cta');
    const startBtn = document.getElementById('start-assessment-btn');
    const assessmentModal = document.getElementById('assessment-modal');
    const reportModal = document.getElementById('report-modal');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const questionTracker = document.getElementById('question-tracker');

    const scoreKnowledgeEl = document.getElementById('score-knowledge');
    const scoreBehaviorEl = document.getElementById('score-behavior');
    const deficiencyList = document.getElementById('deficiency-items');
    const createPlanBtn = document.getElementById('create-plan-btn');
    const personalizedGrid = document.getElementById('personalized-grid');

    // Data - Full 30 Question Survey
    // A. BİLGİ DÜZEYİ (13 Soru - Çoktan Seçmeli, Doğru = 1 puan)
    // B. DAVRANIŞ DÜZEYİ (17 Soru - Likert 1-5)
    const knowledgeQuestions = [
        { text: "Enerji verimliliğinin temel amacı aşağıdakilerden hangisidir?", options: ["Enerji tüketimini tamamen ortadan kaldırmak", "Aynı hizmeti daha az enerji kullanarak sağlamak", "Enerji fiyatlarını düşürmek", "Yalnızca yenilenebilir enerji kullanmak"], correct: 1 },
        { text: "Konutlarda toplam enerji tüketimi içinde en yüksek pay genellikle hangi alana aittir?", options: ["Aydınlatma", "Isıtma ve soğutma", "Elektronik cihazlar", "Küçük ev aletleri"], correct: 1 },
        { text: "A++ enerji sınıfı bir elektrikli cihaz neyi ifade eder?", options: ["Yüksek güç tüketimini", "Enerji verimliliği yüksek ürünü", "Daha ucuz ürünü", "Kısa kullanım ömrünü"], correct: 1 },
        { text: "LED ampuller, akkor flamanlı ampullere kıyasla yaklaşık ne kadar daha az enerji tüketir?", options: ["%10–20", "%30–40", "%70–80", "%90–100"], correct: 2 },
        { text: "Bir elektrikli su ısıtıcısının ortalama güç tüketimi hangi aralıktadır?", options: ["200–400 W", "800–1000 W", "1500–2000 W", "3000 W üzeri"], correct: 2 },
        { text: "Isı yalıtımı yapılmış bir binada aşağıdakilerden hangisi sağlanır?", options: ["Enerji tüketiminin artması", "Isı kayıplarının azaltılması", "Yalnızca yaz aylarında konfor", "Elektrik tesisatının korunması"], correct: 1 },
        { text: "Enerji Kimlik Belgesi (EKB) hangi yapılar için zorunludur?", options: ["Motorlu taşıtlar", "Sanayi makineleri", "Binalar", "Elektronik cihazlar"], correct: 2 },
        { text: "Stand-by (bekleme) modundaki cihazlar için hangisi doğrudur?", options: ["Enerji tüketmezler", "Düşük düzeyde ancak sürekli enerji tüketirler", "Sadece gece saatlerinde enerji tüketirler", "Yalnızca eski cihazlarda görülür"], correct: 1 },
        { text: "Çift camlı pencerelerin temel faydası aşağıdakilerden hangisidir?", options: ["Aydınlatma ihtiyacını azaltması", "Isı ve ses kayıplarını azaltması", "Elektrik tüketimini artırması", "Nem oluşumunu tamamen engellemesi"], correct: 1 },
        { text: "Klima kullanımında enerji verimliliği açısından önerilen iç ortam sıcaklığı kaç °C'dir?", options: ["16–18 °C", "18–20 °C", "24–26 °C", "28–30 °C"], correct: 2 },
        { text: "Aşağıdakilerden hangisi pasif enerji verimliliği önlemi olarak değerlendirilir?", options: ["Yüksek verimli klima kullanımı", "Isı yalıtımı yapılması", "LED aydınlatma kullanımı", "Akıllı sayaç kurulumu"], correct: 1 },
        { text: "Elektrikli cihazlarda bulunan enerji etiketi hangi bilgiyi sunar?", options: ["Sadece satış fiyatını", "Enerji tüketimi ve verimlilik sınıfını", "Garanti süresini", "Üretim yerini"], correct: 1 },
        { text: "Aşağıdakilerden hangisi enerji tasarrufu sağlayan doğru bir uygulamadır?", options: ["Çamaşır makinesini yarım yükle çalıştırmak", "Tam dolu çalıştırmayı tercih etmek", "Yüksek sıcaklıkta yıkama yapmak", "Cihazları sürekli prizde bırakmak"], correct: 1 }
    ];

    const behaviorQuestions = [
        { text: "Kullanmadığım elektrikli cihazların fişini prizden çekerim." },
        { text: "Konutumda LED veya enerji tasarruflu ampuller kullanırım." },
        { text: "Isıtma ve soğutma sistemlerini gereğinden yüksek ayarlamam." },
        { text: "Beyaz eşyaları tam dolu çalıştırmaya özen gösteririm." },
        { text: "Yeni bir cihaz satın alırken enerji verimliliği sınıfını dikkate alırım." },
        { text: "Gün ışığından mümkün olduğunca faydalanırım." },
        { text: "Elektrik ve doğal gaz faturalarımı düzenli olarak takip ederim." },
        { text: "Klima çalışırken kapı ve pencereleri kapalı tutarım." },
        { text: "Su ısıtıcısını yalnızca ihtiyaç kadar doldururum." },
        { text: "Konutumda ısı yalıtımı konusunda bilgi sahibiyim." },
        { text: "Enerji verimliliğine yönelik kamu duyuru ve kampanyalarını takip ederim." },
        { text: "Yaz aylarında doğal havalandırmayı tercih ederim." },
        { text: "Kamu binalarında enerji tasarrufuna yönelik uygulamalara uyarım." },
        { text: "Çalışma ortamında gereksiz aydınlatmaları kapatırım." },
        { text: "Enerji tasarrufu konusunda çevremdekileri bilinçlendirmeye çalışırım." },
        { text: "Uzun süreli evden ayrılışlarda elektrikli cihazları kapatırım." },
        { text: "Günlük yaşamımda enerji verimliliğini öncelikli bir konu olarak görürüm." }
    ];

    // Build all questions array
    const questions = [
        ...knowledgeQuestions.map((q, i) => ({
            type: 'knowledge',
            number: i + 1,
            text: q.text,
            options: q.options,
            correct: q.correct
        })),
        ...behaviorQuestions.map((q, i) => ({
            type: 'behavior',
            number: i + 14, // B14-B30
            text: q.text,
            options: ["Her Zaman (5)", "Sıklıkla (4)", "Bazen (3)", "Nadiren (2)", "Hiçbir Zaman (1)"],
            points: [5, 4, 3, 2, 1]
        }))
    ];

    let currentQuestionIndex = 0;
    let scores = { knowledge: 0, behavior: 0 };

    // 1. Start Assessment - Direct Button Click (Attached Immediately)
    const startAssessmentBtn = document.getElementById('start-assessment-btn');
    if (startAssessmentBtn) {
        startAssessmentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Assessment starting...');
            currentQuestionIndex = 0;
            scores = { knowledge: 0, behavior: 0 };
            assessmentModal.classList.remove('hidden');
            loadQuestion(0);
        });
        console.log('Assessment button listener attached.');
    } else {
        console.error('Assessment button not found!');
    }

    function loadQuestion(index) {
        if (index >= questions.length) {
            finishAssessment();
            return;
        }

        const q = questions[index];
        const sectionLabel = q.type === 'knowledge' ? 'A. BİLGİ' : 'B. DAVRANIŞ';
        questionText.textContent = q.text;
        questionTracker.textContent = `${sectionLabel} - Soru ${index + 1}/${questions.length}`;
        optionsContainer.innerHTML = '';

        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = () => handleAnswer(q, i);
            optionsContainer.appendChild(btn);
        });
    }

    function handleAnswer(question, answerIndex) {
        if (question.type === 'knowledge') {
            if (answerIndex === question.correct) {
                scores.knowledge += 1; // 1 point per correct
            }
        } else {
            scores.behavior += question.points[answerIndex]; // Likert 1-5
        }

        loadQuestion(++currentQuestionIndex);
    }

    function finishAssessment() {
        assessmentModal.classList.add('hidden');

        // Calculate Total Score (Max: 13 + 85 = 98, but we use 16-93 range from doc)
        // Knowledge: 0-13 points
        // Behavior: 17-85 points (17 questions x 1-5)
        const totalScore = scores.knowledge + scores.behavior;

        // Calculate percentages for display
        const kPercent = Math.round((scores.knowledge / 13) * 100);
        const bPercent = Math.round((scores.behavior / 85) * 100);

        // Show Report
        scoreKnowledgeEl.textContent = `${scores.knowledge}/13`;
        scoreBehaviorEl.textContent = `${scores.behavior}/85`;

        // Animate Bars
        setTimeout(() => {
            document.getElementById('bar-knowledge').style.width = `${kPercent}%`;
            document.getElementById('bar-behavior').style.width = `${bPercent}%`;
        }, 300);

        // Determine Level based on Total Score (16-93 scale from doc)
        let level, levelDesc, moduleName, moduleDesc;

        if (totalScore <= 45) {
            level = 1;
            levelDesc = "Temel Farkındalık Düzeyi";
            moduleName = "Modül 1: Enerji Verimliliğine Giriş";
            moduleDesc = "Enerji verimliliği nedir, neden önemlidir? Basit tasarruf yöntemleri.";
        } else if (totalScore <= 70) {
            level = 2;
            levelDesc = "Gelişmekte Olan Farkındalık";
            moduleName = "Modül 2: Konut ve Günlük Yaşamda Enerji Verimliliği";
            moduleDesc = "Enerji etiketleri, bilinçli cihaz seçimi ve davranışsal değişiklik.";
        } else {
            level = 3;
            levelDesc = "Yüksek Farkındalık - Rol Model";
            moduleName = "Modül 3: Kurumsal Enerji ve Davranışsal Liderlik";
            moduleDesc = "Kurumsal enerji kültürü ve yaygınlaştırma.";
        }

        // Analyze Deficiencies
        deficiencyList.innerHTML = '';
        const items = [
            `Toplam Puan: ${totalScore}/98`,
            `Düzey ${level}: ${levelDesc}`,
            `Önerilen Program: ${moduleName}`
        ];

        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            deficiencyList.appendChild(li);
        });

        reportModal.classList.remove('hidden');

        // Store for course generation
        // Store for course generation & Persist Data
        createPlanBtn.onclick = async () => {
            const resultData = {
                knowledge: scores.knowledge,
                behavior: scores.behavior,
                totalScore: totalScore,
                level: level
            };

            // 1. Local Storage (Always)
            localStorage.setItem('assessmentResults', JSON.stringify(resultData));

            // 2. Supabase (If Logged In)
            if (currentUser && !currentUser.is_anonymous) {
                try {
                    authBtn.textContent = 'Kaydediliyor...'; // Reuse button or show generic loading if visible, but this is inside modal
                    createPlanBtn.textContent = 'Kaydediliyor...';
                    createPlanBtn.disabled = true;

                    const { error } = await _supabase
                        .from('profiles')
                        .update({
                            scores: resultData,
                            level: level,
                            updated_at: new Date()
                        })
                        .eq('id', currentUser.id);

                    if (error) throw error;
                    console.log('Results saved to Supabase');
                } catch (err) {
                    console.error('Failed to save to Supabase:', err);
                    // Continue anyway, local storage is fallback
                } finally {
                    createPlanBtn.textContent = 'Eğitim Planımı Oluştur';
                    createPlanBtn.disabled = false;
                }
            }

            generateCourses(level, moduleName, moduleDesc);
        };
    }

    function generateCourses(level, moduleName, moduleDesc) {
        reportModal.classList.add('hidden');
        assessmentCTA.classList.add('hidden');
        personalizedGrid.classList.remove('hidden');
        personalizedGrid.innerHTML = '';

        const courses = [];

        // Generate course based on level
        if (level === 1) {
            courses.push({
                title: "Enerji Verimliliğine Giriş ve Temel Bilinçlendirme",
                tag: "Modül 1 - Zorunlu",
                desc: "45-60 dakika • Video + Bilgi Notları",
                progress: 0,
                color: "c1"
            });
        } else if (level === 2) {
            courses.push({
                title: "Konut ve Günlük Yaşamda Enerji Verimliliği",
                tag: "Modül 2 - Önerilen",
                desc: "60-90 dakika • Vaka Örnekleri",
                progress: 0,
                color: "c2"
            });
        } else {
            courses.push({
                title: "Kurumsal Enerji Verimliliği ve Davranışsal Liderlik",
                tag: "Modül 3 - İleri Seviye",
                desc: "1 Tam Gün Atölye Çalışması",
                progress: 0,
                color: "c3"
            });
        }

        // Render Cards
        courses.forEach(c => {
            const html = `
                <div class="course-card">
                    <div class="course-thumb ${c.color}"></div>
                    <div class="course-info">
                        <span class="tag ${c.tag.includes("Zorunlu") ? "" : "soft"}">${c.tag}</span>
                        <h4>${c.title}</h4>
                        <p class="course-desc">${c.desc}</p>
                        <button class="continue-btn">Eğitime Başla</button>
                    </div>
                </div>
            `;
            personalizedGrid.innerHTML += html;
        });

        // Scroll to grid
        personalizedGrid.scrollIntoView({ behavior: 'smooth' });
    }

    // Logic: How we measure impact
    function calculateGreenStats() {
        // Mock Data: In a real app, this comes from the backend
        const coursesCompleted = 12; // Example data
        const coursesInProgress = 3;

        // Formula:
        // 1 Digital Course = ~10kg CO2 saved (avg paper, travel, physical utility savings)
        const carbonSaved = coursesCompleted * 10;

        // Efficiency Score: Base 80% + (Completed * 1.5) capped at 99%
        let efficiencyScore = 80 + (coursesCompleted * 1.5);
        if (efficiencyScore > 99) efficiencyScore = 99;

        // Animate Numbers
        animateValue("stat-green-carbon", 0, carbonSaved, 2000);
        animateValue("stat-green-efficiency", 0, Math.floor(efficiencyScore), 2000);
    }

    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        if (!obj) return;

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function renderModuleCard(level, container) {
        const modules = {
            1: {
                title: 'Modül 1: Enerji Verimliliğine Giriş',
                desc: '45-60 dakika • Video + Bilgi Notları • Temel kavramlar ve basit tasarruf yöntemleri'
            },
            2: {
                title: 'Modül 2: Günlük Yaşamda Verimlilik',
                desc: '60-90 dakika • Vaka Örnekleri • Enerji etiketleri, fatura okuma, davranış değişikliği'
            },
            3: {
                title: 'Modül 3: Kurumsal Liderlik',
                desc: '1 Tam Gün Atölye • Kurumsal kültür, çevreyi bilgilendirme, rol model olma'
            }
        };

        const mod = modules[level] || modules[2];

        container.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 1rem;">Önerilen Eğitim Programı</h3>
                <div class="module-card" style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border: 2px solid #10b981; border-radius: 16px; padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="width: 64px; height: 64px; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06); flex-shrink: 0;">
                        <div class="book-icon" style="width: 24px; height: 18px; border: 2px solid #4F46E5; border-radius: 2px; position: relative;">
                            <div style="position: absolute; width: 2px; height: 100%; background: #4F46E5; left: 50%; transform: translateX(-50%);"></div>
                        </div>
                    </div>
                    <div style="flex: 1;">
                        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.3rem; color: #064e3b;">${mod.title}</h4>
                        <p style="color: #047857; font-size: 0.95rem; margin-bottom: 1rem;">${mod.desc}</p>
                        <a href="#" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: #059669; color: white; border: none; border-radius: 10px; font-weight: 600; font-size: 0.9rem; cursor: pointer; text-decoration: none; transition: background 0.2s;">
                            Eğitime Başla →
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
});
