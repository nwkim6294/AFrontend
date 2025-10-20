// 로그인 정보 (실제로는 세션이나 서버에서 가져와야 함)
const loggedInUser = {
    name: '홍길동',
    email: 'hong@example.com'
};

// 페이지 로드 시 저장된 설정 불러오기
window.addEventListener('DOMContentLoaded', function() {
    // 로그인 정보로 이름과 이메일 자동 입력
    document.getElementById('userName').value = loggedInUser.name;
    document.getElementById('userEmail').value = loggedInUser.email;

    // 저장된 직무 불러오기
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        const userData = JSON.parse(savedSettings);
        document.getElementById('jobSelect').value = userData.job || '';
    }
});

// 개인정보 섹션 토글
function togglePersonalInfo() {
    const section = document.getElementById('personalInfoSection');
    section.classList.toggle('expanded');
}

// 개인정보 저장
function savePersonalInfo() {
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const jobSelect = document.getElementById('jobSelect').value;
    
    if (!jobSelect) {
        alert('직무를 선택해주세요.');
        return;
    }
    
    const userData = {
        name: userName,
        email: userEmail,
        job: jobSelect
    };
    
    localStorage.setItem('userSettings', JSON.stringify(userData));
    showSuccessMessage('개인정보가 저장되었습니다.');
}

// 가이드 상세 페이지 표시
function showGuideDetail(type) {
    document.getElementById('guideMainMenu').style.display = 'none';
    
    document.getElementById('coreGuideDetail').classList.remove('active');
    document.getElementById('advancedGuideDetail').classList.remove('active');
    document.getElementById('tipsGuideDetail').classList.remove('active');
    
    if (type === 'core') {
        document.getElementById('coreGuideDetail').classList.add('active');
    } else if (type === 'advanced') {
        document.getElementById('advancedGuideDetail').classList.add('active');
    } else if (type === 'tips') {
        document.getElementById('tipsGuideDetail').classList.add('active');
    }
}

// 가이드 메인으로 돌아가기
function showGuideMain() {
    document.getElementById('guideMainMenu').style.display = 'block';
    document.getElementById('coreGuideDetail').classList.remove('active');
    document.getElementById('advancedGuideDetail').classList.remove('active');
    document.getElementById('tipsGuideDetail').classList.remove('active');
}

// 성공 메시지 표시
function showSuccessMessage(message) {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.style.cssText = `
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
    
    messageDiv.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>${message}</span>
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}