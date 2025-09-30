let isRecording = false;

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

function toggleRecording() {
    isRecording = !isRecording;
    const recordBtn = document.getElementById('recordBtn');
    const recordingAlert = document.getElementById('recordingAlert');
    
    if (isRecording) {
        recordBtn.classList.add('recording');
        recordBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
            녹음 중지
        `;
        recordingAlert.classList.add('active');
        
        // Simulate adding new transcript
        setTimeout(() => {
            const transcriptList = document.getElementById('transcriptList');
            const newItem = document.createElement('div');
            newItem.className = 'transcript-item';
            newItem.innerHTML = `
                <div class="speaker-avatar">박</div>
                <div class="transcript-content">
                    <div class="transcript-meta">
                        <span class="speaker-name">박지민</span>
                        <span class="timestamp">01:20</span>
                    </div>
                    <p class="transcript-text">추가로 논의할 사항이 있습니다.</p>
                </div>
            `;
            transcriptList.appendChild(newItem);
        }, 2000);
    } else {
        recordBtn.classList.remove('recording');
        recordBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            </svg>
            녹음 시작
        `;
        recordingAlert.classList.remove('active');
    }
}