// ===== পডতে বসি — Rule-Based Assistant =====

const BOT_USER_KEY = 'cpb_bot_history';

// ===== Bot Responses =====
function getBotResponse(input) {
    const msg = input.toLowerCase().trim();

    // Navigation commands
    if (matches(msg, ['আজকের পরীক্ষা', 'পরীক্ষা', 'exam', 'quiz', 'কুইজ', 'today exam'])) {
        navigate('exam.html');
        return 'পরীক্ষা পেজ খুলছি... 💪 শুভকামনা!';
    }

    if (matches(msg, ['সিলেবাস', 'syllabus', 'পাঠ্যক্রম', 'কোর্স'])) {
        navigate('syllabus.html');
        return 'সিলেবাস পেজ খুলছি... 📚';
    }

    if (matches(msg, ['অগ্রগতি', 'progress', 'রিপোর্ট', 'রেকর্ড'])) {
        navigate('progress.html');
        return 'আমার অগ্রগতি পেজ খুলছি... 📊';
    }

    if (matches(msg, ['নোট', 'notes', 'পড়া', 'পড়াশোনা'])) {
        navigate('notes.html');
        return 'নোট পেজ খুলছি... 📖';
    }

    if (matches(msg, ['প্রোফাইল', 'profile', 'আমার তথ্য'])) {
        const fab = document.getElementById('profileFab');
        if (fab) fab.click();
        return 'প্রোফাইল খুলছি... 👤';
    }

    if (matches(msg, ['হোম', 'home', 'বাড়ি'])) {
        navigate('index.html');
        return 'হোম পেজে নিয়ে যাচ্ছি... 🏠';
    }

    // Class navigation
    const classMatch = msg.match(/class\s*([6-9]|10)|ক্লাস\s*([৬-৯]|১০)/i);
    if (classMatch) {
        const num = classMatch[1] || classMatch[2];
        const map = {'৬':'6','৭':'7','৮':'8','৯':'9','১০':'10'};
        const cls = map[num] || num;
        if (cls >= 6 && cls <= 10) {
            setTimeout(() => location.href = 'class.html?class=' + cls, 500);
            return 'Class ' + toBangla(cls) + ' এর বিষয়গুলো দেখাচ্ছি... 📚';
        }
    }

    // Subject navigation
    if (matches(msg, ['গণিত', 'math'])) {
        navigate('class.html?class=6');
        return 'গণিত বিষয় খুলছি... 📐';
    }
    if (matches(msg, ['বিজ্ঞান', 'science'])) {
        navigate('class.html?class=6');
        return 'বিজ্ঞান বিষয় খুলছি... 🔬';
    }
    if (matches(msg, ['বাংলা', 'bangla'])) {
        navigate('class.html?class=6');
        return 'বাংলা বিষয় খুলছি... 📖';
    }
    if (matches(msg, ['ইংরেজি', 'english'])) {
        navigate('class.html?class=6');
        return 'ইংরেজি বিষয় খুলছি... 🔤';
    }

    // User info
    if (matches(msg, ['স্ট্রিক', 'streak', 'টানা'])) {
        const results = JSON.parse(localStorage.getItem('cpb_results') || '[]');
        const streak = calcStreak(results);
        return '🔥 তোমার স্ট্রিক: ' + toBangla(streak) + ' দিন\n' +
               (streak > 0 ? 'চালিয়ে যাও!' : 'আজই শুরু করো!');
    }

    if (matches(msg, ['স্কোর', 'score', 'নম্বর', 'মার্ক'])) {
        const results = JSON.parse(localStorage.getItem('cpb_results') || '[]');
        if (results.length === 0) {
            return 'এখনো কোনো পরীক্ষা দাওনি। "পরীক্ষা" লিখে শুরু করো! 💪';
        }
        let best = 0;
        results.forEach(r => {
            const p = r.total > 0 ? (r.correct / r.total) * 100 : 0;
            if (p > best) best = p;
        });
        return '📊 পরীক্ষা: ' + toBangla(results.length) + 'টি\n' +
               '🏆 সেরা স্কোর: ' + toBangla(Math.round(best)) + '%';
    }

    if (matches(msg, ['নাম', 'name', 'আমার নাম'])) {
        const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');
        return user.name ? 'তোমার নাম: ' + user.name + ' 👋' : 'তোমার নাম এখনো সেট করা হয়নি।';
    }

    // Greetings
    if (matches(msg, ['হ্যালো', 'hello', 'হাই', 'hi', 'hey', 'আসসালামু', 'সালাম'])) {
        const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');
        const name = user.name ? ' ' + user.name : '';
        return 'আসসালামু আলাইকুম' + name + '! 👋\nকী সাহায্য করতে পারি?';
    }

    if (matches(msg, ['ধন্যবাদ', 'thanks', 'thank you', 'শুকরিয়া'])) {
        return 'স্বাগতম! পড়াশোনায় এগিয়ে যাও! 📚';
    }

    if (matches(msg, ['বিদায়', 'bye', 'গুডবাই', 'আল্লাহ হাফেজ'])) {
        return 'আল্লাহ হাফেজ! আবার এসো 💚';
    }

    // Help / Commands
    if (matches(msg, ['সাহায্য', 'help', 'কমান্ড', 'commands', 'কী করতে পারো'])) {
        return 'আমি যা করতে পারি:\n\n' +
               '📝 "পরীক্ষা" — পরীক্ষা শুরু\n' +
               '📚 "সিলেবাস" — সিলেবাস দেখাও\n' +
               '📊 "অগ্রগতি" — প্রোগ্রেস দেখাও\n' +
               '📖 "নোট" — পড়ার নোট\n' +
               '👤 "প্রোফাইল" — আমার তথ্য\n' +
               '🔥 "স্ট্রিক" — কতদিন টানা পড়ছি\n' +
               '🏆 "স্কোর" — সেরা স্কোর\n' +
               '🎓 "ক্লাস ৬" — ক্লাস অনুযায়ী বিষয়\n' +
               '📐 "গণিত", "বিজ্ঞান" — বিষয়';
    }

    // Motivational
    if (matches(msg, ['পড়তে ভালো লাগে না', 'পড়তে মন চায় না', 'পড়তে ইচ্ছা করছে না', 'পড়তে পারি না'])) {
        return 'চিন্তা করো না! 🌱\n' +
               'ছোট করে শুরু করো — মাত্র ৫ মিনিট।\n' +
               'একবার শুরু করলে আর থামতে মন চাইবে না! 💪';
    }

    if (matches(msg, ['কঠিন লাগছে', 'বুঝতে পারছি না', 'পারব না'])) {
        return 'কঠিন লাগলে চ্যাপ্টার ভেঙে ভেঙে পড়ো।\n' +
               'নোট পড়ো → MCQ করো → আবার পড়ো।\n' +
               'তুমি পারবে, ইনশাআল্লাহ! 🌟';
    }

    if (matches(msg, ['মোটিভেশন', 'মোটিভেট', 'অনুপ্রেরণা'])) {
        return 'সাফল্য একদিনে আসে না।\n' +
               'প্রতিদিন একটু একটু করে এগোলেই একদিন অনেক দূর পৌঁছে যাবে! 🚀';
    }

    // Time/Date
    if (matches(msg, ['সময়', 'কতটা বাজে', 'time'])) {
        const now = new Date();
        let h = now.getHours();
        const m = now.getMinutes();
        const ampm = h >= 12 ? 'PM' : 'AM';
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
        return '🕐 এখন ' + toBangla(h) + ':' + toBangla(m.toString().padStart(2, '0')) + ' ' + ampm;
    }

    // Default fallback
    return 'দুঃখিত, আমি ঠিক বুঝতে পারলাম না 🤔\n\n' +
           '"সাহায্য" লিখো — আমি কী কী করতে পারি তা দেখাব।';
}

// ===== Helpers =====
function matches(msg, keywords) {
    return keywords.some(k => msg.includes(k.toLowerCase()));
}

function navigate(url) {
    setTimeout(() => location.href = url, 400);
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

// ===== UI: Chat Bubble + Window =====
function initBot() {
    // FAB
    const fab = document.createElement('button');
    fab.id = 'botFab';
    fab.className = 'bot-fab';
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>';
    document.body.appendChild(fab);

    // Chat window
    const win = document.createElement('div');
    win.id = 'botWindow';
    win.className = 'bot-window hidden';
    win.innerHTML =
        '<div class="bot-header">' +
            '<div class="bot-header-info">' +
                '<div class="bot-avatar">প</div>' +
                '<div>' +
                    '<h4>পড়তে বসি সহায়ক</h4>' +
                    '<span class="bot-status">● অনলাইন</span>' +
                '</div>' +
            '</div>' +
            '<button class="bot-close" id="botClose">×</button>' +
        '</div>' +
        '<div class="bot-messages" id="botMessages"></div>' +
        '<div class="bot-input-row">' +
            '<input type="text" id="botInput" class="bot-input" placeholder="এখানে লিখো..." autocomplete="off">' +
            '<button id="botSend" class="bot-send">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>' +
            '</button>' +
        '</div>' +
        '<div class="bot-quick-actions" id="botQuick">' +
            '<button class="bot-quick-btn" data-msg="পরীক্ষা">📝 পরীক্ষা</button>' +
            '<button class="bot-quick-btn" data-msg="সিলেবাস">📚 সিলেবাস</button>' +
            '<button class="bot-quick-btn" data-msg="স্ট্রিক">🔥 স্ট্রিক</button>' +
            '<button class="bot-quick-btn" data-msg="সাহায্য">❓ সাহায্য</button>' +
        '</div>';
    document.body.appendChild(win);

    // Welcome message
    setTimeout(() => {
        addBotMessage('আসসালামু আলাইকুম! 👋\nআমি পড়তে বসি সহায়ক। কী সাহায্য করতে পারি?');
    }, 500);

    // Events
    fab.addEventListener('click', () => {
        win.classList.toggle('hidden');
        fab.classList.toggle('open');
        if (!win.classList.contains('hidden')) {
            document.getElementById('botInput').focus();
        }
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

    // Simulate typing delay
    setTimeout(() => {
        const reply = getBotResponse(msg);
        addBotMessage(reply);
    }, 500);
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
    el.innerHTML = text.replace(/\n/g, '<br>');
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBot);
} else {
    initBot();
}
