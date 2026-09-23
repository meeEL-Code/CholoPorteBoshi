// ===== PB Mentor — Academic Assistant (Page Version) =====

// ===== Knowledge Base (Direct Answers) =====
const KNOWLEDGE_BASE = {
    // Math
    'পিথাগোরাস': '<b>পিথাগোরাসের সূত্র</b><br>সমকোণী ত্রিভুজে: <b>a² + b² = c²</b><br>যেখানে c = অতিভুজ, a ও b = অন্য দুই বাহু।<br><br>উদাহরণ: a=3, b=4 হলে c=5।',
    'pythagoras': '<b>Pythagoras Theorem</b><br>In a right triangle: <b>a² + b² = c²</b><br>c = hypotenuse, a & b = other two sides.',
    'বৃত্তের ক্ষেত্রফল': '<b>বৃত্তের ক্ষেত্রফল = πr²</b><br>π ≈ ৩.১৪১৬<br>r = ব্যাসার্ধ<br><br>উদাহরণ: r=7 হলে ক্ষেত্রফল = ২২/৭ × ৪৯ = ১৫৪ বর্গ একক।',
    'বৃত্তের পরিধি': '<b>বৃত্তের পরিধি = ২πr</b><br>π ≈ ৩.১৪১৬<br>r = ব্যাসার্ধ<br><br>উদাহরণ: r=7 হলে পরিধি = ২ × ২২/৭ × ৭ = ৪৪ একক।',
    'ত্রিভুজের ক্ষেত্রফল': '<b>ত্রিভুজের ক্ষেত্রফল = ½ × ভূমি × উচ্চতা</b><br><br>উদাহরণ: ভূমি=১০, উচ্চতা=৬ হলে ক্ষেত্রফল = ½×১০×৬ = ৩০ বর্গ একক।',
    'আয়তক্ষেত্রের ক্ষেত্রফল': '<b>আয়তক্ষেত্রের ক্ষেত্রফল = দৈর্ঘ্য × প্রস্থ</b><br><b>পরিসীমা = ২(দৈর্ঘ্য + প্রস্থ)</b>',
    'বর্গের ক্ষেত্রফল': '<b>বর্গের ক্ষেত্রফল = বাহু²</b><br><b>পরিসীমা = ৪ × বাহু</b>',
    'গড়': '<b>গড় = সব মানের সমষ্টি ÷ উপাত্তের সংখ্যা</b><br><br>উদাহরণ: ২, ৪, ৬, ৮ → গড় = (২+৪+৬+৮)/৪ = ৫',
    'মধ্যক': '<b>মধ্যক</b> = উপাত্ত সাজিয়ে মাঝের মান<br>জোড় সংখ্যক হলে মাঝের দুইটির গড়।',
    'প্রচুরক': '<b>প্রচুরক</b> = সবচেয়ে বেশিবার আসা মান',
    'শতকরা': '<b>শতকরা = (অংশ ÷ সম্পূর্ণ) × ১০০%</b><br><br>উদাহরণ: ৫০ এর ২০% = ৫০ × ২০/১০০ = ১০',
    'সরল সুদ': '<b>সরল সুদ = (আসল × সময় × হার) ÷ ১০০</b><br><br>উদাহরণ: ১০০০ টাকার ২ বছরে ৫% = ১০০০×২×৫/১০০ = ১০০ টাকা',
    'গসাগু': '<b>গ.সা.গু</b> = গরিষ্ঠ সাধারণ গুণনীয়ক<br>দুই বা ততোধিক সংখ্যার সবচেয়ে বড় সাধারণ উৎপাদক।<br><br>উদাহরণ: ১২ ও ১৮ → গ.সা.গু = ৬',
    'লসাগু': '<b>ল.সা.গু</b> = লঘিষ্ঠ সাধারণ গুণিতক<br>দুই বা ততোধিক সংখ্যার সবচেয়ে ছোট সাধারণ গুণিতক।<br><br>উদাহরণ: ৪ ও ৬ → ল.সা.গু = ১২',

    // Science
    'পানির সূত্র': '<b>পানির রাসায়নিক সংকেত: H₂O</b><br>২টি হাইড্রোজেন + ১টি অক্সিজেন পরমাণু।',
    'সালোকসংশ্লেষ': '<b>সালোকসংশ্লেষ</b><br>সবুজ উদ্ভিদ সূর্যের আলো, CO₂ ও পানি ব্যবহার করে গ্লুকোজ ও O₂ তৈরি করে।<br><br>সমীকরণ: ৬CO₂ + ৬H₂O → C₆H₁₂O₆ + ৬O₂',
    'নিউটনের প্রথম সূত্র': '<b>নিউটনের প্রথম সূত্র</b><br>বাহ্যিক বল প্রয়োগ না করলে —<br>• স্থির বস্তু স্থির থাকবে<br>• চলমান বস্তু সমবেগে সরলপথে চলবে<br><br>একে জড়তার সূত্রও বলা হয়।',
    'নিউটনের দ্বিতীয় সূত্র': '<b>নিউটনের দ্বিতীয় সূত্র</b><br><b>F = ma</b><br>বল = ভর × ত্বরণ',
    'নিউটনের তৃতীয় সূত্র': '<b>নিউটনের তৃতীয় সূত্র</b><br>প্রতিটি ক্রিয়ার সমান ও বিপরীত প্রতিক্রিয়া আছে।',
    'কোষ': '<b>কোষ (Cell)</b><br>জীবদেহের ক্ষুদ্রতম একক।<br><br>দুই প্রকার: প্রোক্যারিওটিক ও ইউক্যারিওটিক।<br>উদ্ভিদ কোষে সেলুলোজ দেয়াল ও ক্লোরোপ্লাস্ট থাকে।',
    'কোষ বিভাজন': '<b>কোষ বিভাজন ৩ প্রকার:</b><br>১. মাইটোসিস — দেহকোষে<br>২. মায়োসিস — জননকোষে<br>৩. অ্যামাইটোসিস — সরল বিভাজন',

    // Study tips
    'পড়ার টিপস': '<b>পড়ার সেরা টিপস</b><br>১. প্রতিদিন নির্দিষ্ট সময়ে পড়ো<br>২. ২৫ মিনিট পড়ে ৫ মিনিট বিশ্রাম (Pomodoro)<br>৩. নোট নিজের ভাষায় লেখো<br>৪. প্রতিদিন ২০টি MCQ করো<br>৫. ঘুমানোর আগে রিভিশন দাও<br>৬. যথেষ্ট ঘুমাও',
    'মনে রাখার': '<b>মনে রাখার টিপস</b><br>১. ছবি বা মাইন্ড ম্যাপ বানাও<br>২. জোরে পড়ো — শুনে মনে থাকে<br>৩. বন্ধুকে শেখাও<br>৪. নির্দিষ্ট বিরতিতে রিভিশন দাও<br>৫. গল্প বানিয়ে পড়ো',
    'সময়': '<b>সময় ব্যবস্থাপনা</b><br>• টু-ডু লিস্ট বানাও<br>• কঠিন কাজ সকালে করো<br>• ফোন দূরে রাখো<br>• প্রতি সপ্তাহে টার্গেট সেট করো',
};

// ===== Bot Response =====
function getBotResponse(input) {
    const msg = input.toLowerCase().trim();

    // 1. Knowledge base
    for (const key in KNOWLEDGE_BASE) {
        if (msg.includes(key.toLowerCase())) {
            return { text: KNOWLEDGE_BASE[key] };
        }
    }

    // 2. Navigation
    if (matches(msg, ['আজকের পরীক্ষা', 'পরীক্ষা', 'exam', 'কুইজ', 'quiz'])) {
        return { text: 'পরীক্ষা পেজ খুলছি... শুভকামনা!', navigate: 'exam.html' };
    }
    if (matches(msg, ['সিলেবাস', 'syllabus', 'পাঠ্যক্রম'])) {
        return { text: 'সিলেবাস পেজ খুলছি...', navigate: 'syllabus.html' };
    }
    if (matches(msg, ['অগ্রগতি', 'progress', 'রিপোর্ট'])) {
        return { text: 'তোমার অগ্রগতি দেখাচ্ছি...', navigate: 'progress.html' };
    }
    if (matches(msg, ['নোট', 'notes'])) {
        return { text: 'নোট পেজ খুলছি...', navigate: 'notes.html' };
    }
    if (matches(msg, ['প্রোফাইল', 'profile'])) {
        return { text: 'প্রোফাইল পেজ খুলছি...', navigate: 'edit-profile.html' };
    }
    if (matches(msg, ['হোম', 'home'])) {
        return { text: 'হোম পেজে যাচ্ছি...', navigate: 'index.html' };
    }

    // 3. Class navigation
    const classMatch = msg.match(/class\s*([6-9]|10)|ক্লাস\s*([৬-৯]|১০)/i);
    if (classMatch) {
        const num = classMatch[1] || classMatch[2];
        const map = {'৬':'6','৭':'7','৮':'8','৯':'9','১০':'10'};
        const cls = map[num] || num;
        return { text: 'Class ' + toBangla(cls) + ' এর বিষয়গুলো দেখাচ্ছি...', navigate: 'class.html?class=' + cls };
    }

    // 4. User info
    if (matches(msg, ['স্ট্রিক', 'streak'])) {
        const results = JSON.parse(localStorage.getItem('cpb_results') || '[]');
        const streak = calcStreak(results);
        return { text: 'তোমার স্ট্রিক: <b>' + toBangla(streak) + ' দিন</b>' + (streak > 0 ? '<br>চালিয়ে যাও!' : '<br>আজই শুরু করো!') };
    }
    if (matches(msg, ['স্কোর', 'score', 'নম্বর'])) {
        const results = JSON.parse(localStorage.getItem('cpb_results') || '[]');
        if (results.length === 0) return { text: 'এখনো কোনো পরীক্ষা দাওনি। <b>"পরীক্ষা"</b> লিখে শুরু করো!' };
        let best = 0;
        results.forEach(r => {
            const p = r.total > 0 ? (r.correct / r.total) * 100 : 0;
            if (p > best) best = p;
        });
        return { text: 'তোমার পরিসংখ্যান:<br>পরীক্ষা: <b>' + toBangla(results.length) + 'টি</b><br>সেরা স্কোর: <b>' + toBangla(Math.round(best)) + '%</b>' };
    }
    if (matches(msg, ['আমার নাম', 'নাম কী'])) {
        const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');
        return { text: user.name ? 'তোমার নাম: <b>' + user.name + '</b>' : 'তোমার নাম এখনো সেট করা হয়নি।' };
    }

    // 5. Greetings
    if (matches(msg, ['হ্যালো', 'hello', 'হাই', 'hi', 'hey', 'আসসালামু', 'সালাম'])) {
        const user = JSON.parse(localStorage.getItem('cpb_user') || '{}');
        const name = user.name ? ', ' + user.name : '';
        return { text: 'ওয়ালাইকুম আসসালাম' + name + '!<br>কী সাহায্য করতে পারি?' };
    }
    if (matches(msg, ['ধন্যবাদ', 'thanks', 'thank you'])) {
        return { text: 'স্বাগতম! পড়াশোনায় এগিয়ে যাও!' };
    }
    if (matches(msg, ['সাহায্য', 'help', 'কমান্ড', 'কী করতে পারো'])) {
        return { text: 'আমি যা করতে পারি:<br><br><b>উত্তর দিতে পারি:</b><br>• "পিথাগোরাসের সূত্র কী?"<br>• "বৃত্তের ক্ষেত্রফল কীভাবে?"<br>• "নিউটনের সূত্র কী?"<br>• "কোষ কী?"<br>• "পড়ার টিপস দাও"<br><br><b>Navigate করতে পারি:</b><br>• "পরীক্ষা" / "সিলেবাস"<br>• "অগ্রগতি" / "প্রোফাইল"<br>• "ক্লাস ৯"' };
    }

    // 6. Motivational
    if (matches(msg, ['পড়তে মন চায় না', 'পড়তে ইচ্ছা করে না', 'পড়তে পারি না'])) {
        return { text: 'চিন্তা করো না!<br>ছোট করে শুরু করো — মাত্র ৫ মিনিট।<br>একবার শুরু করলে আর থামতে মন চাইবে না!' };
    }
    if (matches(msg, ['কঠিন লাগছে', 'বুঝতে পারছি না'])) {
        return { text: 'কঠিন লাগলে চ্যাপ্টার ভেঙে ভেঙে পড়ো।<br>নোট পড়ো → MCQ করো → আবার পড়ো।<br>তুমি পারবে ইনশাআল্লাহ!' };
    }
    if (matches(msg, ['মোটিভেশন', 'অনুপ্রেরণা'])) {
        return { text: 'সাফল্য একদিনে আসে না।<br>প্রতিদিন একটু একটু করে এগোলেই একদিন অনেক দূর পৌঁছে যাবে!' };
    }

    // 7. Fallback
    return { text: 'এটা আমার কাছে জমা রাখলাম।<br>আপাতত <b>"সাহায্য"</b> লিখে দেখো কী কী পারি।<br>অথবা সিলেবাস, পরীক্ষা বা নোটে যাও।' };
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

// ===== Page-specific init (only on ai.html) =====
function initAIPage() {
    const messagesEl = document.getElementById('aiMessages');
    const inputEl = document.getElementById('aiInput');
    const sendBtn = document.getElementById('aiSend');
    const quickEl = document.getElementById('aiQuick');
    const clearBtn = document.getElementById('clearChat');

    if (!messagesEl) return;

    // Load chat history from localStorage
    let chatHistory = JSON.parse(localStorage.getItem('cpb_mentor_chat') || '[]');

    if (chatHistory.length === 0) {
        // Welcome message
        addMessage('bot', 'হাই! আমি <b>PB Mentor</b>।<br>তোমার কি সাহায্য করতে পারি?');
        chatHistory.push({ role: 'bot', text: 'হাই! আমি <b>PB Mentor</b>।<br>তোমার কি সাহায্য করতে পারি?' });
        saveChat(chatHistory);
    } else {
        // Restore history
        chatHistory.forEach(m => addMessage(m.role, m.text, false));
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    sendBtn.addEventListener('click', send);
    inputEl.addEventListener('keypress', e => { if (e.key === 'Enter') send(); });

    if (quickEl) {
        quickEl.querySelectorAll('.ai-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                inputEl.value = btn.dataset.msg;
                send();
            });
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('চ্যাট রিসেট করবে?')) {
                localStorage.removeItem('cpb_mentor_chat');
                location.reload();
            }
        });
    }

    function send() {
        const msg = inputEl.value.trim();
        if (!msg) return;

        addMessage('user', msg);
        chatHistory.push({ role: 'user', text: msg });
        inputEl.value = '';

        // Typing indicator
        const typingEl = showTyping();

        setTimeout(() => {
            typingEl.remove();
            const reply = getBotResponse(msg);
            if (typeof reply === 'string') {
                addMessage('bot', reply);
                chatHistory.push({ role: 'bot', text: reply });
            } else {
                addMessage('bot', reply.text);
                chatHistory.push({ role: 'bot', text: reply.text });
                if (reply.navigate) {
                    setTimeout(() => location.href = reply.navigate, 1000);
                }
            }
            saveChat(chatHistory);
        }, 700);
    }

    function saveChat(h) {
        // Keep last 50 messages
        if (h.length > 50) h = h.slice(-50);
        localStorage.setItem('cpb_mentor_chat', JSON.stringify(h));
    }

    function addMessage(role, text, save = true) {
        const el = document.createElement('div');
        el.className = 'ai-msg ai-msg-' + role;
        if (role === 'bot') {
            el.innerHTML = '<div class="ai-avatar">PBM</div><div class="ai-bubble">' + text + '</div>';
        } else {
            el.innerHTML = '<div class="ai-bubble">' + escapeHtml(text) + '</div>';
        }
        messagesEl.appendChild(el);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
        const el = document.createElement('div');
        el.className = 'ai-msg ai-msg-bot';
        el.innerHTML = '<div class="ai-avatar">PBM</div><div class="ai-bubble ai-typing"><span></span><span></span><span></span></div>';
        messagesEl.appendChild(el);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return el;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIPage);
} else {
    initAIPage();
}
