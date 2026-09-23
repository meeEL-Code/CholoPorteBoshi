// ===== Onboarding Flow =====

const USER_KEY = 'cpb_user';

// === Avatar SVG Generator ===
function makeAvatar(opts) {
    const { bg, skin, hair, shirt, eye, style } = opts;
    let hairPath = '';
    if (style === 'short') {
        hairPath = '<path d="M 28 42 Q 28 20, 50 20 Q 72 20, 72 42 L 70 38 Q 65 28, 50 28 Q 35 28, 30 38 Z" fill="' + hair + '"/>';
    } else if (style === 'long') {
        hairPath = '<path d="M 26 48 Q 26 18, 50 18 Q 74 18, 74 48 L 74 60 Q 70 55, 70 48 Q 70 30, 50 30 Q 30 30, 30 48 Q 30 55, 26 60 Z" fill="' + hair + '"/>';
    } else if (style === 'ponytail') {
        hairPath = '<path d="M 26 44 Q 26 18, 50 18 Q 74 18, 74 44 Q 74 34, 68 30 L 68 55 Q 65 50, 64 42 Q 60 32, 50 32 Q 40 32, 36 42 Q 35 50, 32 55 L 32 30 Q 26 34, 26 44 Z" fill="' + hair + '"/>' +
                  '<ellipse cx="72" cy="55" rx="6" ry="14" fill="' + hair + '"/>';
    } else if (style === 'spiky') {
        hairPath = '<path d="M 26 42 L 30 26 L 38 34 L 42 20 L 50 30 L 58 20 L 62 34 L 70 26 L 74 42 Q 70 30, 50 30 Q 30 30, 26 42 Z" fill="' + hair + '"/>';
    } else if (style === 'bun') {
        hairPath = '<circle cx="50" cy="18" r="10" fill="' + hair + '"/>' +
                  '<path d="M 28 44 Q 28 22, 50 22 Q 72 22, 72 44 L 72 50 Q 68 42, 62 38 Q 56 32, 50 32 Q 44 32, 38 38 Q 32 42, 28 50 Z" fill="' + hair + '"/>';
    } else {
        hairPath = '<path d="M 26 44 Q 26 20, 50 20 Q 74 20, 74 44 Q 68 32, 50 32 Q 32 32, 26 44 Z" fill="' + hair + '"/>';
    }

    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="50" cy="50" r="50" fill="' + bg + '"/>' +
        '<ellipse cx="50" cy="98" rx="38" ry="28" fill="' + shirt + '"/>' +
        '<ellipse cx="50" cy="58" rx="22" ry="25" fill="' + skin + '"/>' +
        hairPath +
        '<ellipse cx="42" cy="58" rx="3" ry="4" fill="' + eye + '"/>' +
        '<ellipse cx="58" cy="58" rx="3" ry="4" fill="' + eye + '"/>' +
        '<circle cx="43" cy="56.5" r="1" fill="#ffffff"/>' +
        '<circle cx="59" cy="56.5" r="1" fill="#ffffff"/>' +
        '<path d="M 46 70 Q 50 73, 54 70" stroke="#8B5A3C" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="38" cy="68" rx="3" ry="1.5" fill="#FFB3BA" opacity="0.6"/>' +
        '<ellipse cx="62" cy="68" rx="3" ry="1.5" fill="#FFB3BA" opacity="0.6"/>' +
    '</svg>';
}

// 12 predefined avatars
const AVATARS = [
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

let currentStep = 1;
let userData = {
    name: '',
    school: '',
    class: '',
    group: '',
    avatar: ''
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Skip onboarding if already completed
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
        // User already onboarded — no modal
        return;
    }

    // Show modal
    const overlay = document.getElementById('onboardingOverlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');

    setupStep1();
    setupStep2();
    setupStep3();
    setupStep4();
});

// ===== STEP 1: Name =====
function setupStep1() {
    const input = document.getElementById('userNameInput');
    const btn = document.getElementById('nextBtn1');

    input.addEventListener('input', () => {
        btn.disabled = input.value.trim().length < 2;
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !btn.disabled) btn.click();
    });

    btn.addEventListener('click', () => {
        userData.name = input.value.trim();
        goToStep(2);
    });
}

// ===== STEP 2: School + Class =====
function setupStep2() {
    const schoolInput = document.getElementById('schoolInput');
    const classInput = document.getElementById('classInput');
    const btn = document.getElementById('nextBtn2');
    const backBtn = document.getElementById('backBtn2');

    const validate = () => {
        btn.disabled = !(schoolInput.value.trim().length >= 2 && classInput.value);
    };

    schoolInput.addEventListener('input', validate);
    classInput.addEventListener('change', validate);

    backBtn.addEventListener('click', () => goToStep(1));

    btn.addEventListener('click', () => {
        userData.school = schoolInput.value.trim();
        userData.class = classInput.value;

        // If class is 9 or 10, go to step 3 (group). Else skip to step 4 (avatar).
        if (userData.class === '9' || userData.class === '10') {
            goToStep(3);
        } else {
            userData.group = '';
            goToStep(4);
        }
    });
}

// ===== STEP 3: Group (9-10 only) =====
function setupStep3() {
    const groupInput = document.getElementById('groupInput');
    const btn = document.getElementById('nextBtn3');
    const backBtn = document.getElementById('backBtn3');

    groupInput.addEventListener('change', () => {
        btn.disabled = !groupInput.value;
    });

    backBtn.addEventListener('click', () => goToStep(2));

    btn.addEventListener('click', () => {
        userData.group = groupInput.value;
        goToStep(4);
    });
}

// ===== STEP 4: Avatar =====
function setupStep4() {
    const grid = document.getElementById('avatarGrid');
    const btn = document.getElementById('finishBtn');
    const backBtn = document.getElementById('backBtn4');

    // Render avatars
    grid.innerHTML = AVATARS.map(a =>
        '<div class="avatar-option" data-id="' + a.id + '">' + makeAvatar(a) + '</div>'
    ).join('');

    grid.querySelectorAll('.avatar-option').forEach(el => {
        el.addEventListener('click', () => {
            grid.querySelectorAll('.avatar-option').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            userData.avatar = el.dataset.id;
            btn.disabled = false;
        });
    });

    backBtn.addEventListener('click', () => {
        if (userData.class === '9' || userData.class === '10') {
            goToStep(3);
        } else {
            goToStep(2);
        }
    });

    btn.addEventListener('click', () => {
        userData.createdAt = new Date().toISOString();
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        showCompletionThenClose();
    });
}

// ===== Navigation =====
function goToStep(step) {
    currentStep = step;
    document.querySelectorAll('.modal-step').forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.step) === step);
    });

    // Update progress dots
    document.querySelectorAll('.progress-dot').forEach(dot => {
        const dotStep = parseInt(dot.dataset.step);
        dot.classList.remove('active', 'done');
        if (dotStep === step) dot.classList.add('active');
        else if (dotStep < step) dot.classList.add('done');
    });
}

// ===== Completion =====
function showCompletionThenClose() {
    const card = document.querySelector('.modal-card');
    card.innerHTML =
        '<div style="text-align:center; padding: 20px 0;">' +
            '<div style="font-size: 5rem; margin-bottom: 15px;"><i class="fas fa-star"></i></div>' +
            '<h2 class="modal-title">স্বাগতম, ' + userData.name + '!</h2>' +
            '<p class="modal-subtitle">চলো পড়তে বসি — তোমার শেখার যাত্রা শুরু হোক</p>' +
            '<button id="enterBtn" class="modal-btn-primary" style="margin-top: 25px;">শুরু করি</button>' +
        '</div>';

    document.getElementById('enterBtn').addEventListener('click', () => {
        document.getElementById('onboardingOverlay').classList.add('hidden');
        if (window.showToast) {
            setTimeout(() => showToast('স্বাগতম ' + userData.name + '! <i class="fas fa-star"></i>', 'success', 3500), 500);
        }
        // Reload to show profile icon and personalized welcome
        location.reload();
    });
}

// Export helper for other scripts
window.getUser = function() {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
};

window.getAvatarSVG = function(avatarId) {
    const a = AVATARS.find(x => x.id === avatarId) || AVATARS[0];
    return makeAvatar(a);
};
