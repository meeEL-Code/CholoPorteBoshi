// ===== Home Dashboard Logic =====

let deviceId = localStorage.getItem('cpb_device_id');
if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('cpb_device_id', deviceId);
}

document.addEventListener('DOMContentLoaded', () => {
    setGreeting();
    loadHomeStats();
});

function setGreeting() {
    const hour = new Date().getHours();
    let greeting;
    if (hour < 5) greeting = 'শুভ রাত্রি! পড়তে বসি?';
    else if (hour < 12) greeting = 'শুভ সকাল! পড়া শুরু করি';
    else if (hour < 16) greeting = 'শুভ দুপুর! একটু পড়া হোক';
    else if (hour < 19) greeting = 'শুভ বিকেল! পড়তে বসি';
    else greeting = 'শুভ সন্ধ্যা! পড়া হোক';
    const el = document.getElementById('greeting');
    if (el) el.textContent = greeting;
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

    const subtitle = document.getElementById('bannerSubtitle');
    if (subtitle) {
        if (results.length === 0) subtitle.textContent = 'প্রথম পরীক্ষা দিয়ে শুরু করুন';
        else if (hasExamToday(results)) subtitle.textContent = 'আজকের পরীক্ষা সম্পন্ন ✓ আরেকবার দিতে পারেন';
        else if (streak > 0) subtitle.textContent = 'স্ট্রিক ধরে রাখুন — আজকের পরীক্ষা দিন';
        else subtitle.textContent = 'আবার শুরু করুন — আজকের পরীক্ষা দিন';
    }
}

function hasExamToday(results) {
    const t = new Date();
    const todayKey = t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();
    return results.some(r => {
        const d = new Date(r.date);
        const key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        return key === todayKey;
    });
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
