// ===== Syllabus Page =====

let currentGroup = 'science';
let currentClass = '6';

const SUBJECT_NAMES = {
    'bangla': 'চারুপাঠ ও আনন্দপাঠ', 'bangla-grammar': 'বাংলা ব্যাকরণ ও নির্মিতি',
    'english': 'English For Today', 'english-grammar': 'English Grammar & Composition',
    'math': 'গণিত', 'ict': 'তথ্য ও যোগাযোগ প্রযুক্তি', 'bgs': 'বাংলাদেশ ও বিশ্বপরিচয়',
    'science': 'বিজ্ঞান', 'pe': 'শারীরিক শিক্ষা ও স্বাস্থ্য', 'work': 'কর্ম ও জীবনমুখী শিক্ষা',
    'islam': 'ইসলাম শিক্ষা', 'hindu': 'হিন্দুধর্ম শিক্ষা', 'christian': 'খ্রীষ্টধর্ম শিক্ষা',
    'buddhist': 'বৌদ্ধধর্ম শিক্ষা', 'physics': 'পদার্থবিজ্ঞান', 'chemistry': 'রসায়ন',
    'biology': 'জীববিজ্ঞান', 'higher-math': 'উচ্চতর গণিত', 'accounting': 'হিসাববিজ্ঞান',
    'business': 'ব্যবসায় উদ্যোগ', 'finance': 'ফিন্যান্স ও ব্যাংকিং',
    'history': 'বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা', 'geography': 'ভূগোল ও পরিবেশ',
    'civics': 'পৌরনীতি ও নাগরিকতা', 'economics': 'অর্থনীতি'
};

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');
    currentClass = user.class || '6';
    currentGroup = user.group || 'science';

    // User card
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar && window.getAvatarSVG) userAvatar.innerHTML = window.getAvatarSVG(user.avatar);

    document.getElementById('userName').textContent = user.name || 'শিক্ষার্থী';

    const metaParts = [];
    metaParts.push('Class ' + toBangla(currentClass));
    if ((currentClass === '9' || currentClass === '10') && user.group) {
        metaParts.push({ science: 'বিজ্ঞান', commerce: 'ব্যবসায় শিক্ষা', arts: 'মানবিক' }[user.group]);
    }
    if (user.school) metaParts.push(user.school);
    document.getElementById('userMeta').textContent = metaParts.join(' • ');

    document.getElementById('syllabusSubtitle').textContent = 'Class ' + toBangla(currentClass) + ' • সম্পূর্ণ সিলেবাস';

    // Group tabs (for class 9-10)
    const groupTabs = document.getElementById('groupTabs');
    if (currentClass === '9' || currentClass === '10') {
        groupTabs.classList.remove('hidden');
        document.querySelectorAll('.group-tab').forEach(tab => {
            if (tab.dataset.group === currentGroup) tab.classList.add('active');
            else tab.classList.remove('active');

            tab.addEventListener('click', () => {
                document.querySelectorAll('.group-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentGroup = tab.dataset.group;
                loadSyllabus();
            });
        });
    }

    loadSyllabus();
});

function loadSyllabus() {
    Promise.all([
        fetch('data/subjects.json').then(r => r.json()),
        fetch('data/chapters.json').then(r => r.json())
    ]).then(([subjectsData, chaptersData]) => {
        let subjects = [];

        if (currentClass === '9' || currentClass === '10') {
            const classData = subjectsData[currentClass] || {};
            const common = classData._common || [];
            const groupSubjects = classData[currentGroup] || [];
            subjects = [...common, ...groupSubjects];
        } else {
            subjects = subjectsData[currentClass] || [];
        }

        const chaptersForClass = chaptersData[currentClass] || {};

        renderSyllabus(subjects, chaptersForClass);

        // Calculate coverage
        const results = JSON.parse(localStorage.getItem('cpb_results') || '[]');
        calculateCoverage(subjects, chaptersForClass, results);
    }).catch(err => {
        console.error(err);
        document.getElementById('syllabusContent').innerHTML = '<p style="text-align:center;">ডেটা লোড করতে সমস্যা।</p>';
    });
}

function renderSyllabus(subjects, chaptersForClass) {
    const content = document.getElementById('syllabusContent');

    if (subjects.length === 0) {
        content.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>এই ক্লাসের সিলেবাস এখনো যোগ করা হয়নি।</p></div>';
        return;
    }

    content.innerHTML = subjects.map(sub => {
        const chapters = chaptersForClass[sub.id] || [];
        const chapterCount = chapters.length;
        const hasData = chapterCount > 0;

        return '<div class="syllabus-subject">' +
            '<div class="syllabus-subject-head">' +
                '<div class="syllabus-subject-icon"><i class="fas ' + sub.icon + '"></i></div>' +
                '<div class="syllabus-subject-info">' +
                    '<h3>' + sub.name + '</h3>' +
                    '<p>' + toBangla(chapterCount) + 'টি চ্যাপ্টার' + (hasData ? '' : ' (শীঘ্রই আসছে)') + '</p>' +
                '</div>' +
            '</div>' +
            (hasData ? 
                '<div class="syllabus-chapters">' +
                    chapters.map(ch =>
                        '<a href="notes.html?class=' + currentClass + '&subject=' + sub.id +
                        '&chapter=' + ch.id + '&title=' + encodeURIComponent(ch.title) + '" class="syllabus-chapter">' +
                            '<span class="syllabus-chapter-num">' + ch.num + '</span>' +
                            '<span class="syllabus-chapter-title">' + ch.title + '</span>' +
                            '<i class="fas fa-chevron-right"></i>' +
                        '</a>'
                    ).join('') +
                '</div>' : 
                '<div class="syllabus-empty-chapters"><i class="fas fa-clock"></i> চ্যাপ্টার তালিকা শীঘ্রই যোগ করা হবে</div>'
            ) +
        '</div>';
    }).join('');
}

function calculateCoverage(subjects, chaptersForClass, results) {
    let totalChapters = 0;
    let completedChapters = new Set();

    subjects.forEach(sub => {
        const chapters = chaptersForClass[sub.id] || [];
        totalChapters += chapters.length;

        chapters.forEach(ch => {
            // Check if user has any exam result for this chapter
            const hasResult = results.some(r => r.chapter === ch.id);
            if (hasResult) {
                completedChapters.add(sub.id + '_' + ch.id);
            }
        });
    });

    const percent = totalChapters === 0 ? 0 : Math.round((completedChapters.size / totalChapters) * 100);

    document.getElementById('progressPercent').textContent = toBangla(percent) + '%';
    document.getElementById('syllabusProgressFill').style.width = percent + '%';
}

function toBangla(num) {
    const d = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return num.toString().split('').map(x => d[parseInt(x)] ?? x).join('');
}
