// ===== Study Session Flow =====
// Note → MCQ → Result → More MCQ? → Wrong practice → Complete

const SESSION_BATCH = 20;          // প্রতি batch-এ MCQ সংখ্যা
const SESSION_TIME_PER_Q = 60;     // প্রতি প্রশ্নে সেকেন্ড

const urlParams = new URLSearchParams(window.location.search);
const CLASS_ID = urlParams.get('class') || '6';
const SUBJECT_ID = urlParams.get('subject') || 'math';
const CHAPTER_ID = urlParams.get('chapter') || 'ch1';
const CHAPTER_TITLE = urlParams.get('title') || 'পাঠ্য বিষয়';
const FROM_TARGET = urlParams.get('from') === 'target';
const SKIP_NOTES = urlParams.get('skipNotes') === '1';

let currentStep = 'notes';
let allQuestions = [];
let remainingPool = [];        // এখনো ব্যবহৃত হয়নি এমন প্রশ্ন
let currentQuestions = [];
let currentIndex = 0;
let userAnswers = [];
let timerInterval = null;
let timeRemaining = 0;
let startTime = 0;
let totalAttempted = 0;
let totalCorrect = 0;
let wrongQuestions = [];       // ভুল প্রশ্নগুলো (retry এর জন্য)
let completedTasks = 0;

// ===== Init =====
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('sessionTitle').textContent = CHAPTER_TITLE;
    document.getElementById('sessionSubtitle').textContent =
        'Class ' + toBangla(CLASS_ID) + ' • ' + getSubjectName(SUBJECT_ID);

    try {
        const url = 'data/mcq/class' + CLASS_ID + '/' + SUBJECT_ID + '/' + CHAPTER_ID + '.json';
        const res = await fetch(url);
        if (!res.ok) throw new Error('No questions');
        allQuestions = await res.json();
        remainingPool = shuffleArray([...allQuestions]);
    } catch (e) {
        console.error(e);
        showToast('এই চ্যাপ্টারের প্রশ্ন এখনো যোগ করা হয়নি', 'warning');
        setTimeout(() => location.href = 'target.html', 2000);
        return;
    }

    // Step 1: Notes (skip if requested)
    if (SKIP_NOTES) {
        startMcqRound();
    } else {
        await loadNotes();
        showStep('notes');
    }

    document.getElementById('noteOkBtn').addEventListener('click', () => {
        startMcqRound();
    });

    document.getElementById('sessionPrevBtn').addEventListener('click', showPrev);
    document.getElementById('sessionNextBtn').addEventListener('click', showNext);
    document.getElementById('sessionSubmitBtn').addEventListener('click', submitRound);

    document.getElementById('moreMcqBtn').addEventListener('click', startMcqRound);
    document.getElementById('finishBtn').addEventListener('click', finishSession);

    document.getElementById('retryWrongBtn').addEventListener('click', retryWrong);
    document.getElementById('skipWrongBtn').addEventListener('click', showCompletion);
});

// ===== Notes Step =====
async function loadNotes() {
    const basePath = 'data/notes/class' + CLASS_ID + '/' + SUBJECT_ID + '/' + CHAPTER_ID;

    try {
        const res = await fetch(basePath + '.html');
        if (res.ok) {
            const html = await res.text();
            document.getElementById('noteContent').innerHTML = html;
            return;
        }
    } catch (e) { /* fall through */ }

    // Fallback if no notes
    document.getElementById('noteContent').innerHTML =
        '<div class="session-empty-notes">' +
            '<i class="fas fa-book"></i>' +
            '<h3>নোট এখনো যোগ করা হয়নি</h3>' +
            '<p>তুমি চাইলে সরাসরি MCQ পরীক্ষা দিতে পারো</p>' +
        '</div>';
}

// ===== MCQ Round =====
function startMcqRound() {
    // Pick next batch
    const batch = Math.min(SESSION_BATCH, remainingPool.length);
    if (batch === 0) {
        showCompletion();
        return;
    }
    currentQuestions = remainingPool.splice(0, batch);

    // Reset round state
    currentIndex = 0;
    userAnswers = new Array(currentQuestions.length).fill(null);
    timeRemaining = currentQuestions.length * SESSION_TIME_PER_Q;
    startTime = Date.now();

    // Update UI
    document.getElementById('sessionTotalQ').textContent = toBangla(currentQuestions.length);
    document.getElementById('mcqTitle').textContent = 'ধাপ ২: MCQ পরীক্ষা';
    document.getElementById('mcqSubtitle').textContent = toBangla(currentQuestions.length) + 'টি প্রশ্ন';

    renderQuestion();
    startTimer();
    showStep('mcq');
}

function renderQuestion() {
    const q = currentQuestions[currentIndex];
    document.getElementById('sessionQuestionText').textContent = q.question;
    document.getElementById('sessionCurrentQ').textContent = toBangla(currentIndex + 1);

    const opts = document.getElementById('sessionOptions');
    opts.innerHTML = q.options.map((opt, idx) => {
        const sel = userAnswers[currentIndex] === idx;
        return '<button class="session-option ' + (sel ? 'selected' : '') + '" data-index="' + idx + '">' +
            '<span class="session-option-letter">' + ['ক','খ','গ','ঘ'][idx] + '</span>' +
            '<span>' + opt + '</span>' +
        '</button>';
    }).join('');

    opts.querySelectorAll('.session-option').forEach(btn => {
        btn.addEventListener('click', () => selectOption(parseInt(btn.dataset.index)));
    });

    updateProgress();

    document.getElementById('sessionPrevBtn').disabled = currentIndex === 0;
    if (currentIndex === currentQuestions.length - 1) {
        document.getElementById('sessionNextBtn').classList.add('hidden');
        document.getElementById('sessionSubmitBtn').classList.remove('hidden');
    } else {
        document.getElementById('sessionNextBtn').classList.remove('hidden');
        document.getElementById('sessionSubmitBtn').classList.add('hidden');
    }
}

function selectOption(idx) {
    userAnswers[currentIndex] = idx;
    document.querySelectorAll('.session-option').forEach((btn, i) => {
        btn.classList.toggle('selected', i === idx);
    });
}

function updateProgress() {
    const pct = ((currentIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('sessionProgressFill').style.width = pct + '%';
}

function showPrev() { if (currentIndex > 0) { currentIndex--; renderQuestion(); } }
function showNext() { if (currentIndex < currentQuestions.length - 1) { currentIndex++; renderQuestion(); } }

// ===== Timer =====
function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) { clearInterval(timerInterval); submitRound(); }
    }, 1000);
}

function updateTimerDisplay() {
    const m = Math.floor(timeRemaining / 60);
    const s = timeRemaining % 60;
    document.getElementById('sessionTimerText').textContent =
        toBangla(m) + ':' + (s < 10 ? '০' : '') + toBangla(s);
    const el = document.getElementById('sessionTimer');
    if (timeRemaining <= 60) el.classList.add('timer-warning');
    else el.classList.remove('timer-warning');
}

// ===== Submit Round =====
function submitRound() {
    clearInterval(timerInterval);

    let correct = 0;
    const roundWrong = [];

    currentQuestions.forEach((q, i) => {
        const ua = userAnswers[i];
        if (ua === q.correct) {
            correct++;
            totalCorrect++;
        } else {
            roundWrong.push({ ...q, userAnswer: ua });
            wrongQuestions.push({ ...q, userAnswer: ua });
        }
    });

    totalAttempted += currentQuestions.length;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    showResult(correct, currentQuestions.length, roundWrong, timeTaken);
}

function showResult(correct, total, roundWrong, timeTaken) {
    const pct = (correct / total) * 100;

    // Save result to history
    saveResult({
        date: new Date().toISOString(),
        class: CLASS_ID,
        subject: SUBJECT_ID,
        chapter: CHAPTER_ID,
        correct: correct,
        total: total,
        timeTaken: timeTaken
    });

    // Icon & message
    let icon, title, msg, colorClass;
    if (pct >= 80) { icon = 'trophy'; title = 'অসাধারণ!'; msg = 'তুমি দারুণ করেছ! এভাবেই এগিয়ে যাও।'; colorClass = 'icon-gold'; }
    else if (pct >= 60) { icon = 'thumbsUp'; title = 'ভালো করেছ!'; msg = 'আরেকটু চেষ্টা করলে আরও ভালো হবে।'; colorClass = 'icon-green'; }
    else if (pct >= 40) { icon = 'book'; title = 'চর্চা দরকার'; msg = 'ভুলগুলো আবার দেখো, তারপর আবার চেষ্টা করো।'; colorClass = 'icon-blue'; }
    else { icon = 'muscle'; title = 'হাল ছাড়বে না!'; msg = 'ভুলগুলো পড়ো, তারপর আবার দাও।'; colorClass = 'icon-red'; }

    document.getElementById('sessionResultIcon').innerHTML = getSVGIcon(icon);
    document.getElementById('sessionResultIcon').className = 'session-result-icon ' + colorClass;
    document.getElementById('sessionResultTitle').textContent = title;
    document.getElementById('sessionResultScore').textContent = toBangla(correct) + ' / ' + toBangla(total);
    document.getElementById('sessionResultMsg').textContent = msg;
    document.getElementById('sessionCorrect').textContent = toBangla(correct);
    document.getElementById('sessionWrong').textContent = toBangla(total - correct);

    const m = Math.floor(timeTaken / 60), s = timeTaken % 60;
    document.getElementById('sessionTime').textContent =
        toBangla(m) + ':' + (s < 10 ? '০' : '') + toBangla(s);

    // Show wrong review
    if (roundWrong.length > 0) {
        renderWrongReview(roundWrong);
        document.getElementById('wrongReviewSection').classList.remove('hidden');
    } else {
        document.getElementById('wrongReviewSection').classList.add('hidden');
    }

    // Show "more MCQ?" OR "completion"
    const askMore = document.getElementById('askMoreSection');
    const completion = document.getElementById('completionSection');
    const wrongPractice = document.getElementById('wrongPracticeSection');

    askMore.classList.add('hidden');
    completion.classList.add('hidden');
    wrongPractice.classList.add('hidden');

    if (roundWrong.length > 0) {
        // First: ask to retry wrong
        document.getElementById('wrongCountText').textContent = toBangla(roundWrong.length) + 'টি';
        wrongPractice.classList.remove('hidden');
    } else if (remainingPool.length > 0) {
        document.getElementById('remainingInfo').innerHTML = 'আরও <strong>' + toBangla(remainingPool.length) + 'টি</strong> প্রশ্ন বাকি আছে';
        askMore.classList.remove('hidden');
    } else {
        completion.classList.remove('hidden');
        markTaskComplete();
    }

    showStep('result');
}

function renderWrongReview(wrongList) {
    const container = document.getElementById('wrongReviewList');
    container.innerHTML = wrongList.map((q, i) =>
        '<div class="wrong-review-item">' +
            '<div class="wrong-review-head"><span>প্রশ্ন ' + toBangla(i + 1) + '</span><i class="fas fa-times"></i></div>' +
            '<p class="wrong-review-q">' + q.question + '</p>' +
            '<div class="wrong-review-opts">' +
                q.options.map((opt, idx) => {
                    let cls = '';
                    if (idx === q.correct) cls = 'correct';
                    else if (idx === q.userAnswer) cls = 'wrong';
                    return '<div class="wrong-review-opt ' + cls + '">' +
                        '<span class="session-option-letter">' + ['ক','খ','গ','ঘ'][idx] + '</span>' +
                        '<span>' + opt + '</span>' +
                    '</div>';
                }).join('') +
            '</div>' +
            '<div class="wrong-review-expl"><strong>ব্যাখ্যা:</strong> ' + q.explanation + '</div>' +
        '</div>'
    ).join('');
}

// ===== Retry Wrong =====
function retryWrong() {
    // Load wrong questions as new round
    const wrongSet = [...wrongQuestions];
    wrongQuestions = []; // clear, will re-add if wrong again

    currentQuestions = wrongSet;
    currentIndex = 0;
    userAnswers = new Array(currentQuestions.length).fill(null);
    timeRemaining = currentQuestions.length * SESSION_TIME_PER_Q;
    startTime = Date.now();

    document.getElementById('sessionTotalQ').textContent = toBangla(currentQuestions.length);
    document.getElementById('mcqTitle').textContent = 'ভুল প্রশ্ন আবার';
    document.getElementById('mcqSubtitle').textContent = toBangla(currentQuestions.length) + 'টি প্রশ্ন';

    renderQuestion();
    startTimer();
    showStep('mcq');
}

// ===== Finish =====
function showCompletion() {
    document.getElementById('askMoreSection').classList.add('hidden');
    document.getElementById('wrongPracticeSection').classList.add('hidden');
    document.getElementById('completionSection').classList.remove('hidden');
    markTaskComplete();
}

function markTaskComplete() {
    if (!FROM_TARGET) return;
    try {
        const plan = JSON.parse(localStorage.getItem('cpb_target_plan') || 'null');
        if (!plan) return;
        const today = new Date().toISOString().split('T')[0];

        plan.schedule.forEach(day => {
            if (day.date !== today) return;
            day.tasks.forEach((task, i) => {
                if (task.subject === SUBJECT_ID && task.chapter === CHAPTER_ID &&
                    (task.type === 'mcq' || task.type === 'notes')) {
                    if (!day.done) day.done = [];
                    if (!day.done.includes(i)) day.done.push(i);
                }
            });
        });
        localStorage.setItem('cpb_target_plan', JSON.stringify(plan));
    } catch (e) { console.error(e); }
}

function finishSession() {
    showCompletion();
}

// ===== Helpers =====
function showStep(step) {
    currentStep = step;
    ['stepNotes', 'stepMcq', 'stepResult'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    if (step === 'notes') document.getElementById('stepNotes').classList.remove('hidden');
    if (step === 'mcq') document.getElementById('stepMcq').classList.remove('hidden');
    if (step === 'result') document.getElementById('stepResult').classList.remove('hidden');

    // Progress badge
    const badge = document.getElementById('sessionProgress');
    const stepNum = step === 'notes' ? 1 : step === 'mcq' ? 2 : 3;
    badge.textContent = toBangla(stepNum) + '/৩';
    window.scrollTo(0, 0);
}

function saveResult(result) {
    const key = 'cpb_results';
    let results = JSON.parse(localStorage.getItem(key) || '[]');
    results.push(result);
    if (results.length > 100) results = results.slice(-100);
    localStorage.setItem(key, JSON.stringify(results));
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
}

function toBangla(num) {
    const d = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return num.toString().split('').map(x => d[parseInt(x)] ?? x).join('');
}

function getSubjectName(id) {
    const map = {
        'math': 'গণিত', 'physics': 'পদার্থবিজ্ঞান', 'chemistry': 'রসায়ন',
        'biology': 'জীববিজ্ঞান', 'bangla': 'বাংলা', 'english': 'English',
        'ict': 'ICT', 'bgs': 'BGS', 'science': 'বিজ্ঞান',
        'higher-math': 'উচ্চতর গণিত', 'accounting': 'হিসাববিজ্ঞান',
        'business': 'ব্যবসায় উদ্যোগ', 'finance': 'ফিন্যান্স'
    };
    return map[id] || id;
}

function getSVGIcon(name) {
    const icons = {
        trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
        thumbsUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>',
        book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
        muscle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'
    };
    return icons[name] || icons.book;
}
