// ===== Home Dashboard Logic =====

let deviceId = localStorage.getItem('cpb_device_id');
if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('cpb_device_id', deviceId);
}

const BANGLA = { '6': '৬', '7': '৭', '8': '৮', '9': '৯', '10': '১০' };
const GROUP_NAMES = { science: 'বিজ্ঞান', commerce: 'ব্যবসায় শিক্ষা', arts: 'মানবিক' };

document.addEventListener('DOMContentLoaded', () => {
    loadWelcomeCard();
    loadHomeStats();
    loadMyClass();
    loadTargetProgress();

    // Remaining card click → navigate to baki.html
    const remainingCard = document.getElementById('remainingCard');
    if (remainingCard) {
        remainingCard.addEventListener('click', () => {
            location.href = 'baki.html';
        });
    }
});



function loadTargetProgress() {
    const plan = JSON.parse(localStorage.getItem('cpb_target_plan') || 'null');

    const remainingEl = document.getElementById('remainingVal');
    const daysEl = document.getElementById('examDaysVal');
    const completionEl = document.getElementById('completionVal');

    // Also update target card status
    const targetCard = document.getElementById('targetCard');
    const statusEl = targetCard ? targetCard.querySelector('.target-status') : null;

    if (!plan || !plan.schedule || plan.schedule.length === 0) {
        if (remainingEl) remainingEl.textContent = '০';
        if (daysEl) daysEl.textContent = '০';
        if (completionEl) completionEl.textContent = '০%';
        if (statusEl) statusEl.textContent = 'টার্গেট সেট করে রুটিন বানাও';
        return;
    }

    // 1. Remaining chapters/tasks
    let totalTasks = 0;
    let doneTasks = 0;

    plan.schedule.forEach(day => {
        totalTasks += day.tasks.length;
        doneTasks += (day.done || []).length;
    });

    // Remaining CHAPTERS
    const totalChapters = countUniqueChapters(plan);
    const completedChapters = countCompletedChapters(plan);
    const remainingChapters = Math.max(0, totalChapters - completedChapters);
    if (remainingEl) remainingEl.textContent = toBanglaNumber(remainingChapters);

    // 2. Days until exam
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(plan.examDate);
    examDate.setHours(0, 0, 0, 0);
    const daysLeft = Math.max(0, Math.ceil((examDate - today) / (1000 * 60 * 60 * 24)));

    if (daysEl) daysEl.textContent = toBanglaNumber(daysLeft);

    // 3. Completion %
    const completion = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
    if (completionEl) completionEl.textContent = toBanglaNumber(completion) + '%';

    // Update target card status
    if (statusEl) {
        const todayStr = today.toISOString().split('T')[0];
        let todayPending = 0;
        let todayDone = 0;
        let overdueCount = 0;

        plan.schedule.forEach(day => {
            const done = day.done || [];
            const pending = day.tasks.length - done.length;
            if (day.date === todayStr) {
                todayPending = pending;
                todayDone = done.length;
            } else if (day.date < todayStr && pending > 0) {
                overdueCount++;
            }
        });

        if (todayPending > 0) {
            statusEl.textContent = 'আজ ' + toBanglaNumber(todayPending) + 'টি কাজ বাকি';
            statusEl.style.color = '#C5A059';
        } else if (todayDone > 0) {
            statusEl.textContent = 'আজকের কাজ শেষ! ✓';
            statusEl.style.color = '#059669';
        } else if (overdueCount > 0) {
            statusEl.textContent = toBanglaNumber(overdueCount) + ' দিনের কাজ বাকি';
            statusEl.style.color = '#DC2626';
        } else {
            statusEl.textContent = 'শুরু করতে প্রস্তুত';
        }
    }
}

function countUniqueChapters(plan) {
    const seen = new Set();
    plan.schedule.forEach(day => {
        day.tasks.forEach(t => {
            seen.add(t.subject + '_' + t.chapter);
        });
    });
    return seen.size;
}

function countCompletedChapters(plan) {
    // A chapter is "complete" if BOTH notes + mcq tasks are done
    const chapterTasks = {}; // key -> { total, done }

    plan.schedule.forEach(day => {
        const done = day.done || [];
        day.tasks.forEach((t, i) => {
            const key = t.subject + '_' + t.chapter;
            if (!chapterTasks[key]) chapterTasks[key] = { total: 0, done: 0 };
            chapterTasks[key].total++;
            if (done.includes(i)) chapterTasks[key].done++;
        });
    });

    let completed = 0;
    Object.values(chapterTasks).forEach(c => {
        if (c.total > 0 && c.done >= c.total) completed++;
    });
    return completed;
}


function loadWelcomeCard() {
    const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');
    const hour = new Date().getHours();
    let greeting;
    if (hour < 5) greeting = 'শুভ রাত্রি';
    else if (hour < 12) greeting = 'শুভ সকাল';
    else if (hour < 16) greeting = 'শুভ দুপুর';
    else if (hour < 19) greeting = 'শুভ বিকেল';
    else greeting = 'শুভ সন্ধ্যা';

    const name = user.name || 'বন্ধু';
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) greetingEl.textContent = greeting + ', ' + name + '!';

    const classBn = BANGLA[user.class] || user.class || '';
    let subParts = [];
    if (classBn) subParts.push('Class ' + classBn);
    if ((user.class === '9' || user.class === '10') && user.group) {
        subParts.push(GROUP_NAMES[user.group] || user.group);
    }
    if (user.school) subParts.push(user.school);

    const subEl = document.getElementById('welcomeSub');
    if (subEl) subEl.textContent = subParts.join(' • ') || 'চলো পড়তে বসি';

    const avatarEl = document.getElementById('welcomeAvatar');
    if (avatarEl && window.getAvatarSVG && user.avatar) {
        avatarEl.innerHTML = window.getAvatarSVG(user.avatar);
    } else if (avatarEl) {
        avatarEl.innerHTML = '<div class="welcome-avatar-fallback">' + (name[0] || 'প') + '</div>';
    }
}

function loadMyClass() {
    const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');
    const userClass = user.class || '6';
    const grid = document.getElementById('myClassGrid');
    if (!grid) return;

    const className = 'Class ' + (BANGLA[userClass] || userClass);
    const classDesc = {
        '6': 'ষষ্ঠ শ্রেণি', '7': 'সপ্তম শ্রেণি', '8': 'অষ্টম শ্রেণি',
        '9': 'নবম শ্রেণি', '10': 'দশম শ্রেণি'
    };

    let groupBadge = '';
    if ((userClass === '9' || userClass === '10') && user.group) {
        groupBadge = '<span class="my-class-group-badge">' + (GROUP_NAMES[user.group] || user.group) + '</span>';
    }

    grid.innerHTML =
        '<a href="class.html?class=' + userClass + '" class="my-class-card">' +
            '<div class="my-class-icon">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>' +
            '</div>' +
            '<div class="my-class-info">' +
                '<h3>' + className + '</h3>' +
                '<p>' + (classDesc[userClass] || '') + ' • সব বিষয় দেখুন</p>' +
            '</div>' +
            groupBadge +
            '<i class="fas fa-chevron-right my-class-arrow"></i>' +
        '</a>' +
        '<p class="my-class-hint">' +
            '<i class="fas fa-info-circle"></i> ' +
            'ক্লাস পরিবর্তন করতে <strong>প্রোফাইল</strong> → <strong>প্রোফাইল সম্পাদনা</strong> এ যান' +
        '</p>';
}

function loadHomeStats() {
    const results = JSON.parse(localStorage.getItem('cpb_results') || '[]');
    const examCountEl = document.getElementById('examCountVal');
    if (examCountEl) examCountEl.textContent = toBanglaNumber(results.length);

    let bestPercent = 0;
    results.forEach(r => {
        const p = r.total > 0 ? (r.correct / r.total) * 100 : 0;
        if (p > bestPercent) bestPercent = p;
    });
    const bestEl = document.getElementById('bestScoreVal');
    if (bestEl) bestEl.textContent = toBanglaNumber(Math.round(bestPercent)) + '%';

    const streak = calculateStreak(results);
    const streakEl = document.getElementById('streakVal');
    if (streakEl) streakEl.textContent = toBanglaNumber(streak);
}

function calculateStreak(results) {
    if (results.length === 0) return 0;
    const dates = new Set();
    results.forEach(r => {
        const d = new Date(r.date);
        const key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        dates.add(key);
    });
    let streak = 0;
    let checkDate = new Date();
    const todayKey = checkDate.getFullYear() + '-' + (checkDate.getMonth() + 1) + '-' + checkDate.getDate();
    if (!dates.has(todayKey)) checkDate.setDate(checkDate.getDate() - 1);
    while (true) {
        const key = checkDate.getFullYear() + '-' + (checkDate.getMonth() + 1) + '-' + checkDate.getDate();
        if (dates.has(key)) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
        else break;
    }
    return streak;
}

function toBanglaNumber(num) {
    const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return num.toString().split('').map(d => banglaDigits[parseInt(d)] ?? d).join('');
}
