// ===== Exam Logic (Multi-Class) =====

// ===== Chapter Map by Class and Subject =====
const CHAPTER_MAP = {
    '6': {
        'math': [
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
        ]
    },
    '9': {
        'math': [
            { id: "ch1", num: "১", title: "বাস্তব সংখ্যা" },
            { id: "ch2", num: "২", title: "সেট ও ফাংশন" },
            { id: "ch3", num: "৩", title: "বীজগাণিতিক রাশি" },
            { id: "ch4", num: "৪", title: "সূচক ও লগারিদম" },
            { id: "ch5", num: "৫", title: "এক চলকবিশিষ্ট সমীকরণ" },
            { id: "ch6", num: "৬", title: "রেখা, কোণ ও ত্রিভুজ" },
            { id: "ch7", num: "৭", title: "ব্যবহারিক জ্যামিতি" },
            { id: "ch8", num: "৮", title: "বৃত্ত" },
            { id: "ch9", num: "৯", title: "ত্রিকোণমিতি" },
            { id: "ch10", num: "১০", title: "পরিসংখ্যান" }
        ]
    }
};

// ===== Subject names =====
const SUBJECT_NAMES = {
    'math': 'গণিত',
    'science': 'বিজ্ঞান',
    'physics': 'পদার্থবিজ্ঞান',
    'chemistry': 'রসায়ন',
    'biology': 'জীববিজ্ঞান',
    'bangla': 'বাংলা',
    'english': 'English',
    'ict': 'তথ্য ও যোগাযোগ প্রযুক্তি'
};

const QUESTIONS_PER_EXAM = 20;
const TIME_PER_QUESTION = 60;

let allQuestions = [];
let currentQuestions = [];
let currentIndex = 0;
let userAnswers = [];
let timerInterval = null;
let timeRemaining = 0;
let startTime = 0;

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    // Set default class from user profile
    const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');
    const userClass = user.class || '6';

    const classSelect = document.getElementById('classSelect');
    if (classSelect && (userClass === '6' || userClass === '9')) {
        classSelect.value = userClass;
    }

    updateSubjectOptions();
    updateChapters();

    classSelect.addEventListener('change', () => {
        updateSubjectOptions();
        updateChapters();
    });

    document.getElementById('subjectSelect').addEventListener('change', updateChapters);
    document.getElementById('startBtn').addEventListener('click', startExam);
    document.getElementById('prevBtn').addEventListener('click', showPrev);
    document.getElementById('nextBtn').addEventListener('click', showNext);
    document.getElementById('submitBtn').addEventListener('click', submitExam);
});

function updateSubjectOptions() {
    const cls = document.getElementById('classSelect').value;
    const subjectSelect = document.getElementById('subjectSelect');
    const subjectsForClass = CHAPTER_MAP[cls] || {};

    subjectSelect.innerHTML = Object.keys(subjectsForClass).map(sid =>
        '<option value="' + sid + '">' + (SUBJECT_NAMES[sid] || sid) + '</option>'
    ).join('');

    if (subjectSelect.options.length === 0) {
        subjectSelect.innerHTML = '<option value="">— কোন বিষয় নেই —</option>';
    }
}

function updateChapters() {
    const cls = document.getElementById('classSelect').value;
    const subjectId = document.getElementById('subjectSelect').value;
    const chapterSelect = document.getElementById('chapterSelect');

    const chapters = (CHAPTER_MAP[cls] && CHAPTER_MAP[cls][subjectId]) || [];

    if (chapters.length === 0) {
        chapterSelect.innerHTML = '<option value="">— কোন চ্যাপ্টার নেই —</option>';
        return;
    }

    chapterSelect.innerHTML = chapters.map(ch =>
        '<option value="' + ch.id + '">' + ch.num + '. ' + ch.title + '</option>'
    ).join('');
}

// ===== Start Exam =====
async function startExam() {
    const classId = document.getElementById('classSelect').value;
    const subjectId = document.getElementById('subjectSelect').value;
    const chapterId = document.getElementById('chapterSelect').value;

    if (!chapterId) {
        alert('কোনো চ্যাপ্টার নেই। অন্য ক্লাস বা বিষয় বেছে নাও।');
        return;
    }

    try {
        const url = 'data/mcq/class' + classId + '/' + subjectId + '/' + chapterId + '.json';
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
        console.error(error);
        alert('দুঃখিত! এই চ্যাপ্টারের প্রশ্ন এখনো যোগ করা হয়নি।');
    }
}

// ===== Render Question =====
function renderQuestion() {
    const q = currentQuestions[currentIndex];
    document.getElementById('questionText').textContent = q.question;
    document.getElementById('currentQ').textContent = toBanglaNumber(currentIndex + 1);

    const optionsList = document.getElementById('optionsList');
    optionsList.innerHTML = q.options.map((opt, idx) => {
        const isSelected = userAnswers[currentIndex] === idx;
        return '<button class="option-btn ' + (isSelected ? 'selected' : '') + '" data-index="' + idx + '">' +
            '<span class="option-letter">' + ['ক','খ','গ','ঘ'][idx] + '</span>' +
            '<span class="option-text">' + opt + '</span>' +
        '</button>';
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

// ===== Timer =====
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
        toBanglaNumber(min) + ':' + (sec < 10 ? '০' : '') + toBanglaNumber(sec);
    const timerEl = document.getElementById('timer');
    if (timeRemaining <= 60) timerEl.classList.add('timer-warning');
    else timerEl.classList.remove('timer-warning');
}

// ===== Submit =====
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
        class: document.getElementById('classSelect').value,
        subject: document.getElementById('subjectSelect').value,
        chapter: document.getElementById('chapterSelect').value,
        correct: correct, total: total, timeTaken: timeTaken
    });

    document.getElementById('examScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.remove('hidden');

    displayResult(correct, total, wrong, timeTaken);
    renderReview(reviewData);
    window.scrollTo(0, 0);
}

// ===== SVG Icons =====
const SVG = {
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    thumbsUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    muscle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>'
};

function displayResult(correct, total, wrong, timeTaken) {
    const percent = (correct / total) * 100;
    let svgIcon, title, message, colorClass;
    if (percent >= 80) { svgIcon = SVG.trophy; title = 'অসাধারণ!'; message = 'তুমি দারুণ করেছ! এভাবেই এগিয়ে যাও।'; colorClass = 'icon-gold'; }
    else if (percent >= 60) { svgIcon = SVG.thumbsUp; title = 'ভালো করেছ!'; message = 'আরেকটু চেষ্টা করলে আরও ভালো হবে।'; colorClass = 'icon-green'; }
    else if (percent >= 40) { svgIcon = SVG.book; title = 'চর্চা দরকার'; message = 'আরও পড়াশোনা করো, আবার পরীক্ষা দাও।'; colorClass = 'icon-blue'; }
    else { svgIcon = SVG.muscle; title = 'হাল ছাড়বে না!'; message = 'আবার পড়ো এবং আবার চেষ্টা করো।'; colorClass = 'icon-red'; }

    const iconEl = document.getElementById('resultIcon');
    iconEl.innerHTML = svgIcon;
    iconEl.className = 'result-icon ' + colorClass;

    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultScore').textContent = toBanglaNumber(correct) + ' / ' + toBanglaNumber(total);
    document.getElementById('resultMessage').textContent = message;
    document.getElementById('correctCount').textContent = toBanglaNumber(correct);
    document.getElementById('wrongCount').textContent = toBanglaNumber(wrong);
    const min = Math.floor(timeTaken / 60), sec = timeTaken % 60;
    document.getElementById('timeTaken').textContent =
        toBanglaNumber(min) + ':' + (sec < 10 ? '০' : '') + toBanglaNumber(sec);

    if (window.showToast) {
        if (percent >= 80) showToast('অসাধারণ! ' + toBanglaNumber(correct) + '/' + toBanglaNumber(total), 'success');
        else if (percent >= 60) showToast('ভালো করেছ! ' + toBanglaNumber(correct) + '/' + toBanglaNumber(total), 'info');
        else showToast('আরও চেষ্টা করো!', 'warning');
    }
}

function renderReview(reviewData) {
    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = reviewData.map((r, i) => {
        const optionsHtml = r.options.map((opt, idx) => {
            let cls = 'review-option';
            if (idx === r.correctAnswer) cls += ' correct-answer';
            if (idx === r.userAnswer && idx !== r.correctAnswer) cls += ' wrong-answer';
            return '<div class="' + cls + '">' +
                '<span class="option-letter">' + ['ক','খ','গ','ঘ'][idx] + '</span>' +
                '<span>' + opt + '</span>' +
            '</div>';
        }).join('');

        let userAnsHtml;
        if (r.userAnswer === null) userAnsHtml = '<span class="not-answered">' + SVG.dash + ' উত্তর দাওনি</span>';
        else if (r.isCorrect) userAnsHtml = '<span class="correct-text">' + SVG.check + ' সঠিক</span>';
        else userAnsHtml = '<span class="wrong-text">' + SVG.cross + ' ভুল</span>';

        return '<div class="review-item">' +
            '<div class="review-header">' +
                '<span class="review-num">প্রশ্ন ' + toBanglaNumber(i+1) + '</span>' +
                userAnsHtml +
            '</div>' +
            '<p class="review-question">' + r.question + '</p>' +
            '<div class="review-options">' + optionsHtml + '</div>' +
            '<div class="review-explanation">' +
                '<span class="bulb-icon">' + SVG.bulb + '</span> <strong>ব্যাখ্যা:</strong> ' + r.explanation +
            '</div>' +
        '</div>';
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
        const temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
    }
    return arr;
}

function toBanglaNumber(num) {
    const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return num.toString().split('').map(d => banglaDigits[parseInt(d)] ?? d).join('');
}
