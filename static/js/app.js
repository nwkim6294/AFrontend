function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

function changePage(pageName) {
    // Hide all pages
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('recordingPage').classList.add('hidden');
    document.getElementById('meetingsPage').classList.add('hidden');

    // Show selected page
    if (pageName === 'main') {
        document.getElementById('mainPage').classList.remove('hidden');
    } else if (pageName === 'recording') {
        document.getElementById('recordingPage').classList.remove('hidden');
    } else if (pageName === 'meetings') {
        document.getElementById('meetingsPage').classList.remove('hidden');
    }

    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
}

function openChat() {
  const chat = document.getElementById("chatBot");
  if (!chat) return;
  chat.classList.add("open");
  document.getElementById("floatingChatBtn").classList.add("hidden");
  document.body.classList.add("chat-open");
}

function closeChat() {
  const chat = document.getElementById("chatBot");
  if (!chat) return;
  chat.classList.remove("open");
  document.getElementById("floatingChatBtn").classList.remove("hidden");
  document.body.classList.remove("chat-open");
}

// 👉 지금은 UI만! 더미 함수
function sendMessage() {
  console.log("메시지 전송 (UI만)");
}
function handleChatEnter(e) {
  if (e.key === "Enter") sendMessage();
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}


// 페이지 전환 함수
function showPage(pageName) {
    // 모든 페이지 숨기기
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // 선택한 페이지 보이기
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
    
    // 네비게이션 활성화 상태 변경
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeNav = document.querySelector(`[data-page="${pageName}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
    
    // 홈으로 돌아올 때 데이터 새로고침
    if (pageName === 'home' && typeof window.refreshHomeData === 'function') {
        window.refreshHomeData();
    }
    
    // 캘린더로 이동할 때 초기화
    if (pageName === 'calendar' && typeof initCalendar === 'function') {
        initCalendar();
    }
}

// 네비게이션 이벤트 리스너
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const pageName = item.getAttribute('data-page');
        showPage(pageName);
    });
});