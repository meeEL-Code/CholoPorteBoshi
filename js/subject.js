// Get params from URL (e.g., subject.html?class=6&subject=math)
const urlParams = new URLSearchParams(window.location.search);
const classId = urlParams.get('class') || '6';
const subjectId = urlParams.get('subject') || 'math';

const subjectTitle = document.getElementById('subjectTitle');
const chapterList = document.getElementById('chapterList');

// বাংলায় ক্লাস নম্বর দেখানোর হেল্পার
const banglaNumbers = { '6': '৬', '7': '৭', '8': '৮', '9': '৯', '10': '১০' };
const banglaClass = banglaNumbers[classId] || classId;

// বিষয়ের নাম ম্যাপ (JSON থেকে নিলেও চলবে, তবে দ্রুত রেন্ডারের জন্য এখানে)
const subjectNames = {
    'math': 'গণিত',
    'science': 'বিজ্ঞান',
    'bangla': 'বাংলা',
    'english': 'ইংরেজি',
    'physics': 'পদার্থবিজ্ঞান'
};

subjectTitle.textContent = `${subjectNames[subjectId] || subjectId} - Class ${banglaClass}`;

// Fetch chapters data
fetch('data/chapters.json')
    .then(response => response.json())
    .then(data => {
        const chapters = (data[classId] && data[classId][subjectId]) || [];

        if (chapters.length === 0) {
            chapterList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>এই বিষয়ের কোনো চ্যাপ্টার এখনো যোগ করা হয়নি।</p>
                </div>
            `;
            return;
        }

        // Render chapter cards
        chapterList.innerHTML = chapters.map(ch => `
            <div class="chapter-card">
                <div class="chapter-info">
                    <div class="chapter-num">${ch.num}</div>
                    <h3 class="chapter-title">${ch.title}</h3>
                </div>
                <a href="reader.html?pdf=${encodeURIComponent(ch.pdf)}&title=${encodeURIComponent(ch.title)}" class="read-btn">
                    <i class="fas fa-book-open"></i>
                    <span>পড়ুন</span>
                </a>
            </div>
        `).join('');
    })
    .catch(error => {
        console.error('Error loading chapters:', error);
        chapterList.innerHTML = '<p style="text-align: center;">ডেটা লোড করতে সমস্যা হচ্ছে।</p>';
    });
