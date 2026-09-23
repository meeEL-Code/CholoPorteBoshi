// ===== Notes Page Logic =====

const urlParams = new URLSearchParams(window.location.search);
const classId = urlParams.get('class') || '6';
const subjectId = urlParams.get('subject') || 'math';
const chapterId = urlParams.get('chapter') || 'ch1';
const chapterTitle = urlParams.get('title') || 'পাঠ্য বিষয়';

const subjectNames = {
    'math': 'গণিত', 'science': 'বিজ্ঞান', 'bangla': 'বাংলা',
    'english': 'English', 'ict': 'তথ্য ও যোগাযোগ প্রযুক্তি',
    'bgs': 'বাংলাদেশ ও বিশ্বপরিচয়', 'pe': 'শারীরিক শিক্ষা',
    'work': 'কর্ম ও জীবনমুখী শিক্ষা', 'islam': 'ইসলাম শিক্ষা',
    'hindu': 'হিন্দুধর্ম শিক্ষা', 'christian': 'খ্রীষ্টধর্ম শিক্ষা',
    'buddhist': 'বৌদ্ধধর্ম শিক্ষা'
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('chapterTitle').textContent = chapterTitle;
    document.getElementById('chapterSubtitle').textContent = (subjectNames[subjectId] || subjectId) + ' • ক্লাস ' + toBanglaNumber(classId);

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadTabContent(btn.dataset.tab);
        });
    });

    // Load initial tab
    loadTabContent('notes');
});

function loadTabContent(tab) {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = '<div class="notes-loading"><div class="spinner"></div><p>লোড হচ্ছে...</p></div>';

    const basePath = 'data/' + tab + '/class' + classId + '/' + subjectId + '/' + chapterId;

    if (tab === 'notes') {
        fetch(basePath + '.html')
            .then(r => { if (!r.ok) throw new Error('not found'); return r.text(); })
            .then(html => {
                contentArea.innerHTML = '<div class="note-content">' + html + '</div>';
            })
            .catch(() => showEmpty(tab));
    } else {
        fetch(basePath + '.json')
            .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
            .then(data => {
                if (tab === 'short') renderShort(contentArea, data);
                else if (tab === 'creative') renderCreative(contentArea, data);
                else if (tab === 'challenge') renderChallenge(contentArea, data);
            })
            .catch(() => showEmpty(tab));
    }
}

function renderShort(area, data) {
    if (!data || data.length === 0) return showEmpty('short');
    area.innerHTML = '<div class="short-list">' + data.map((item, i) =>
        '<div class="short-item">' +
            '<div class="short-num">' + toBanglaNumber(i + 1) + '</div>' +
            '<div class="short-body">' +
                '<p class="short-q">' + item.q + '</p>' +
                '<p class="short-a"><strong>উত্তর:</strong> ' + item.a + '</p>' +
            '</div>' +
        '</div>'
    ).join('') + '</div>';
}

function renderCreative(area, data) {
    if (!data || data.length === 0) return showEmpty('creative');
    area.innerHTML = data.map((item, i) =>
        '<div class="creative-item">' +
            '<div class="creative-header">' +
                '<span class="creative-num">সৃজনশীল ' + toBanglaNumber(i + 1) + '</span>' +
            '</div>' +
            '<div class="creative-stem"><strong>উদ্দীপক:</strong> ' + item.stem + '</div>' +
            item.questions.map(q =>
                '<div class="creative-q">' +
                    '<div class="creative-q-head">' +
                        '<span class="q-label">' + q.k + '.</span>' +
                        '<span class="q-text">' + q.q + '</span>' +
                        '<span class="q-marks">(' + toBanglaNumber(q.marks) + ')</span>' +
                    '</div>' +
                    '<div class="creative-ans"><strong>উত্তর:</strong> ' + q.a + '</div>' +
                '</div>'
            ).join('') +
        '</div>'
    ).join('');
}

function renderChallenge(area, data) {
    if (!data || data.length === 0) return showEmpty('challenge');
    area.innerHTML = '<div class="challenge-list">' + data.map((item, i) =>
        '<div class="challenge-item">' +
            '<div class="challenge-head">' +
                '<span class="challenge-num">' + toBanglaNumber(i + 1) + '</span>' +
                '<span class="challenge-badge">চ্যালেঞ্জ</span>' +
            '</div>' +
            '<p class="challenge-q">' + item.q + '</p>' +
            '<details class="challenge-details">' +
                '<summary>উত্তর দেখুন</summary>' +
                '<div class="challenge-a">' + item.a + '</div>' +
            '</details>' +
        '</div>'
    ).join('') + '</div>';
}

function showEmpty(tab) {
    const messages = {
        notes: { icon: 'fa-book-open', title: 'নোট এখনো যোগ করা হয়নি', desc: 'এই চ্যাপ্টারের নোট খুব শীঘ্রই আসছে!' },
        short: { icon: 'fa-list-check', title: 'সংক্ষিপ্ত প্রশ্ন নেই', desc: 'এই চ্যাপ্টারের সংক্ষিপ্ত প্রশ্ন এখনো যোগ করা হয়নি।' },
        creative: { icon: 'fa-pen-fancy', title: 'সৃজনশীল প্রশ্ন নেই', desc: 'এই চ্যাপ্টারের সৃজনশীল প্রশ্ন এখনো যোগ করা হয়নি।' },
        challenge: { icon: 'fa-fire', title: 'চ্যালেঞ্জ নেই', desc: 'এই চ্যাপ্টারের চ্যালেঞ্জ প্রশ্ন এখনো যোগ করা হয়নি।' }
    };
    const m = messages[tab] || messages.notes;
    document.getElementById('contentArea').innerHTML =
        '<div class="empty-state">' +
            '<i class="fas ' + m.icon + '"></i>' +
            '<h3>' + m.title + '</h3>' +
            '<p>' + m.desc + '</p>' +
        '</div>';
}

function toBanglaNumber(num) {
    const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return num.toString().split('').map(d => banglaDigits[parseInt(d)] ?? d).join('');
}
