// ===== Exam Logic =====

const CLASS6_MATH_CHAPTERS = [
    { id: "ch1", num: "১", title: "সংখ্যার গল্প" },
    { id: "ch2", num: "২", title: "দ্বিমাত্রিক বস্তুর গল্প" },
    { id: "ch3", num: "৩", title: "তথ্য অনুসন্ধান ও বিশ্লেষণ" },
    { id: "ch4", num: "৪", title: "মৌলিক উৎপাদকের গাছ" },
    { id: "ch5", num: "৫", title: "ঐকিক নিয়ম, শতকরা ও অনুপাত" },
    { id: "ch6", num: "৬", title: "পূর্ণসংখ্যার জগৎ" },
    { id: "ch7", num: "৭", title: "ভগ্নাংশের খেলা" },
    { id: "ch8", num: "৮", title: "অজানা রাশির জগৎ" },
    { id: "ch9", num: "৯", title: "সরল সমীকরণ" },
    { id: "ch10", num: "১০", title: "ত্রিমাত্রিক বস্তুর গল্প" }
];

const QUESTIONS_PER_EXAM = 20;
const TIME_PER_QUESTION = 60;

let allQuestions = [];
let currentQuestions = [];
let currentIndex = 0;
let userAnswers = [];
let timerInterval = null;
let timeRemaining = 0;
let startTime = 0;

document.addEventListener('DOMContentLoaded', () => {
    populateChapters();
    document.getElementById('startBtn').addEventListener('click', startExam);
    document.getElementById('prevBtn').addEventListener('click', showPrev);
    document.getElementById('nextBtn').addEventListener('click', showNext);
    document.getElementById('submitBtn').addEventListener('click', submitExam);
});

function populateChapters() {
    const chapterSelect = document.getElementById('chapterSelect');
    chapterSelect.innerHTML = CLASS6_MATH_CHAPTERS.map(ch =>
        `<option value="${ch.id}">${ch.num}. ${ch.title}</option>`
    ).join('');
}

async function startExam() {
    const classId = document.getElementById('classSelect').value;
    const subjectId = document.getElementById('subjectSelect').value;
    const chapterId = document.getElementById('chapterSelect').value;

    try {
        const url = `data/mcq/class${classId}/${subjectId}/${chapterId}.json`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Chapter not found');

        allQuestions = await response.json();
        currentQuestions = shuffleArray([...allQuestions]).slice(0, Math.min(QUESTIONS_PER_EXAM, allQuestions.length));

        currentIndex = 0;
        userAnswers = new Array(currentQuestions.length).fill(null);
        timeRemaining = currentQuestions.length * TIME_PER_QUESTION;
        startTime = Date.now();

        document.getElementById('setupScreen').classList.add('hidden');
        document.getElementById('examScreen').classList.remove('hidden');
        document.getElementById('totalQ').textContent = toBanglaNumber(currentQuestions.length);

        renderQuestion();
        startTimer();
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('দুঃখিত! এই চ্যাপ্টারের প্রশ্ন এখনো যোগ করা হয়নি।');
    }
}

function renderQuestion() {
    const q = currentQuestions[currentIndex];
    document.getElementById('questionText').textContent = q.question;
    document.getElementById('currentQ').textContent = toBanglaNumber(currentIndex + 1);

    const optionsList = document.getElementById('optionsList');
    optionsList.innerHTML = q.options.map((opt, idx) => {
        const isSelected = userAnswers[currentIndex] === idx;
        return `<button class="option-btn ${isSelected ? 'selected' : ''}" data-index="${idx}">
            <span class="option-letter">${['ক','খ','গ','ঘ'][idx]}</span>
            <span class="option-text">${opt}</span>
        </button>`;
    }).join('');

    optionsList.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => selectOption(parseInt(btn.dataset.index)));
    });

    updateProgress();

    document.getElementById('prevBtn').disabled = currentIndex === 0;
    if (currentIndex === currentQuestions.length - 1) {
        document.getElementById('nextBtn').classList.add('hidden');
        document.getElementById('submitBtn').classList.remove('hidden');
    } else {
        document.getElementById('nextBtn').classList.remove('hidden');
        document.getElementById('submitBtn').classList.add('hidden');
    }
}

function selectOption(idx) {
    userAnswers[currentIndex] = idx;
    document.querySelectorAll('.option-btn').forEach((btn, i) => {
        btn.classList.toggle('selected', i === idx);
    });
}

function updateProgress() {
    const percent = ((currentIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progressFill').style.width = percent + '%';
}

function showPrev() { if (currentIndex > 0) { currentIndex--; renderQuestion(); } }
function showNext() { if (currentIndex < currentQuestions.length - 1) { currentIndex++; renderQuestion(); } }

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) { clearInterval(timerInterval); submitExam(); }
    }, 1000);
}

function updateTimerDisplay() {
    const min = Math.floor(timeRemaining / 60);
    const sec = timeRemaining % 60;
    document.getElementById('timerText').textContent =
        `${toBanglaNumber(min)}:${sec < 10 ? '০' : ''}${toBanglaNumber(sec)}`;
    const timerEl = document.getElementById('timer');
    if (timeRemaining <= 60) timerEl.classList.add('timer-warning');
    else timerEl.classList.remove('timer-warning');
}

function submitExam() {
    clearInterval(timerInterval);
    let correct = 0;
    const reviewData = [];

    currentQuestions.forEach((q, i) => {
        const userAns = userAnswers[i];
        const isCorrect = userAns === q.correct;
        if (isCorrect) correct++;
        reviewData.push({
            question: q.question,
            options: q.options,
            userAnswer: userAns,
            correctAnswer: q.correct,
            explanation: q.explanation,
            isCorrect: isCorrect
        });
    });

    const total = currentQuestions.length;
    const wrong = total - correct;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    saveResult({
        date: new Date().toISOString(),
        chapter: document.getElementById('chapterSelect').value,
        correct, total, timeTaken
    });

    document.getElementById('examScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.remove('hidden');

    displayResult(correct, total, wrong, timeTaken);
    renderReview(reviewData);
    window.scrollTo(0, 0);
}

function displayResult(correct, total, wrong, timeTaken) {
    const percent = (correct / total) * 100;
    let icon, title, message;
    if (percent >= 80) { icon='🏆'; title='অসাধারণ!'; message='তুমি দারুণ করেছ! এভাবেই এগিয়ে যাও।'; }
    else if (percent >= 60) { icon='👍'; title='ভালো করেছ!'; message='আরেকটু চেষ্টা করলে আরও ভালো হবে।'; }
    else if (percent >= 40) { icon='📚'; title='চর্চা দরকার'; message='আরও পড়াশোনা করো, আবার পরীক্ষা দাও।'; }
    else { icon='💪'; title='হাল ছাড়বে না!'; message='আবার পড়ো এবং আবার চেষ্টা করো।'; }

    document.getElementById('resultIcon').textContent = icon;
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultScore').textContent = `${toBanglaNumber(correct)} / ${toBanglaNumber(total)}`;
    document.getElementById('resultMessage').textContent = message;
    document.getElementById('correctCount').textContent = toBanglaNumber(correct);
    document.getElementById('wrongCount').textContent = toBanglaNumber(wrong);
    const min = Math.floor(timeTaken / 60), sec = timeTaken % 60;
    document.getElementById('timeTaken').textContent =
        `${toBanglaNumber(min)}:${sec < 10 ? '০' : ''}${toBanglaNumber(sec)}`;
}

function renderReview(reviewData) {
    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = reviewData.map((r, i) => {
        const optionsHtml = r.options.map((opt, idx) => {
            let cls = 'review-option';
            if (idx === r.correctAnswer) cls += ' correct-answer';
            if (idx === r.userAnswer && idx !== r.correctAnswer) cls += ' wrong-answer';
            return `<div class="${cls}">
                <span class="option-letter">${['ক','খ','গ','ঘ'][idx]}</span>
                <span>${opt}</span>
            </div>`;
        }).join('');

        const userAnsText = r.userAnswer === null
            ? '<span class="not-answered">উত্তর দাওনি</span>'
            : (r.isCorrect ? '<span class="correct-text">✓ সঠিক</span>' : '<span class="wrong-text">✗ ভুল</span>');

        return `<div class="review-item">
            <div class="review-header">
                <span class="review-num">প্রশ্ন ${toBanglaNumber(i+1)}</span>
                ${userAnsText}
            </div>
            <p class="review-question">${r.question}</p>
            <div class="review-options">${optionsHtml}</div>
            <div class="review-explanation">
                <i class="fas fa-lightbulb"></i> <strong>ব্যাখ্যা:</strong> ${r.explanation}
            </div>
        </div>`;
    }).join('');
}

function saveResult(result) {
    const key = 'cpb_results';
    let results = JSON.parse(localStorage.getItem(key) || '[]');
    results.push(result);
    if (results.length > 50) results = results.slice(-50);
    localStorage.setItem(key, JSON.stringify(results));
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function toBanglaNumber(num) {
    const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return num.toString().split('').map(d => banglaDigits[parseInt(d)] ?? d).join('');
}
