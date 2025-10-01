// 탭 전환 기능
const signinTab = document.getElementById('signinTab');
const signupTab = document.getElementById('signupTab');
const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');
const authContainer = document.querySelector('.auth-container');
 
signinTab.addEventListener('click', function() {
    signinTab.classList.add('active');
    signupTab.classList.remove('active');
    signinForm.classList.add('active');
    signupForm.classList.remove('active');
    authContainer.classList.remove('signup-mode'); // 이 줄 추가
    hideAlerts();
});

signupTab.addEventListener('click', function() {
    signupTab.classList.add('active');
    signinTab.classList.remove('active');
    signupForm.classList.add('active');
    signinForm.classList.remove('active');
    authContainer.classList.add('signup-mode'); // 이 줄 추가
    hideAlerts();
});

// 비밀번호 표시/숨기기 - SVG 아이콘 전환
const passwordToggles = document.querySelectorAll('.password-toggle');

passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const eyeIcon = this.querySelector('.eye-icon');
        const eyeOffIcon = this.querySelector('.eye-off-icon');
        
        if (input.type === 'password') {
            input.type = 'text';
            eyeIcon.style.display = 'none';
            eyeOffIcon.style.display = 'block';
        } else {
            input.type = 'password';
            eyeIcon.style.display = 'block';
            eyeOffIcon.style.display = 'none';
        }
    });
});

// 팝업 알림 메시지 표시 (회원가입용)
function showAlert(message, type) {
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    
    hideAlerts();
    
    const alert = type === 'error' ? errorAlert : successAlert;
    alert.textContent = message;
    alert.classList.add('show');
    
    // 3초 후 자동 숨김
    setTimeout(hideAlerts, 3000);
}

function hideAlerts() {
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    
    errorAlert.classList.remove('show');
    successAlert.classList.remove('show');
}

// 로그인 폼 제출 - 메시지 없이 바로 처리
signinForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    // 간단한 유효성 검사만 수행 (메시지 없음)
    if (!email || !password) {
        return;
    }
    
    console.log('로그인 시도:', { email, password });
    
    // 실제 API 호출은 여기에 구현
    // fetch('/api/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password })
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.success) {
    //         window.location.href = '/index.html';
    //     }
    // });
    
    // 임시: 바로 메인 페이지로 이동
    // window.location.href = '/index.html';
});

// 회원가입 폼 제출 - 유효성 검사 메시지만 표시
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const terms = document.getElementById('terms').checked;
    
    // 필수 필드 검증
    if (!name || !email || !password || !confirm) {
        showAlert('모든 필드를 입력해주세요.', 'error');
        return;
    }
    
    // 이름 길이 검증
    if (name.trim().length < 2) {
        showAlert('이름은 2자 이상 입력해주세요.', 'error');
        return;
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
    }
    
    // 비밀번호 길이 검증
    if (password.length < 6) {
        showAlert('비밀번호는 6자 이상 입력해주세요.', 'error');
        return;
    }
    
    // 비밀번호 일치 검증
    if (password !== confirm) {
        showAlert('비밀번호가 일치하지 않습니다.', 'error');
        return;
    }
    
    // 약관 동의 검증
    if (!terms) {
        showAlert('이용약관에 동의해주세요.', 'error');
        return;
    }
    
    // 유효성 검사 통과
    console.log('회원가입 시도:', { name, email, password });
    
    // 실제 API 호출은 여기에 구현
    // fetch('/api/signup', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, email, password })
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.success) {
    //         showAlert('회원가입 성공!', 'success');
    //         setTimeout(() => {
    //             signinTab.click();
    //             signupForm.reset();
    //         }, 2000);
    //     } else {
    //         showAlert(data.message, 'error');
    //     }
    // });
    
    // 임시 처리
    showAlert('회원가입 성공!', 'success');
    setTimeout(() => {
        signinTab.click();
        signupForm.reset();
    }, 2000);
});

// Google 로그인 - 메시지 없이 처리
const googleLoginBtn = document.getElementById('googleLoginBtn');
googleLoginBtn.addEventListener('click', function() {
    console.log('Google 로그인 시작');
    
    // Google OAuth 2.0 로그인 구현
    // window.location.href = '/auth/google';
});

// Google 회원가입 - 메시지 없이 처리
const googleSignupBtn = document.getElementById('googleSignupBtn');
googleSignupBtn.addEventListener('click', function() {
    console.log('Google 회원가입 시작');
    
    // Google OAuth 2.0 회원가입 구현
    // window.location.href = '/auth/google';
});

// Enter 키로 다음 필드 이동
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.type !== 'submit' && this.type !== 'checkbox') {
            const form = this.closest('form');
            const inputs = Array.from(form.querySelectorAll('input:not([type="checkbox"])'));
            const index = inputs.indexOf(this);
            
            if (index < inputs.length - 1) {
                e.preventDefault();
                inputs[index + 1].focus();
            }
        }
    });
});

// 페이지 로드 시 첫 번째 입력 필드에 포커스
window.addEventListener('load', function() {
    const firstInput = document.querySelector('#signinForm input[type="email"]');
    if (firstInput) {
        firstInput.focus();
    }
});