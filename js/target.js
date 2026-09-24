// ===== Target Preparation Planner =====

let selectedSubjects = {}; // { subjectId: [chapterIds] }
let userClass = '6';

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');
    userClass = user.class || '6';

    // Class display
    document.getElementById('classInfo').textContent = 'Class ' + toBangla(userClass) +
        (user.group ? ' • ' + ({science:'বিজ্ঞান',commerce:'ব্যবসায় শিক্ষা',arts:'মানবিক'}[user.group]) : '');

    // Check if a plan already exists
    const existingPlan = localStorage.getItem('cpb_target_plan');
    if (existingPlan) {
        showPlanView(JSON.parse(existingPlan));
    } else {
        setupForm();
    }
});

function setupForm() {
    // Date picker min = tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('examDate').min = tomorrow.toISOString().split('T')[0];

    loadSubjects();

    document.getElementById('examDate').addEventListener('change', updateDaysHint);
    document.getElementById('examName').addEventListener('input', validateForm);
    document.getElementById('savePlanBtn').addEventListener('click', savePlan);
}

async function loadSubjects() {
    try {
        const subjectsRes = await fetch('data/subjects.json');
        const subjectsData = await subjectsRes.json();

        const chaptersRes = await fetch('data/chapters.json');
        const chaptersData = await chaptersRes.json();

        let subjects = [];

        if (userClass === '9' || userClass === '10') {
            const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');
            const group = user.group || 'science';
            const cls = subjectsData[userClass] || {};
            subjects = [...(cls._common || []), ...(cls[group] || [])];
        } else {
            subjects = subjectsData[userClass] || [];
        }

        const chaptersForClass = chaptersData[userClass] || {};
        renderSubjects(subjects, chaptersForClass);
    } catch (err) {
        console.error(err);
        document.getElementById('subjectsContainer').innerHTML =
            '<p style="text-align:center;color:#666;">ডেটা লোড করতে সমস্যা হয়েছে।</p>';
    }
}

function renderSubjects(subjects, chaptersForClass) {
    const container = document.getElementById('subjectsContainer');

    container.innerHTML = subjects.map(sub => {
        const chapters = chaptersForClass[sub.id] || [];
        const hasChapters = chapters.length > 0;

        return '<div class="target-subject" data-subject="' + sub.id + '">' +
            '<label class="target-subject-head">' +
                '<input type="checkbox" class="subject-cb" value="' + sub.id + '"' +
                    (hasChapters ? '' : ' disabled') + '>' +
                '<i class="fas ' + sub.icon + '"></i>' +
                '<span class="target-subject-name">' + sub.name + '</span>' +
                '<span class="target-chapter-count">' + toBangla(chapters.length) + 'টি</span>' +
            '</label>' +
            (hasChapters ?
                '<div class="target-chapters hidden">' +
                    chapters.map(ch =>
                        '<label class="target-chapter-item">' +
                            '<input type="checkbox" class="chapter-cb" data-subject="' + sub.id + '" value="' + ch.id + '">' +
                            '<span class="chapter-num">' + ch.num + '</span>' +
                            '<span>' + ch.title + '</span>' +
                        '</label>'
                    ).join('') +
                '</div>' : ''
            ) +
        '</div>';
    }).join('');

    // Subject check → toggle chapters
    container.querySelectorAll('.subject-cb').forEach(cb => {
        cb.addEventListener('change', () => {
            const card = cb.closest('.target-subject');
            const chapDiv = card.querySelector('.target-chapters');
            const chapters = chapDiv ? chapDiv.querySelectorAll('.chapter-cb') : [];

            if (cb.checked) {
                if (chapDiv) chapDiv.classList.remove('hidden');
                chapters.forEach(c => c.checked = true);
            } else {
                if (chapDiv) chapDiv.classList.add('hidden');
                chapters.forEach(c => c.checked = false);
            }

            updateSelectedSubjects();
        });
    });

    // Chapter toggle updates parent subject checkbox
    container.querySelectorAll('.chapter-cb').forEach(cb => {
        cb.addEventListener('change', () => {
            const subjectId = cb.dataset.subject;
            const subjectCb = container.querySelector('.subject-cb[value="' + subjectId + '"]');
            const allChapters = container.querySelectorAll('.chapter-cb[data-subject="' + subjectId + '"]');
            const checkedChapters = container.querySelectorAll('.chapter-cb[data-subject="' + subjectId + '"]:checked');

            if (checkedChapters.length === allChapters.length) subjectCb.checked = true;
            else if (checkedChapters.length === 0) subjectCb.checked = false;
            else subjectCb.indeterminate = true;

            updateSelectedSubjects();
        });
    });
}

function updateSelectedSubjects() {
    selectedSubjects = {};
    document.querySelectorAll('.chapter-cb:checked').forEach(cb => {
        const sub = cb.dataset.subject;
        if (!selectedSubjects[sub]) selectedSubjects[sub] = [];
        selectedSubjects[sub].push(cb.value);
    });
    validateForm();
}

function updateDaysHint() {
    const dateVal = document.getElementById('examDate').value;
    if (!dateVal) {
        document.getElementById('daysHint').textContent = 'তারিখ নির্বাচন করলে দিন গণনা হবে';
        return;
    }
    const examDate = new Date(dateVal);
    const today = new Date();
    today.setHours(0,0,0,0);
    examDate.setHours(0,0,0,0);
    const days = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

    const totalChapters = Object.values(selectedSubjects).reduce((s, arr) => s + arr.length, 0);

    if (days <= 0) {
        document.getElementById('daysHint').textContent = 'তারিখ আজ বা আগের তারিখ হতে হবে না';
    } else if (totalChapters === 0) {
        document.getElementById('daysHint').textContent = days + ' দিন বাকি';
    } else {
        document.getElementById('daysHint').textContent =
            days + ' দিনে ' + toBangla(totalChapters) + 'টি চ্যাপ্টার শেষ করতে হবে';
    }
    validateForm();
}

function validateForm() {
    const name = document.getElementById('examName').value.trim();
    const date = document.getElementById('examDate').value;
    const totalChapters = Object.values(selectedSubjects).reduce((s, arr) => s + arr.length, 0);

    document.getElementById('savePlanBtn').disabled = !(name && date && totalChapters > 0);
}

// ===== Save Plan =====
function savePlan() {
    const examName = document.getElementById('examName').value.trim();
    const examDate = document.getElementById('examDate').value;
    const dailyTime = parseInt(document.getElementById('dailyTime').value);

    const totalChapters = Object.values(selectedSubjects).reduce((s, arr) => s + arr.length, 0);

    // Calculate days
    const today = new Date();
    today.setHours(0,0,0,0);
    const exam = new Date(examDate);
    exam.setHours(0,0,0,0);
    const days = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));

    // Build task list: each chapter = 2 tasks (notes + MCQ)
    const allTasks = [];
    Object.keys(selectedSubjects).forEach(sub => {
        selectedSubjects[sub].forEach(ch => {
            allTasks.push({ subject: sub, chapter: ch, type: 'notes' });
            allTasks.push({ subject: sub, chapter: ch, type: 'mcq' });
        });
    });

    const totalTasks = allTasks.length;
    const tasksPerDay = Math.max(2, Math.ceil(totalTasks / days));

    // Build daily schedule
    const schedule = [];
    let taskIndex = 0;
    for (let d = 0; d < days && taskIndex < totalTasks; d++) {
        const dateObj = new Date(today);
        dateObj.setDate(dateObj.getDate() + d);
        const dateKey = dateObj.toISOString().split('T')[0];

        const dayTasks = allTasks.slice(taskIndex, taskIndex + tasksPerDay);
        taskIndex += tasksPerDay;

        schedule.push({ date: dateKey, tasks: dayTasks, done: [] });
    }

    const plan = {
        examName: examName,
        examDate: examDate,
        dailyTime: dailyTime,
        createdAt: new Date().toISOString(),
        subjects: selectedSubjects,
        schedule: schedule,
        class: userClass
    };

    localStorage.setItem('cpb_target_plan', JSON.stringify(plan));
    if (window.showToast) showToast('রুটিন তৈরি হয়েছে!', 'success');

    setTimeout(() => location.reload(), 800);
}

// ===== Show Plan =====
async function showPlanView(plan) {
    await loadChaptersCache();
    document.getElementById('setupForm').classList.add('hidden');
    document.getElementById('planView').classList.remove('hidden');

    document.getElementById('planExamName').textContent = plan.examName;

    const examDate = new Date(plan.examDate);
    document.getElementById('planExamDate').textContent = formatBanglaDate(examDate);

    // Days left
    const today = new Date();
    today.setHours(0,0,0,0);
    const exam = new Date(plan.examDate);
    exam.setHours(0,0,0,0);
    const daysLeft = Math.max(0, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)));
    document.getElementById('daysLeft').textContent = toBangla(daysLeft);

    // Total chapters
    let totalCh = 0;
    Object.values(plan.subjects).forEach(arr => totalCh += arr.length);
    document.getElementById('totalChapters').textContent = toBangla(totalCh);

    // Progress (tasks done / total)
    let totalTasks = 0, doneTasks = 0;
    plan.schedule.forEach(day => {
        totalTasks += day.tasks.length;
        doneTasks += (day.done || []).length;
    });
    const pct = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
    document.getElementById('progressPct').textContent = toBangla(pct) + '%';
    document.getElementById('planProgressFill').style.width = pct + '%';

    // Today's tasks
    const todayKey = new Date().toISOString().split('T')[0];
    const tomorrowKey = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const todayDay = plan.schedule.find(d => d.date === todayKey);
    const tomorrowDay = plan.schedule.find(d => d.date === tomorrowKey);

    renderTasks('todayTasks', todayDay, plan, true);
    renderTasks('tomorrowTasks', tomorrowDay, plan, false);

    // Full schedule
    const scheduleContainer = document.getElementById('fullSchedule');
    scheduleContainer.innerHTML = plan.schedule.map((day, i) =>
        '<div class="schedule-day">' +
            '<div class="schedule-day-head">' +
                '<span class="schedule-day-num">Day ' + toBangla(i + 1) + '</span>' +
                '<span class="schedule-day-date">' + formatShortDate(new Date(day.date)) + '</span>' +
                '<span class="schedule-day-count">' + toBangla(day.tasks.length) + 'টি</span>' +
            '</div>' +
        '</div>'
    ).join('');

    // Reset button
    document.getElementById('resetPlanBtn').addEventListener('click', () => {
        if (confirm('রুটিন মুছে ফেলতে চাও?')) {
            localStorage.removeItem('cpb_target_plan');
            location.reload();
        }
    });
}

function renderTasks(containerId, day, plan, isToday) {
    const container = document.getElementById(containerId);

    if (!day) {
        container.innerHTML = '<div class="task-empty">কোনো কাজ নেই</div>';
        return;
    }

    container.innerHTML = day.tasks.map((task, i) => {
        const isDone = (day.done || []).includes(i);
        const subjectName = getSubjectName(task.subject, plan);
        const chapterName = getChapterName(task.subject, task.chapter);

        let actionUrl = '';
        if (task.type === 'notes') {
            actionUrl = 'session.html?class=' + plan.class + '&subject=' + task.subject +
                       '&chapter=' + task.chapter + '&title=' + encodeURIComponent(chapterName) +
                       '&from=target';
        } else {
            actionUrl = 'session.html?class=' + plan.class + '&subject=' + task.subject +
                       '&chapter=' + task.chapter + '&title=' + encodeURIComponent(chapterName) +
                       '&from=target&skipNotes=1';
        }

        const icon = task.type === 'notes' ? 'fa-book-open' : 'fa-pencil';
        const label = task.type === 'notes' ? 'নোট পড়ো' : 'MCQ করো';

        return '<a href="' + actionUrl + '" class="task-item ' + (isDone ? 'done' : '') + '">' +
            '<div class="task-check">' +
                (isDone ? '<i class="fas fa-check"></i>' : '<i class="fas fa-circle"></i>') +
            '</div>' +
            '<div class="task-info">' +
                '<div class="task-subject">' + subjectName + '</div>' +
                '<div class="task-chapter">' + chapterName + '</div>' +
            '</div>' +
            '<div class="task-action">' +
                '<i class="fas ' + icon + '"></i> ' + label +
            '</div>' +
        '</a>';
    }).join('');
}

function getSubjectName(subId, plan) {
    const map = {
        'math': 'গণিত', 'physics': 'পদার্থবিজ্ঞান', 'chemistry': 'রসায়ন',
        'biology': 'জীববিজ্ঞান', 'bangla': 'বাংলা', 'english': 'ইংরেজি',
        'ict': 'ICT', 'bgs': 'BGS', 'science': 'বিজ্ঞান', 'higher-math': 'উচ্চতর গণিত',
        'accounting': 'হিসাববিজ্ঞান', 'business': 'ব্যবসায়', 'finance': 'ফিন্যান্স',
        'history': 'ইতিহাস', 'geography': 'ভূগোল', 'civics': 'পৌরনীতি', 'economics': 'অর্থনীতি'
    };
    return map[subId] || subId;
}

let CHAPTERS_CACHE = null;

async function loadChaptersCache() {
    if (CHAPTERS_CACHE) return CHAPTERS_CACHE;
    try {
        const res = await fetch('data/chapters.json');
        CHAPTERS_CACHE = await res.json();
    } catch (e) {
        CHAPTERS_CACHE = {};
    }
    return CHAPTERS_CACHE;
}

function getChapterName(subId, chId) {
    if (!CHAPTERS_CACHE) return chId;
    const classData = CHAPTERS_CACHE[userClass] || {};
    const chapters = classData[subId] || [];
    const ch = chapters.find(c => c.id === chId);
    return ch ? (ch.num + '. ' + ch.title) : chId;
}

function formatBanglaDate(d) {
    const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
    return toBangla(d.getDate()) + ' ' + months[d.getMonth()] + ', ' + toBangla(d.getFullYear());
}

function formatShortDate(d) {
    return toBangla(d.getDate()) + '/' + toBangla(d.getMonth() + 1);
}

function toBangla(num) {
    const d = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return num.toString().split('').map(x => d[parseInt(x)] ?? x).join('');
}
