import { getFullQuestions } from '../data.js';
import { determineLevel } from '../quiz.js';
import { getCurrentUser } from '../auth.js';

// State
let currentIndex = 0;
let scores = { knowledge: 0, behavior: 0 };
let currentSelection = null; // Track selection
const questions = getFullQuestions();

// DOM Elements
const questionCard = document.getElementById('question-card');
const resultsCard = document.getElementById('results-card');
const sectionBadge = document.getElementById('section-badge');
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

// Initialize
loadQuestion(0);

function loadQuestion(index) {
    cleanUpNextButton();
    if (index >= questions.length) {
        showResults();
        return;
    }

    const q = questions[index];
    currentIndex = index;
    currentSelection = null; // Reset selection

    // Update progress
    const progress = ((index) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${index + 1} / ${questions.length}`;

    // Update section badge
    if (q.type === 'knowledge') {
        sectionBadge.textContent = 'A. BİLGİ DÜZEYİ';
        sectionBadge.className = 'section-badge';
    } else {
        sectionBadge.textContent = 'B. DAVRANIŞ DÜZEYİ';
        sectionBadge.className = 'section-badge behavior';
    }

    // Update question
    questionNumber.textContent = `Soru ${index + 1}`;
    questionText.textContent = q.text;

    // Clear and render options
    optionsContainer.innerHTML = '';

    if (q.type === 'knowledge') {
        // Multiple choice
        const letters = ['A', 'B', 'C', 'D'];
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-button';
            btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${opt}</span>`;

            btn.onclick = () => selectKnowledgeOption(btn, q, i);

            optionsContainer.appendChild(btn);
        });
    } else {
        // Likert scale
        optionsContainer.className = 'likert-scale';
        const likertOptions = [
            { score: 5, label: 'Her Zaman' },
            { score: 4, label: 'Sıklıkla' },
            { score: 3, label: 'Bazen' },
            { score: 2, label: 'Nadiren' },
            { score: 1, label: 'Hiçbir Zaman' }
        ];
        likertOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'likert-option';
            btn.innerHTML = `<span class="score">${opt.score}</span><span class="label">${opt.label}</span>`;

            btn.onclick = () => selectBehaviorOption(btn, opt.score);

            optionsContainer.appendChild(btn);
        });
    }

    // Append Next Button (Hidden initially)
    const nextBtnContainer = document.createElement('div');
    nextBtnContainer.id = 'next-btn-container';
    nextBtnContainer.className = 'next-btn-container hidden';
    nextBtnContainer.style.marginTop = '2rem';
    nextBtnContainer.style.textAlign = 'right';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'primary-btn';
    nextBtn.style.display = 'inline-flex';
    nextBtn.style.width = 'auto';
    nextBtn.innerHTML = `
        Sıradaki Soru 
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 8px;">
            <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    `;
    nextBtn.onclick = handleNext;

    nextBtnContainer.appendChild(nextBtn);
    optionsContainer.parentNode.appendChild(nextBtnContainer); // Append to card, outside options grid
}

function cleanUpNextButton() {
    const existing = document.getElementById('next-btn-container');
    if (existing) existing.remove();
}


function selectKnowledgeOption(btn, question, answerIndex) {
    // Visual update
    const allBtns = optionsContainer.querySelectorAll('.option-button');
    allBtns.forEach(b => {
        b.style.borderColor = '#e5e7eb';
        b.style.background = 'white';
    });

    btn.style.borderColor = '#4f46e5';
    btn.style.background = '#eef2ff';

    // Store selection
    currentSelection = {
        type: 'knowledge',
        score: (answerIndex === question.correct) ? 1 : 0
    };

    showNextButton();
}

function selectBehaviorOption(btn, score) {
    // Visual update
    const allBtns = optionsContainer.querySelectorAll('.likert-option');
    allBtns.forEach(b => {
        b.style.borderColor = '#e5e7eb';
        b.style.background = 'white';
        b.querySelector('.score').style.background = '#f3f4f6';
        b.querySelector('.score').style.color = '#6b7280';
    });

    // Highlight selected
    btn.style.borderColor = '#10b981';
    btn.style.background = '#ecfdf5';
    btn.querySelector('.score').style.background = '#10b981';
    btn.querySelector('.score').style.color = 'white';

    // Store selection
    currentSelection = {
        type: 'behavior',
        score: score
    };

    showNextButton();
}

function showNextButton() {
    const container = document.getElementById('next-btn-container');
    if (container) container.classList.remove('hidden');
}

function handleNext() {
    if (!currentSelection) return;

    if (currentSelection.type === 'knowledge') {
        scores.knowledge += currentSelection.score;
    } else {
        scores.behavior += currentSelection.score;
    }

    loadQuestion(currentIndex + 1);
}

async function showResults() {
    cleanUpNextButton(); // Clean up final button
    // Calculate total
    const totalScore = scores.knowledge + scores.behavior;
    const level = determineLevel(totalScore);

    // Get Current User for Ownership
    const user = await getCurrentUser();
    const ownerId = user ? user.id : 'guest';

    // Save results to localStorage
    const results = {
        ownerId: ownerId, // Tag with owner
        knowledge: scores.knowledge,
        behavior: scores.behavior,
        totalScore: totalScore,
        level: level,
        userName: user?.user_metadata?.username || 'Kullanıcı',
        completedAt: new Date().toISOString()
    };
    localStorage.setItem('assessmentResults', JSON.stringify(results));

    // Redirect to report page
    window.location.href = 'report.html';
}
