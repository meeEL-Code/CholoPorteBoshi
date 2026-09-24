// ===== Baki (Remaining) Page =====

let CHAPTERS_CACHE = null;

const SUBJECT_NAMES = {
    'math': 'গণিত', 'physics': 'পদার্থবিজ্ঞান', 'chemistry': 'রসায়ন',
    'biology': 'জীববিজ্ঞান', 'bangla': 'বাংলা', 'bangla-grammar': 'বাংলা ব্যাকরণ',
    'english': 'ইংরেজি', 'english-grammar': 'English Grammar', 'ict': 'ICT',
    'bgs': 'BGS', 'science': 'বিজ্ঞান', 'pe': 'শারীরিক শিক্ষা',
    'work': 'কর্ম ও জীবনমুখী', 'islam': 'ইসলাম শিক্ষা', 'hindu': 'হিন্দুধর্ম',
    'christian': 'খ্রীষ্টধর্ম', 'buddhist': 'বৌদ্ধধর্ম',
    'higher-math': 'উচ্চতর গণিত', 'accounting': 'হিসাববিজ্ঞান',
    'business': 'ব্যবসায় উদ্যোগ', 'finance': 'ফিন্যান্স ও ব্যাংকিং',
    'history': 'ইতিহাস', 'geography': 'ভূগোল', 'civics': 'পৌরনীতি',
    'economics': 'অর্থনীতি'
};

document.addEventListener('DOMContentLoaded', async () => {
    const plan = JSON.parse(localStorage.getItem('cpb_target_plan') || 'null');
    const list = document.getElementById('bakiList');
    const subtitle = document.getElementById('bakiSubtitle');

    if (!plan || !plan.schedule || plan.schedule.length === 0) {
        subtitle.textContent = 'কোনো টার্গেট সেট করা হয়নি';
        list.innerHTML = '<div class="baki-empty">' +
            '<i class="fas fa-bullseye"></i>' +
            '<h3>কোনো প্রস্তুতি সেট করা হয়নি</h3>' +
            '<p>পরীক্ষার প্রস্তুতি সেট করে রুটিন বানাও</p>' +
            '<a href="target.html" class="btn-primary" style="text-decoration:none; width:auto; padding:12px 24px; display:inline-flex; margin-top:15px;">টার্গেট সেট করি</a>' +
        '</div>';
        return;
    }

    // Load chapters cache
    try {
        const res = await fetch('data/chapters.json');
        CHAPTERS_CACHE = await res.json();
    } catch (e) {
        CHAPTERS_CACHE = {};
    }

    const classData = CHAPTERS_CACHE[plan.class] || {};

    // Build chapter task status
    const chapterTasks = {};

    plan.schedule.forEach(day => {
        const done = day.done || [];
        day.tasks.forEach((t, i) => {
            const key = t.subject + '_' + t.chapter;
            if (!chapterTasks[key]) {
                chapterTasks[key] = {
                    subject: t.subject,
                    chapter: t.chapter,
                    total: 0,
                    doneCount: 0,
                    doneNotes: false,
                    doneMcq: false
                };
            }
            chapterTasks[key].total++;
            if (done.includes(i)) chapterTasks[key].doneCount++;
            if (t.type === 'notes' && done.includes(i)) chapterTasks[key].doneNotes = true;
            if (t.type === 'mcq' && done.includes(i)) chapterTasks[key].doneMcq = true;
        });
    });

    // Filter remaining
    const remaining = Object.values(chapterTasks).filter(c => c.doneCount < c.total);

    if (remaining.length === 0) {
        subtitle.textContent = 'সব পড়া শেষ!';
        list.innerHTML = '<div class="baki-empty">' +
            '<i class="fas fa-check-circle" style="color:#059669;"></i>' +
            '<h3>সব চ্যাপ্টার শেষ হয়েছে!</h3>' +
            '<p>তুমি পরীক্ষার জন্য প্রস্তুত</p>' +
        '</div>';
        return;
    }

    subtitle.textContent = toBangla(remaining.length) + 'টি চ্যাপ্টার বাকি';

    // Group by subject
    const grouped = {};
    remaining.forEach(c => {
        if (!grouped[c.subject]) grouped[c.subject] = [];
        grouped[c.subject].push(c);
    });

    list.innerHTML = Object.keys(grouped).map(subId => {
        const chapters = grouped[subId];
        const chaptersList = classData[subId] || [];

        return '<div class="baki-subject">' +
            '<div class="baki-subject-head">' +
                '<i class="fas fa-book" style="color:#C5A059;"></i>' +
                '<span class="baki-subject-name">' + (SUBJECT_NAMES[subId] || subId) + '</span>' +
                '<span class="baki-subject-count">' + toBangla(chapters.length) + 'টি</span>' +
            '</div>' +
            '<div class="baki-chapters">' +
                chapters.map(c => {
                    const chInfo = chaptersList.find(ch => ch.id === c.chapter);
                    const chTitle = chInfo ? (chInfo.num + '. ' + chInfo.title) : c.chapter;
                    const url = 'session.html?class=' + plan.class + '&subject=' + c.subject +
                              '&chapter=' + c.chapter + '&title=' + encodeURIComponent(chTitle) +
                              '&from=target';
                    return '<a href="' + url + '" class="baki-chapter">' +
                        '<div class="baki-chapter-info">' +
                            '<span class="baki-chapter-title">' + chTitle + '</span>' +
                            '<div class="baki-chapter-status">' +
                                '<span class="' + (c.doneNotes ? 'done' : 'pending') + '">' +
                                    '<i class="fas fa-' + (c.doneNotes ? 'check-circle' : 'circle') + '"></i> নোট' +
                                '</span>' +
                                '<span class="' + (c.doneMcq ? 'done' : 'pending') + '">' +
                                    '<i class="fas fa-' + (c.doneMcq ? 'check-circle' : 'circle') + '"></i> MCQ' +
                                '</span>' +
                            '</div>' +
                        '</div>' +
                        '<i class="fas fa-chevron-right"></i>' +
                    '</a>';
                }).join('') +
            '</div>' +
        '</div>';
    }).join('');
});

function toBangla(num) {
    const d = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return num.toString().split('').map(x => d[parseInt(x)] ?? x).join('');
}
