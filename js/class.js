// Get class number from the URL (e.g., class.html?class=6)
const urlParams = new URLSearchParams(window.location.search);
const classId = urlParams.get('class') || '6';

const classTitle = document.getElementById('classTitle');
const subjectGrid = document.getElementById('subjectGrid');

// Update the title based on the selected class
classTitle.textContent = `Class ${classId} - বিষয়সমূহ`;

// Fetch data from subjects.json
fetch('data/subjects.json')
    .then(response => response.json())
    .then(data => {
        const subjects = data[classId] || [];
        
        if (subjects.length === 0) {
            subjectGrid.innerHTML = '<p style="text-align: center; width: 100%;">এই ক্লাসের জন্য কোনো বিষয় পাওয়া যায়নি।</p>';
            return;
        }

        // Render subject cards with Font Awesome icons
        subjectGrid.innerHTML = subjects.map(sub => `
            <a href="subject.html?class=${classId}&subject=${sub.id}" class="class-card">
                <div class="icon-wrapper">
                    <i class="fas ${sub.icon}"></i>
                </div>
                <h3>${sub.name}</h3>
            </a>
        `).join('');
    })
    .catch(error => {
        console.error('Error loading subjects:', error);
        subjectGrid.innerHTML = '<p style="text-align: center; width: 100%;">ডেটা লোড করতে সমস্যা হচ্ছে।</p>';
    });
