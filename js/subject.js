const urlParams = new URLSearchParams(window.location.search);
const classId = urlParams.get('class') || '6';
const subjectId = urlParams.get('subject') || 'math';

const subjectTitle = document.getElementById('subjectTitle');
const chapterList = document.getElementById('chapterList');

const banglaNumbers = { '6': '৬', '7': '৭', '8': '৮', '9': '৯', '10': '১০' };
const banglaClass = banglaNumbers[classId] || classId;

const subjectNames = {
    'math': 'গণিত', 'science': 'বিজ্ঞান', 'bangla': 'চারুপাঠ ও আনন্দপাঠ',
    'bangla-grammar': 'বাংলা ব্যাকরণ', 'english': 'English For Today',
    'english-grammar': 'English Grammar', 'ict': 'তথ্য ও যোগাযোগ প্রযুক্তি',
    'bgs': 'বাংলাদেশ ও বিশ্বপরিচয়', 'pe': 'শারীরিক শিক্ষা ও স্বাস্থ্য',
    'work': 'কর্ম ও জীবনমুখী শিক্ষা', 'islam': 'ইসলাম শিক্ষা',
    'hindu': 'হিন্দুধর্ম শিক্ষা', 'christian': 'খ্রীষ্টধর্ম শিক্ষা',
    'buddhist': 'বৌদ্ধধর্ম শিক্ষা'
};

subjectTitle.textContent = (subjectNames[subjectId] || subjectId) + ' • Class ' + banglaClass;

fetch('data/chapters.json')
    .then(response => response.json())
    .then(data => {
        const chapters = (data[classId] && data[classId][subjectId]) || [];

        if (chapters.length === 0) {
            chapterList.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>এই বিষয়ের কোনো চ্যাপ্টার এখনো যোগ করা হয়নি।</p></div>';
            return;
        }

        chapterList.innerHTML = chapters.map(ch => {
            const notesUrl = 'notes.html?class=' + classId + '&subject=' + subjectId +
                            '&chapter=' + ch.id + '&title=' + encodeURIComponent(ch.title);
            return '<div class="chapter-card-modern">' +
                '<div class="chapter-header-row">' +
                    '<div class="chapter-num">' + ch.num + '</div>' +
                    '<h3 class="chapter-title">' + ch.title + '</h3>' +
                '</div>' +
                '<div class="chapter-actions">' +
                    '<a href="' + notesUrl + '" class="action-btn action-notes">' +
                        '<i class="fas fa-book-open"></i> পড়াশোনা' +
                    '</a>' +
                    '<a href="exam.html" class="action-btn action-exam">' +
                        '<i class="fas fa-play"></i> পরীক্ষা' +
                    '</a>' +
                '</div>' +
            '</div>';
        }).join('');
    })
    .catch(error => {
        console.error('Error loading chapters:', error);
        chapterList.innerHTML = '<p style="text-align: center;">ডেটা লোড করতে সমস্যা হচ্ছে।</p>';
    });
