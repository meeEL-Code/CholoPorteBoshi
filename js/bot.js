// ===== PB Mentor — Academic Assistant =====

// ===== Knowledge Base (Direct Answers) =====
// Format: "keyword": "answer"
const KNOWLEDGE_BASE = {
    // Math formulas
    'পিথাগোরাস': 'পিথাগোরাসের সূত্র: <b>a² + b² = c²</b><br>যেখানে c = অতিভুজ, a ও b = অন্য দুই বাহু।',
    'pythagoras': 'পিথাগোরাসের সূত্র: <b>a² + b² = c²</b><br>সমকোণী ত্রিভুজে অতিভুজ² = অপর দুই বাহুর বর্গের সমষ্টি।',
    'বৃত্তের ক্ষেত্রফল': 'বৃত্তের ক্ষেত্রফল = <b>πr²</b><br>π ≈ ৩.১৪১৬, r = ব্যাসার্ধ।',
    'বৃত্তের পরিধি': 'বৃত্তের পরিধি = <b>২πr</b><br>π ≈ ৩.১৪১৬, r = ব্যাসার্ধ।',
    'ত্রিভুজের ক্ষেত্রফল': 'ত্রিভুজের ক্ষেত্রফল = <b>১/২ × ভূমি × উচ্চতা</b>',
    'আয়তক্ষেত্রের ক্ষেত্রফল': 'আয়তক্ষেত্রের ক্ষেত্রফল = <b>দৈর্ঘ্য × প্রস্থ</b>',
    'বর্গের ক্ষেত্রফল': 'বর্গের ক্ষেত্রফল = <b>বাহু²</b>',
    'গড়': 'গড় = <b>সব মানের সমষ্টি ÷ উপাত্তের সংখ্যা</b>',
    'শতকরা': 'শতকরা = <b>(অংশ ÷ সম্পূর্ণ) × ১০০%</b>',
    'সরল সুদ': 'সরল সুদ = <b>(আসল × সময় × সুদের হার) ÷ ১০০</b>',
    'গসাগু': 'গ.সা.গু = গরিষ্ঠ সাধারণ গুণনীয়ক<br>দুই বা ততোধিক সংখ্যার সবচেয়ে বড় সাধারণ উৎপাদক।',
    'লসাগু': 'ল.সা.গু = লঘিষ্ঠ সাধারণ গুণিতক<br>দুই বা ততোধিক সংখ্যার সবচেয়ে ছোট সাধারণ গুণিতক।',

    // Science
    'পানির সূত্র': 'পানির রাসায়নিক সংকেত: <b>H₂O</b><br>২টি হাইড্রোজেন + ১টি অক্সিজেন পরমাণু।',
    'সালোকসংশ্লেষ': 'সালোকসংশ্লেষ: সবুজ উদ্ভিদ সূর্যের আলো, CO₂ ও পানি ব্যবহার করে গ্লুকোজ ও O₂ তৈরি করে।',
    'ফটোসিন্থেসিস': 'Photosynthesis: গ্লুকোজ তৈরি প্রক্রিয়া<br>৬CO₂ + ৬H₂O → C₆H₁₂O₆ + ৬O₂',
    'নিউটনের প্রথম সূত্র': 'নিউটনের ১ম সূত্র: বাহ্যিক বল প্রয়োগ না করলে স্থির বস্তু স্থির থাকবে, চলমান বস্তু সমবেগে সরলপথে চলবে।',
    'নিউটনের দ্বিতীয় সূত্র': 'নিউটনের ২য় সূত্র: <b>F = ma</b><br>বল = ভর × ত্বরণ।',

    // Study tips
    'পড়ার টিপস': 'পড়ার সেরা টিপস:<br>১. প্রতিদিন নির্দিষ্ট সময়ে পড়ো<br>২. ৫০ মিনিট পড়ে ১০ মিনিট বিশ্রাম<br>৩. নোট নিজের ভাষায় লেখো<br>৪. প্রতিদিন ২০টি MCQ করো<br>৫. ঘুমানোর আগে রিভিশন দাও',
    'মনে রাখার উপায়': 'মনে রাখার টিপস:<br>১. ছবি বা মাইন্ড ম্যাপ বানাও<br>২. জোরে পড়ো<br>৩. বন্ধুকে শেখাও<br>৪. নির্দিষ্ট বিরতিতে রিভিশন দাও',

    // General
    'ধন্যবাদ': 'স্বাগতম! পড়াশোনায় এগিয়ে যাও!',
    'শুভেচ্ছা': 'তোমাকেও শুভেচ্ছা! কী সাহায্য করতে পারি?'
};

// ===== Bot Responses =====
function getBotResponse(input) {
    const msg = input.toLowerCase().trim();

    // 1. First: Knowledge base direct answers
    for (const key in KNOWLEDGE_BASE) {
        if (msg.includes(key.toLowerCase())) {
            return KNOWLEDGE_BASE[key];
        }
    }

    // 2. Navigation commands
    if (matches(msg, ['আজকের পরীক্ষা', 'পরীক্ষা', 'exam', 'কুইজ', 'quiz'])) {
        return {
            text: 'পরীক্ষা পেজ খুলছি... শুভকামনা!',
            navigate: 'exam.html'
        };
    }

    if (matches(msg, ['সিলেবাস', 'syllabus', 'পাঠ্যক্রম'])) {
        return {
            text: 'সিলেবাস পেজ খুলছি...',
            navigate: 'syllabus.html'
        };
    }

    if (matches(msg, ['অগ্রগতি', 'progress', 'রিপোর্ট'])) {
        return {
            text: 'তোমার অগ্রগতি দেখাচ্ছি...',
            navigate: 'progress.html'
        };
    }

    if (matches(msg, ['নোট', 'notes'])) {
        return {
            text: 'নোট পেজ খুলছি...',
            navigate: 'notes.html'
        };
    }

    if (matches(msg, ['প্রোফাইল', 'profile'])) {
        return {
            text: 'প্রোফাইল খুলছি...',
            action: 'openProfile'
        };
    }

    if (matches(msg, ['হোম', 'home'])) {
        return {
            text: 'হোম পেজে যাচ্ছি...',
            navigate: 'index.html'
        };
    }

    // 3. Class navigation
    const classMatch = msg.match(/class\s*([6-9]|10)|ক্লাস\s*([৬-৯]|১০)/i);
    if (classMatch) {
        const num = classMatch[1] || classMatch[2];
        const map = {'৬':'6','৭':'7','৮':'8','৯':'9','১০':'10'};
        const cls = map[num] || num;
        return {
            text: 'Class ' + toBangla(cls) + ' এর বিষয়গুলো দেখাচ্ছি...',
            navigate: 'class.html?class=' + cls
        };
    }

    // 4. User info
    if (matches(msg, ['স্ট্রিক', 'streak'])) {
        const results = JSON.parse(localStorage.getItem('cpb_results') || '[]');
        const streak = calcStreak(results);
        return 'তোমার স্ট্রিক: <b>' + toBangla(streak) + ' দিন</b>' +
               (streak > 0 ? '<br>চালিয়ে যাও!' : '<br>আজই শুরু করো!');
    }

    if (matches(msg, ['স্কোর', 'score', 'নম্বর'])) {
        const results = JSON.parse(localStorage.getItem('cpb_results') || '[]');
        if (results.length === 0) {
            return 'এখনো কোনো পরীক্ষা দাওনি। <b>"পরীক্ষা"</b> লিখে শুরু করো!';
        }
        let best = 0;
        results.forEach(r => {
            const p = r.total > 0 ? (r.correct / r.total) * 100 : 0;
            if (p > best) best = p;
        });
        return 'তোমার পরিসংখ্যান:<br>পরীক্ষা: <b>' + toBangla(results.length) + 'টি</b><br>সেরা স্কোর: <b>' + toBangla(Math.round(best)) + '%</b>';
    }

    if (matches(msg, ['আমার নাম', 'নাম কী'])) {
        const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');
        return user.name ? 'তোমার নাম: <b>' + user.name + '</b>' : 'তোমার নাম এখনো সেট করা হয়নি।';
    }

    // 5. Greetings
    if (matches(msg, ['হ্যালো', 'hello', 'হাই', 'hi', 'আসসালামু', 'সালাম'])) {
        const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');
        const name = user.name ? ' ' + user.name : '';
        return 'আসসালামু আলাইকুম' + name + '!<br>কী সাহায্য করতে পারি?';
    }

    if (matches(msg, ['ধন্যবাদ', 'thanks', 'thank you'])) {
        return 'স্বাগতম! পড়াশোনায় এগিয়ে যাও!';
    }

    if (matches(msg, ['সাহায্য', 'help', 'কমান্ড'])) {
        return 'আমি যা করতে পারি:<br><br>' +
               '<b>উত্তর দিতে পারি:</b><br>' +
               '- "পিথাগোরাসের সূত্র কী?"<br>' +
               '- "বৃত্তের ক্ষেত্রফল কীভাবে?"<br>' +
               '- "নিউটনের সূত্র"<br>' +
               '- "পড়ার টিপস"<br><br>' +
               '<b>Navigate করতে পারি:</b><br>' +
               '- "পরীক্ষা" / "সিলেবাস"<br>' +
               '- "অগ্রগতি" / "প্রোফাইল"<br>' +
               '- "ক্লাস ৯"';
    }

    // 6. Motivational
    if (matches(msg, ['পড়তে মন চায় না', 'পড়তে ইচ্ছা করে না', 'পড়তে পারি না'])) {
        return 'চিন্তা করো না!<br>ছোট করে শুরু করো — মাত্র ৫ মিনিট।<br>একবার শুরু করলে আর থামতে মন চাইবে না!';
    }

    if (matches(msg, ['কঠিন লাগছে', 'বুঝতে পারছি না'])) {
        return 'কঠিন লাগলে চ্যাপ্টার ভেঙে ভেঙে পড়ো।<br>নোট পড়ো → MCQ করো → আবার পড়ো।<br>তুমি পারবে ইনশাআল্লাহ!';
    }

    if (matches(msg, ['মোটিভেশন', 'অনুপ্রেরণা'])) {
        return 'সাফল্য একদিনে আসে না।<br>প্রতিদিন একটু একটু করে এগোলেই একদিন অনেক দূর পৌঁছে যাবে!';
    }

    // 7. Default fallback — AI-style
    return 'এটা আমার কাছে জমা রাখলাম।<br>আপাতত "সাহায্য" লিখে দেখো কী কী পারি।<br>অথবা সরাসরি সিলেবাস, পরীক্ষা বা নোটে যাও।';
}

// ===== Helpers =====
function matches(msg, keywords) {
    return keywords.some(k => msg.includes(k.toLowerCase()));
}

function calcStreak(results) {
    if (results.length === 0) return 0;
    const dates = new Set();
    results.forEach(r => {
        const d = new Date(r.date);
        dates.add(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate());
    });
    let streak = 0;
    let check = new Date();
    const todayKey = check.getFullYear() + '-' + (check.getMonth() + 1) + '-' + check.getDate();
    if (!dates.has(todayKey)) check.setDate(check.getDate() - 1);
    while (true) {
        const key = check.getFullYear() + '-' + (check.getMonth() + 1) + '-' + check.getDate();
        if (dates.has(key)) { streak++; check.setDate(check.getDate() - 1); }
        else break;
    }
    return streak;
}

function toBangla(num) {
    const d = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return num.toString().split('').map(x => d[parseInt(x)] ?? x).join('');
}

// ===== UI =====
function initBot() {
    const fab = document.createElement('button');
    fab.id = 'botFab';
    fab.className = 'bot-fab';
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>';
    document.body.appendChild(fab);

    const win = document.createElement('div');
    win.id = 'botWindow';
    win.className = 'bot-window hidden';
    win.innerHTML =
        '<div class="bot-header">' +
            '<div class="bot-header-info">' +
                '<div class="bot-avatar">PM</div>' +
                '<div>' +
                    '<h4>PB Mentor</h4>' +
                    '<span class="bot-status"><i class="fas fa-circle"></i> অনলাইন</span>' +
                '</div>' +
            '</div>' +
            '<button class="bot-close" id="botClose">×</button>' +
        '</div>' +
        '<div class="bot-messages" id="botMessages"></div>' +
        '<div class="bot-input-row">' +
            '<input type="text" id="botInput" class="bot-input" placeholder="কিছু জিজ্ঞেস করো..." autocomplete="off">' +
            '<button id="botSend" class="bot-send">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>' +
            '</button>' +
        '</div>' +
        '<div class="bot-quick-actions" id="botQuick">' +
            '<button class="bot-quick-btn" data-msg="পিথাগোরাসের সূত্র কী?">সূত্র</button>' +
            '<button class="bot-quick-btn" data-msg="পড়ার টিপস">টিপস</button>' +
            '<button class="bot-quick-btn" data-msg="আমার স্ট্রিক কত?">স্ট্রিক</button>' +
            '<button class="bot-quick-btn" data-msg="সাহায্য">সাহায্য</button>' +
        '</div>';
    document.body.appendChild(win);

    setTimeout(() => {
        addBotMessage('আসসালামু আলাইকুম! আমি <b>PB Mentor</b>।<br>পড়াশোনার যেকোনো প্রশ্ন করো — উত্তর দেব, শুধু পেজে পাঠাব না।');
    }, 500);

    fab.addEventListener('click', () => {
        win.classList.toggle('hidden');
        fab.classList.toggle('open');
        if (!win.classList.contains('hidden')) document.getElementById('botInput').focus();
    });

    document.getElementById('botClose').addEventListener('click', () => {
        win.classList.add('hidden');
        fab.classList.remove('open');
    });

    document.getElementById('botSend').addEventListener('click', sendMessage);
    document.getElementById('botInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    document.querySelectorAll('.bot-quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('botInput').value = btn.dataset.msg;
            sendMessage();
        });
    });
}

function sendMessage() {
    const input = document.getElementById('botInput');
    const msg = input.value.trim();
    if (!msg) return;
    addUserMessage(msg);
    input.value = '';
    setTimeout(() => {
        const reply = getBotResponse(msg);
        if (typeof reply === 'string') {
            addBotMessage(reply);
        } else {
            addBotMessage(reply.text);
            if (reply.navigate) setTimeout(() => location.href = reply.navigate, 800);
            if (reply.action === 'openProfile') {
                const fab = document.getElementById('profileFab');
                if (fab) fab.click();
            }
        }
    }, 600);
}

function addUserMessage(text) {
    const msgs = document.getElementById('botMessages');
    const el = document.createElement('div');
    el.className = 'bot-msg bot-msg-user';
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
}

function addBotMessage(text) {
    const msgs = document.getElementById('botMessages');
    const el = document.createElement('div');
    el.className = 'bot-msg bot-msg-bot';
    el.innerHTML = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBot);
} else {
    initBot();
}
