// ===== Class Page Logic =====

const urlParams = new URLSearchParams(window.location.search);
const classId = urlParams.get('class') || '6';

const classTitle = document.getElementById('classTitle');
const subjectGrid = document.getElementById('subjectGrid');

const banglaNumbers = { '6': '৬', '7': '৭', '8': '৮', '9': '৯', '10': '১০' };
const banglaClass = banglaNumbers[classId] || classId;

classTitle.textContent = 'Class ' + banglaClass + ' - বিষয়সমূহ';

fetch('data/subjects.json')
    .then(r => r.json())
    .then(data => {
        let subjects = [];

        if (classId === '9' || classId === '10') {
            // Class 9-10: show common + user's group
            const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');
            const group = user.group || 'science';

            const classData = data[classId] || {};
            const common = classData._common || [];
            const groupSubjects = classData[group] || [];

            subjects = [...common, ...groupSubjects];
        } else {
            subjects = data[classId] || [];
        }

        if (subjects.length === 0) {
            subjectGrid.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>এই ক্লাসের বিষয় পাওয়া যায়নি।</p></div>';
            return;
        }

        subjectGrid.innerHTML = subjects.map(sub =>
            '<a href="subject.html?class=' + classId + '&subject=' + sub.id + '" class="class-card">' +
                '<div class="icon-wrapper"><i class="fas ' + sub.icon + '"></i></div>' +
                '<h3>' + sub.name + '</h3>' +
            '</a>'
        ).join('');
    })
    .catch(err => {
        console.error(err);
        subjectGrid.innerHTML = '<p style="text-align: center;">ডেটা লোড করতে সমস্যা হচ্ছে।</p>';
    });
