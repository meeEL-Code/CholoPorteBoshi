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
    updateExamBanner();
});

function updateExamBanner() {
    const subtitle = document.getElementById('bannerSubtitle');
    if (!subtitle) return;

    const plan = JSON.parse(localStorage.getItem('cpb_target_plan') || 'null');
    const results = JSON.parse(localStorage.getItem('cpb_results') || '[]');

    // No target plan yet
    if (!plan || !plan.schedule || plan.schedule.length === 0) {
        if (results.length === 0) {
            subtitle.textContent = 'প্রতিদিন নিজেকে যাচাই করুন';
        } else {
            subtitle.textContent = 'লক্ষ্য সেট করতে "পরীক্ষার প্রস্তুতি" তে যাও';
        }
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const schedule = plan.schedule;

    // Count pending tasks
    let todayPending = 0;
    let overdueDays = 0;
    let totalPending = 0;

    schedule.forEach(day => {
        const done = day.done || [];
        const pending = day.tasks.length - done.length;

        if (day.date < today && pending > 0) {
            overdueDays++;
            totalPending += pending;
        } else if (day.date === today) {
            todayPending = pending;
            totalPending += pending;
        }
    });

    // Dynamic message
    if (todayPending > 0) {
        subtitle.textContent = 'আজকের পড়া বাকি — ' + toBangla(todayPending) + 'টি কাজ';
    } else if (overdueDays > 0) {
        subtitle.textContent = toBangla(overdueDays) + ' দিনের পড়া বাকি';
    } else {
        subtitle.textContent = 'তুমি ভালো যাচ্ছো! এভাবেই এগিয়ে যাও';
    }
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
