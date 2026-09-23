// ===== Progress Page Logic =====

const CHAPTER_NAMES = {
    'ch1': 'সংখ্যার গল্প',
    'ch2': 'দ্বিমাত্রিক বস্তুর গল্প',
    'ch3': 'তথ্য অনুসন্ধান ও বিশ্লেষণ',
    'ch4': 'মৌলিক উৎপাদকের গাছ',
    'ch5': 'ঐকিক নিয়ম, শতকরা ও অনুপাত',
    'ch6': 'পূর্ণসংখ্যার জগৎ',
    'ch7': 'ভগ্নাংশের খেলা',
    'ch8': 'অজানা রাশির জগৎ',
    'ch9': 'সরল সমীকরণ',
    'ch10': 'ত্রিমাত্রিক বস্তুর গল্প'
};

const SUBJECT_NAMES = {
    'math': 'গণিত',
    'science': 'বিজ্ঞান',
    'bangla': 'বাংলা',
    'english': 'English',
    'ict': 'তথ্য ও যোগাযোগ প্রযুক্তি',
    'bgs': 'বাংলাদেশ ও বিশ্বপরিচয়',
    'islam': 'ইসলাম শিক্ষা',
    'hindu': 'হিন্দুধর্ম শিক্ষা',
    'christian': 'খ্রীষ্টধর্ম শিক্ষা',
    'buddhist': 'বৌদ্ধধর্ম শিক্ষা'
};

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    document.getElementById('resetBtn').addEventListener('click', resetProgress);
});

function loadProgress() {
    const results = JSON.parse(localStorage.getItem('cpb_results') || '[]');

    if (results.length === 0) {
        document.getElementById('emptyState').classList.remove('hidden');
        return;
    }

    document.getElementById('statsGrid').classList.remove('hidden');
    document.getElementById('historySection').classList.remove('hidden');
    document.getElementById('resetSection').classList.remove('hidden');

    // Total exams
    const totalExams = results.length;
    document.getElementById('totalExams').textContent = toBanglaNumber(totalExams);

    // Best score %
    let bestPercent = 0;
    let totalPercent = 0;
    results.forEach(r => {
        const p = r.total > 0 ? (r.correct / r.total) * 100 : 0;
        if (p > bestPercent) bestPercent = p;
        totalPercent += p;
    });
    document.getElementById('bestScore').textContent = toBanglaNumber(Math.round(bestPercent)) + '%';
    document.getElementById('avgScore').textContent = toBanglaNumber(Math.round(totalPercent / totalExams)) + '%';

    // Streak calculation
    const streak = calculateStreak(results);
    document.getElementById('streakCount').textContent = toBanglaNumber(streak);

    // History (newest first)
    renderHistory(results.slice().reverse());
}

function calculateStreak(results) {
    if (results.length === 0) return 0;

    // Get unique dates (in local YYYY-MM-DD)
    const dates = new Set();
    results.forEach(r => {
        const d = new Date(r.date);
        const key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        dates.add(key);
    });

    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);

    // If no exam today, start from yesterday
    const todayKey = checkDate.getFullYear() + '-' + (checkDate.getMonth() + 1) + '-' + checkDate.getDate();
    if (!dates.has(todayKey)) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    // Count consecutive days
    while (true) {
        const key = checkDate.getFullYear() + '-' + (checkDate.getMonth() + 1) + '-' + checkDate.getDate();
        if (dates.has(key)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

function renderHistory(results) {
    const historyList = document.getElementById('historyList');

    historyList.innerHTML = results.map(r => {
        const percent = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
        const dateObj = new Date(r.date);
        const dateStr = formatBanglaDate(dateObj);

        let scoreClass, scoreLabel;
        if (percent >= 80) { scoreClass = 'score-excellent'; scoreLabel = 'অসাধারণ'; }
        else if (percent >= 60) { scoreClass = 'score-good'; scoreLabel = 'ভালো'; }
        else if (percent >= 40) { scoreClass = 'score-ok'; scoreLabel = 'মাঝারি'; }
        else { scoreClass = 'score-poor'; scoreLabel = 'দুর্বল'; }

        const chapterName = CHAPTER_NAMES[r.chapter] || r.chapter;

        return '<div class="history-item ' + scoreClass + '">' +
            '<div class="history-left">' +
                '<div class="history-chapter">' + chapterName + '</div>' +
                '<div class="history-date">' + dateStr + '</div>' +
            '</div>' +
            '<div class="history-right">' +
                '<div class="history-score">' + toBanglaNumber(r.correct) + '/' + toBanglaNumber(r.total) + '</div>' +
                '<div class="history-percent">' + toBanglaNumber(percent) + '%</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function formatBanglaDate(date) {
    const banglaMonths = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
    const day = toBanglaNumber(date.getDate());
    const month = banglaMonths[date.getMonth()];
    const year = toBanglaNumber(date.getFullYear());
    let hour = date.getHours();
    let ampm = 'AM';
    if (hour >= 12) { ampm = 'PM'; if (hour > 12) hour -= 12; }
    if (hour === 0) hour = 12;
    const min = toBanglaNumber(date.getMinutes().toString().padStart(2, '0'));
    const hourBn = toBanglaNumber(hour);
    return day + ' ' + month + ', ' + year + ' • ' + hourBn + ':' + min + ' ' + ampm;
}

function resetProgress() {
    if (confirm('তুমি কি সত্যিই সব রেকর্ড মুছে ফেলতে চাও? এটি ফিরিয়ে আনা যাবে না।')) {
        localStorage.removeItem('cpb_results');
        location.reload();
    }
}

function toBanglaNumber(num) {
    const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return num.toString().split('').map(d => banglaDigits[parseInt(d)] ?? d).join('');
}
