import { getFullQuestions } from '../data.js';
import { determineLevel } from '../quiz.js';
import { getCurrentUser } from '../auth.js';

// State
let currentIndex = 0;
let scores = { knowledge: 0, behavior: 0 };
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
    if (index >= questions.length) {
        showResults();
        return;
    }

    const q = questions[index];
    currentIndex = index;

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
            btn.onclick = () => handleKnowledgeAnswer(q, i);
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
            btn.onclick = () => handleBehaviorAnswer(opt.score);
            optionsContainer.appendChild(btn);
        });
    }
}

function handleKnowledgeAnswer(question, answerIndex) {
    if (answerIndex === question.correct) {
        scores.knowledge += 1;
    }
    loadQuestion(currentIndex + 1);
}

function handleBehaviorAnswer(score) {
    scores.behavior += score;
    loadQuestion(currentIndex + 1);
}

async function showResults() {
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
