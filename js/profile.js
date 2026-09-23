document.addEventListener('DOMContentLoaded', () => {
    const user = window.getUser ? window.getUser() : null;
    const profileFab = document.getElementById('profileFab');
    const drawer = document.getElementById('profileDrawer');

    if (!user) {
        const fabs = document.querySelector('.floating-fabs');
        if (fabs) fabs.classList.add('hidden');
        return;
    }

    const fabAvatar = document.getElementById('fabAvatar');
    if (fabAvatar && window.getAvatarSVG) fabAvatar.innerHTML = window.getAvatarSVG(user.avatar);

    const drawerAvatar = document.getElementById('drawerAvatar');
    if (drawerAvatar) drawerAvatar.innerHTML = window.getAvatarSVG(user.avatar);

    const drawerName = document.getElementById('drawerName');
    if (drawerName) drawerName.textContent = user.name || 'শিক্ষার্থী';

    const drawerSchool = document.getElementById('drawerSchool');
    if (drawerSchool) drawerSchool.textContent = user.school || '—';

    const drawerClass = document.getElementById('drawerClass');
    if (drawerClass) drawerClass.textContent = 'Class ' + toBangla(user.class);

    const drawerGroup = document.getElementById('drawerGroup');
    if (drawerGroup && user.group) {
        const groups = { science: 'বিজ্ঞান', commerce: 'ব্যবসায় শিক্ষা', arts: 'মানবিক' };
        drawerGroup.textContent = groups[user.group] || user.group;
        drawerGroup.style.display = 'inline-block';
    }

    loadDrawerStats();

    profileFab.addEventListener('click', () => {
        drawer.classList.remove('hidden');
        loadDrawerStats();
    });

    document.getElementById('closeDrawer').addEventListener('click', () => {
        drawer.classList.add('hidden');
    });

    drawer.addEventListener('click', (e) => {
        if (e.target === drawer) drawer.classList.add('hidden');
    });

    });

function loadDrawerStats() {
    const results = JSON.parse(localStorage.getItem('cpb_results') || '[]');
    const examsEl = document.getElementById('drawerExams');
    if (examsEl) examsEl.textContent = toBangla(results.length);

    let best = 0;
    results.forEach(r => {
        const p = r.total > 0 ? (r.correct / r.total) * 100 : 0;
        if (p > best) best = p;
    });
    const bestEl = document.getElementById('drawerBest');
    if (bestEl) bestEl.textContent = toBangla(Math.round(best)) + '%';

    const streakEl = document.getElementById('drawerStreak');
    if (streakEl) streakEl.textContent = toBangla(calcStreak(results));
}

function calcStreak(results) {
    if (results.length === 0) return 0;
    const dates = new Set();
    results.forEach(r => {
        const d = new Date(r.date);
        dates.add(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate());
    });
    let streak = 0;
    let check = new Date();
    const todayKey = check.getFullYear() + '-' + (check.getMonth() + 1) + '-' + check.getDate();
    if (!dates.has(todayKey)) check.setDate(check.getDate() - 1);
    while (true) {
        const key = check.getFullYear() + '-' + (check.getMonth() + 1) + '-' + check.getDate();
        if (dates.has(key)) { streak++; check.setDate(check.getDate() - 1); }
        else break;
    }
    return streak;
}

function toBangla(num) {
    const d = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return num.toString().split('').map(x => d[parseInt(x)] ?? x).join('');
}
