// ===== Edit Profile =====

const AVATARS_EDIT = [
    { id: 'a1',  bg: '#E0F2E9', skin: '#F5D0B0', hair: '#2C2C2C', shirt: '#00693E', eye: '#1a1a1a', style: 'short' },
    { id: 'a2',  bg: '#FCE4EC', skin: '#F5D0B0', hair: '#8B4513', shirt: '#C2185B', eye: '#3E2723', style: 'long' },
    { id: 'a3',  bg: '#E3F2FD', skin: '#F0C9A0', hair: '#1a1a1a', shirt: '#1565C0', eye: '#1a1a1a', style: 'spiky' },
    { id: 'a4',  bg: '#F3E5F5', skin: '#F5D0B0', hair: '#FFD54F', shirt: '#7B1FA2', eye: '#4A148C', style: 'ponytail' },
    { id: 'a5',  bg: '#FFEBEE', skin: '#F5D0B0', hair: '#D32F2F', shirt: '#B71C1C', eye: '#1a1a1a', style: 'short' },
    { id: 'a6',  bg: '#FFF9C4', skin: '#E8B88A', hair: '#1a1a1a', shirt: '#F9A825', eye: '#1a1a1a', style: 'bun' },
    { id: 'a7',  bg: '#FFF3E0', skin: '#F5D0B0', hair: '#6D4C41', shirt: '#EF6C00', eye: '#3E2723', style: 'short' },
    { id: 'a8',  bg: '#E0F7FA', skin: '#F0C9A0', hair: '#1a1a1a', shirt: '#00838F', eye: '#1a1a1a', style: 'long' },
    { id: 'a9',  bg: '#E8EAF6', skin: '#F5D0B0', hair: '#9E9E9E', shirt: '#283593', eye: '#1a1a1a', style: 'spiky' },
    { id: 'a10', bg: '#FCE4EC', skin: '#F5D0B0', hair: '#EC407A', shirt: '#AD1457', eye: '#3E2723', style: 'ponytail' },
    { id: 'a11', bg: '#F1F8E9', skin: '#E8B88A', hair: '#1a1a1a', shirt: '#F5F5F5', eye: '#1a1a1a', style: 'bun' },
    { id: 'a12', bg: '#E0F7FA', skin: '#F5D0B0', hair: '#29B6F6', shirt: '#0277BD', eye: '#1a1a1a', style: 'long' }
];

let selectedAvatar = '';

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');

    // Populate fields
    document.getElementById('editName').value = user.name || '';
    document.getElementById('editSchool').value = user.school || '';
    document.getElementById('editClass').value = user.class || '6';
    document.getElementById('editGroup').value = user.group || '';
    selectedAvatar = user.avatar || 'a1';

    // Show/hide group section
    toggleGroupSection();

    // Avatar grid
    renderAvatars();

    // Class change
    document.getElementById('editClass').addEventListener('change', toggleGroupSection);

    // Form submit
    document.getElementById('editForm').addEventListener('submit', saveProfile);

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', resetAllData);

    // Save button in header
    document.getElementById('saveBtn').addEventListener('click', saveProfile);
});

function toggleGroupSection() {
    const cls = document.getElementById('editClass').value;
    const section = document.getElementById('groupSection');
    if (cls === '9' || cls === '10') {
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
        document.getElementById('editGroup').value = '';
    }
}

function renderAvatars() {
    const grid = document.getElementById('avatarGrid');
    if (!grid) return;

    grid.innerHTML = AVATARS_EDIT.map(a =>
        '<div class="avatar-option ' + (a.id === selectedAvatar ? 'selected' : '') + '" data-id="' + a.id + '">' +
            (window.getAvatarSVG ? window.getAvatarSVG(a.id) : '') +
        '</div>'
    ).join('');

    grid.querySelectorAll('.avatar-option').forEach(el => {
        el.addEventListener('click', () => {
            grid.querySelectorAll('.avatar-option').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            selectedAvatar = el.dataset.id;
        });
    });
}

function saveProfile(e) {
    if (e) e.preventDefault();

    const name = document.getElementById('editName').value.trim();
    const school = document.getElementById('editSchool').value.trim();
    const cls = document.getElementById('editClass').value;
    const group = document.getElementById('editGroup').value;

    if (name.length < 2) {
        if (window.showToast) showToast('নাম কমপক্ষে ২ অক্ষরের হতে হবে', 'error');
        return;
    }

    if ((cls === '9' || cls === '10') && !group) {
        if (window.showToast) showToast('বিভাগ নির্বাচন করো', 'error');
        return;
    }

    const user = {
        name: name,
        school: school,
        class: cls,
        group: group,
        avatar: selectedAvatar,
        createdAt: JSON.parse(localStorage.getItem('cpb_user') || '{}').createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    localStorage.setItem('cpb_user', JSON.stringify(user));

    if (window.showToast) showToast('প্রোফাইল সেভ হয়েছে!', 'success');

    setTimeout(() => {
        location.href = 'index.html';
    }, 1000);
}

function resetAllData() {
    if (!confirm('সব ডেটা মুছে ফেলতে চাও? (প্রোফাইল, পরীক্ষার রেকর্ড — সব)')) return;
    if (!confirm('এটা ফিরিয়ে আনা যাবে না। নিশ্চিত?')) return;

    localStorage.clear();
    location.href = 'index.html';
}
