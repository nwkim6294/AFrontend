/* ===============================
   Chatbot & Sidebar Fetch
=================================*/
document.addEventListener("DOMContentLoaded", () => {
    // 챗봇 로드
    fetch("components/chatbot.html")
        .then(res => res.text())
        .then(html => {
            const container = document.getElementById("chatbot-container");
            container.innerHTML = html;

            const closeBtn = container.querySelector(".close-chat-btn");
            const sendBtn = container.querySelector(".send-btn");
            const chatInput = container.querySelector("#chatInput");
            const floatingBtn = document.getElementById("floatingChatBtn");

            if (closeBtn) closeBtn.addEventListener("click", closeChat);
            if (sendBtn) sendBtn.addEventListener("click", sendMessage);
            if (chatInput) chatInput.addEventListener("keypress", handleChatEnter);
            if (floatingBtn) floatingBtn.addEventListener("click", openChat);
        });
    
    // 사이드바 로드
    fetch("components/sidebar.html")
        .then(res => res.text())
        .then(html => {
            const sidebar = document.getElementById("sidebar-container");
            sidebar.innerHTML = html;

            // ✅ 사이드바 로드 후 사용자 정보 주입
            injectUserInfo();

            // 현재 페이지 활성화
            const currentPage = window.location.pathname.split("/").pop();
            const navItems = sidebar.querySelectorAll(".nav-menu a");

            navItems.forEach(item => {
                const linkPath = item.getAttribute("href");
                if (linkPath === currentPage) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }
            });
        })
        .catch(error => {
            console.error('사이드바 로드 실패:', error);
        });
});

/* ===============================
   사용자 정보 표시 함수
=================================*/
function injectUserInfo() {
    // localStorage에서 사용자 정보 가져오기
    let user = null;
    const userData = localStorage.getItem("user");
    
    if (userData) {
        try { 
            user = JSON.parse(userData); 
        } catch(e) { 
            console.error('사용자 정보 파싱 실패:', e);
        }
    }
    
    // JWT 토큰에서 정보 추출 시도
    if (!user) {
        const token = getCookie('jwt') || localStorage.getItem('accessToken');
        if (token) {
            const payload = parseJwt(token);
            if (payload) {
                user = { 
                    name: payload.name || payload.email || "사용자", 
                    email: payload.email || "" 
                };
            }
        }
    }

    // 사용자 정보가 있으면 표시
    if (user) {
        // 이름 표시 (.user-name 셀렉터 사용)
        document.querySelectorAll(".user-name").forEach(el => {
            el.textContent = user.name || "사용자";
        });
        
        // 이메일 표시
        document.querySelectorAll(".user-email").forEach(el => {
            el.textContent = user.email || "";
        });
        
        // 아바타 표시
        document.querySelectorAll(".user-avatar").forEach(el => {
            el.textContent = user.name ? user.name.charAt(0).toUpperCase() : "U";
        });
        
        console.log("✅ 로그인 사용자 표시:", user.name);
    } else {
        console.warn("⚠️ 로그인 정보 없음");
        // 필요시 로그인 페이지로 리다이렉트
        // window.location.href = 'login.html';
    }
}

/* ===============================
   유틸리티 함수
=================================*/
function getCookie(name) {
    const cookies = document.cookie.split(";").map(c => c.trim());
    for (const cookie of cookies) {
        if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) { 
        console.error('JWT 파싱 실패:', e);
        return null; 
    }
}

/* ===============================
   챗봇 함수 (app.js에서 가져옴)
=================================*/
function openChat() {
    const chat = document.getElementById("chatBot");
    if (!chat) return;
    chat.classList.add("open");
    const floatingBtn = document.getElementById("floatingChatBtn");
    if (floatingBtn) floatingBtn.classList.add("hidden");
    document.body.classList.add("chat-open");
}

function closeChat() {
    const chat = document.getElementById("chatBot");
    if (!chat) return;
    chat.classList.remove("open");
    const floatingBtn = document.getElementById("floatingChatBtn");
    if (floatingBtn) floatingBtn.classList.remove("hidden");
    document.body.classList.remove("chat-open");
}

function sendMessage() {
    console.log("메시지 전송 (UI만)");
}

function handleChatEnter(e) {
    if (e.key === "Enter") sendMessage();
}

/* ===============================
   공통 메시지 함수
=================================*/
function showSuccessMessage(message) {
    const existing = document.querySelector('.success-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = 'success-message';
    msg.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        background: #10b981;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease;
    `;
    msg.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>${message}</span>
    `;
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => msg.remove(), 300);
    }, 3000);
}

function showErrorMessage(message) {
    const existing = document.querySelector('.error-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = 'error-message';
    msg.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        background: #ef4444;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease;
    `;
    msg.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>${message}</span>
    `;
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => msg.remove(), 300);
    }, 3000);
}

/* ===============================
   마이크 테스트 기능
=================================*/
let isTesting = false;
let audioContext = null;
let analyser = null;
let microphone = null;
let javascriptNode = null;
let micStream = null;

document.getElementById('micTestBtn').addEventListener('click', async function() {
    if (!isTesting) {
        try {
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(micStream);
            javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);

            javascriptNode.onaudioprocess = function() {
                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                const avg = array.reduce((a, b) => a + b) / array.length;
                const percent = Math.min(100, (avg / 128) * 100);
                document.getElementById('micLevelBar').style.width = percent + '%';
            };

            isTesting = true;
            this.classList.add('testing');
            this.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
                테스트 중지
            `;
            showSuccessMessage('마이크 테스트가 시작되었습니다');
        } catch {
            showErrorMessage('마이크 접근 권한이 필요합니다');
        }
    } else {
        if (microphone) microphone.disconnect();
        if (javascriptNode) javascriptNode.disconnect();
        if (audioContext) audioContext.close();

        if (micStream) {
            micStream.getTracks().forEach(track => track.stop());
            micStream = null;
        }

        document.getElementById('micLevelBar').style.width = '0%';
        isTesting = false;
        this.classList.remove('testing');
        this.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
            테스트 시작
        `;
        showSuccessMessage('마이크 테스트가 종료되었습니다');
    }
});

/* ===============================
   참석자 추가/삭제
=================================*/
const participantInput = document.getElementById('participant-name');
const participantList = document.querySelector('.participants-list');
document.querySelector('.add-participant-btn').addEventListener('click', () => {
    const name = participantInput.value.trim();
    if (!name) return;
    const item = document.createElement('div');
    item.className = 'participant-item';
    item.innerHTML = `
        <div class="participant-avatar">${name[0]}</div>
        <span class="participant-name">${name}</span>
        <button class="remove-participant-btn">✕</button>
    `;
    participantList.appendChild(item);
    participantInput.value = '';
    item.querySelector('.remove-participant-btn').addEventListener('click', () => {
        item.remove();
        showSuccessMessage('참석자가 삭제되었습니다');
    });
    showSuccessMessage('참석자가 추가되었습니다');
});

participantInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') document.querySelector('.add-participant-btn').click();
});
document.querySelectorAll('.remove-participant-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.participant-item').remove();
        showSuccessMessage('참석자가 삭제되었습니다');
    });
});

/* ===============================
   키워드 추가/삭제
=================================*/
const keywordInput = document.getElementById('keyword-input');
const keywordList = document.querySelector('.keywords-list');
document.querySelector('.add-keyword-btn').addEventListener('click', () => {
    const word = keywordInput.value.trim();
    if (!word) return;
    const tag = document.createElement('span');
    tag.className = 'keyword-tag';
    tag.innerHTML = `${word}<button class="remove-keyword-btn">✕</button>`;
    keywordList.appendChild(tag);
    keywordInput.value = '';
    tag.querySelector('.remove-keyword-btn').addEventListener('click', () => {
        tag.remove();
        showSuccessMessage('키워드가 삭제되었습니다');
    });
    showSuccessMessage('키워드가 추가되었습니다');
});

keywordInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') document.querySelector('.add-keyword-btn').click();
});
document.querySelectorAll('.remove-keyword-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.keyword-tag').remove();
        showSuccessMessage('키워드가 삭제되었습니다');
    });
});

/* ===============================
   회의 시작 / 취소
=================================*/
document.querySelector('.btn-primary').addEventListener('click', () => {
    const title = document.getElementById('meeting-title');
    const date = document.getElementById('meeting-date');

    title.classList.remove('error');
    date.classList.remove('error');

    if (!title.value.trim()) {
        title.classList.add('error');
        showErrorMessage('회의 제목을 입력해주세요');
        return;
    }
    if (!date.value) {
        date.classList.add('error');
        showErrorMessage('회의 일시를 선택해주세요');
        return;
    }

    // 회의 데이터 수집
    const participants = [];
    document.querySelectorAll('.participant-item').forEach(item => {
        participants.push(item.querySelector('.participant-name').textContent);
    });

    const keywords = [];
    document.querySelectorAll('.keyword-tag').forEach(tag => {
        const text = tag.textContent.replace('✕', '').trim();
        keywords.push(text);
    });

    const meetingData = {
        title: title.value.trim(),
        date: date.value,
        description: document.getElementById('meeting-description').value.trim(),
        participants: participants,
        keywords: keywords
    };

    // LocalStorage에 저장
    localStorage.setItem('currentMeeting', JSON.stringify(meetingData));

    showSuccessMessage('회의가 시작됩니다!');
    
    setTimeout(() => {
        window.location.href = 'recording.html';
    }, 1000);
});

document.querySelector('.btn-secondary').addEventListener('click', () => {
    if (confirm('입력한 내용이 저장되지 않습니다. 취소하시겠습니까?')) {
        window.history.back();
    }
});

/* ===============================
   기본 날짜 설정
=================================*/
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
document.getElementById('meeting-date').value = now.toISOString().slice(0, 16);