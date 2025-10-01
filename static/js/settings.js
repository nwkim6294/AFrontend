// 직무별 키워드 매핑
const jobKeywords = {
    developer: ['API', 'Git', 'CI/CD', 'Framework', 'Debugging', 'Backend', 'Frontend', 'Database'],
    designer: ['UI/UX', 'Figma', 'Prototype', 'Wireframe', 'Design System', 'Typography'],
    pm: ['Sprint', 'Backlog', 'Stakeholder', 'Roadmap', 'KPI', 'Agile', 'Scrum'],
    marketer: ['SEO', 'Conversion', 'Campaign', 'Analytics', 'CTR', 'ROI'],
    sales: ['Pipeline', 'Lead', 'Proposal', 'Closing', 'Revenue', 'Client']
};

// 단어 사전 데이터
const dictionary = [
    {
        term: 'API (Application Programming Interface)',
        definition: '애플리케이션 간 상호작용을 위한 인터페이스. 프로그램들이 서로 통신할 수 있도록 만든 규칙과 도구의 집합입니다.'
    },
    {
        term: 'Git',
        definition: '분산 버전 관리 시스템. 소스 코드의 변경 이력을 추적하고 여러 개발자가 협업할 수 있도록 돕는 도구입니다.'
    },
    {
        term: 'CI/CD (Continuous Integration/Continuous Deployment)',
        definition: '지속적 통합과 지속적 배포. 코드 변경사항을 자동으로 테스트하고 배포하는 개발 방법론입니다.'
    },
    {
        term: 'Framework',
        definition: '프레임워크. 애플리케이션 개발을 위한 기본 구조와 규칙을 제공하는 소프트웨어 플랫폼입니다.'
    },
    {
        term: 'Debugging',
        definition: '디버깅. 프로그램의 오류나 버그를 찾아내고 수정하는 과정입니다.'
    },
    {
        term: 'Backend',
        definition: '백엔드. 사용자가 볼 수 없는 서버 측 애플리케이션 로직과 데이터베이스를 다루는 영역입니다.'
    },
    {
        term: 'Frontend',
        definition: '프론트엔드. 사용자가 직접 보고 상호작용하는 웹사이트나 앱의 시각적 부분입니다.'
    },
    {
        term: 'Database',
        definition: '데이터베이스. 구조화된 정보나 데이터를 저장하고 관리하는 시스템입니다.'
    },
    {
        term: 'REST API',
        definition: 'Representational State Transfer API. HTTP 프로토콜을 사용하여 데이터를 주고받는 웹 서비스 아키텍처입니다.'
    },
    {
        term: 'Docker',
        definition: '도커. 애플리케이션을 컨테이너로 패키징하여 어디서든 실행할 수 있게 하는 플랫폼입니다.'
    },
    {
        term: 'Kubernetes',
        definition: '쿠버네티스. 컨테이너화된 애플리케이션의 배포, 확장, 관리를 자동화하는 오픈소스 시스템입니다.'
    },
    {
        term: 'Agile',
        definition: '애자일. 반복적이고 점진적인 개발을 통해 빠르게 변화에 대응하는 소프트웨어 개발 방법론입니다.'
    },
    {
        term: 'Scrum',
        definition: '스크럼. 팀이 짧은 주기로 작업하고 정기적으로 진행 상황을 점검하는 애자일 프레임워크입니다.'
    },
    {
        term: 'Sprint',
        definition: '스프린트. 일정 기간(보통 1-4주) 동안 특정 작업을 완료하는 개발 주기입니다.'
    },
    {
        term: 'MVP (Minimum Viable Product)',
        definition: '최소 기능 제품. 핵심 기능만 구현하여 빠르게 시장 반응을 테스트하는 제품입니다.'
    }
];

// 페이지 전환 함수들
function showMainMenu() {
    document.getElementById('settingsMenu').style.display = 'flex';
    document.getElementById('personalInfoPage').classList.add('hidden');
    document.getElementById('dictionaryPage').classList.add('hidden');
    document.getElementById('highlightPage').classList.add('hidden');
}

function showPersonalInfo() {
    document.getElementById('settingsMenu').style.display = 'none';
    document.getElementById('personalInfoPage').classList.remove('hidden');
}

function showDictionary() {
    document.getElementById('settingsMenu').style.display = 'none';
    document.getElementById('dictionaryPage').classList.remove('hidden');
    loadDictionary();
}

function showHighlight() {
    document.getElementById('settingsMenu').style.display = 'none';
    document.getElementById('highlightPage').classList.remove('hidden');
}

// 직무 선택 시 키워드 업데이트
document.addEventListener('DOMContentLoaded', function() {
    const jobSelect = document.getElementById('jobSelect');
    if (jobSelect) {
        jobSelect.addEventListener('change', updateKeywords);
    }

    // 하이라이트 옵션 클릭 이벤트
    const highlightOptions = document.querySelectorAll('.highlight-option');
    highlightOptions.forEach(option => {
        option.addEventListener('click', function() {
            highlightOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 단어 사전 검색
    const dictionarySearch = document.getElementById('dictionarySearch');
    if (dictionarySearch) {
        dictionarySearch.addEventListener('input', searchDictionary);
    }
});

function updateKeywords() {
    const jobSelect = document.getElementById('jobSelect');
    const keywordTags = document.getElementById('keywordTags');
    
    if (!jobSelect || !keywordTags) return;
    
    const selectedJob = jobSelect.value;
    keywordTags.innerHTML = '';
    
    if (selectedJob && jobKeywords[selectedJob]) {
        jobKeywords[selectedJob].forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'keyword-tag';
            tag.textContent = keyword;
            keywordTags.appendChild(tag);
        });
    }
}

// 단어 사전 로드
function loadDictionary() {
    const dictionaryList = document.getElementById('dictionaryList');
    if (!dictionaryList) return;
    
    dictionaryList.innerHTML = '';
    
    dictionary.forEach(item => {
        const dictItem = document.createElement('div');
        dictItem.className = 'dictionary-item';
        dictItem.innerHTML = `
            <div class="dictionary-term">${item.term}</div>
            <div class="dictionary-definition">${item.definition}</div>
        `;
        dictionaryList.appendChild(dictItem);
    });
}

// 단어 사전 검색
function searchDictionary() {
    const searchInput = document.getElementById('dictionarySearch');
    const dictionaryList = document.getElementById('dictionaryList');
    
    if (!searchInput || !dictionaryList) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    dictionaryList.innerHTML = '';
    
    const filteredDictionary = searchTerm 
        ? dictionary.filter(item => 
            item.term.toLowerCase().includes(searchTerm) || 
            item.definition.toLowerCase().includes(searchTerm)
          )
        : dictionary;
    
    if (filteredDictionary.length === 0) {
        dictionaryList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #9ca3af;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 16px;">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>검색 결과가 없습니다.</p>
            </div>
        `;
        return;
    }
    
    filteredDictionary.forEach(item => {
        const dictItem = document.createElement('div');
        dictItem.className = 'dictionary-item';
        dictItem.innerHTML = `
            <div class="dictionary-term">${item.term}</div>
            <div class="dictionary-definition">${item.definition}</div>
        `;
        dictionaryList.appendChild(dictItem);
    });
}

// 개인정보 저장
function savePersonalInfo() {
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const jobSelect = document.getElementById('jobSelect').value;
    
    if (!userName || !userEmail) {
        alert('이름과 이메일을 입력해주세요.');
        return;
    }
    
    // 실제로는 서버에 저장하는 로직이 필요
    const userData = {
        name: userName,
        email: userEmail,
        job: jobSelect,
        keywords: jobSelect ? jobKeywords[jobSelect] : []
    };
    
    // localStorage에 임시 저장
    localStorage.setItem('userSettings', JSON.stringify(userData));
    
    // 성공 메시지
    showSuccessMessage('개인정보가 저장되었습니다.');
}

// 하이라이트 설정 저장
function saveHighlight() {
    const activeOption = document.querySelector('.highlight-option.active');
    const highlightKeywords = document.getElementById('highlightKeywords').value;
    
    if (!highlightKeywords) {
        alert('하이라이트 키워드를 입력해주세요.');
        return;
    }
    
    // 실제로는 서버에 저장하는 로직이 필요
    const highlightSettings = {
        mode: activeOption ? activeOption.getAttribute('data-value') : 'before',
        keywords: highlightKeywords.split(',').map(k => k.trim()).filter(k => k)
    };
    
    // localStorage에 임시 저장
    localStorage.setItem('highlightSettings', JSON.stringify(highlightSettings));
    
    // 성공 메시지
    showSuccessMessage('하이라이트 설정이 저장되었습니다.');
}

// 성공 메시지 표시
function showSuccessMessage(message) {
    // 기존 메시지가 있으면 제거
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 새 메시지 생성
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
    
    // 3초 후 자동 제거
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// 페이지 로드 시 저장된 설정 불러오기
window.addEventListener('DOMContentLoaded', function() {
    // 저장된 사용자 설정 불러오기
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        const userData = JSON.parse(savedSettings);
        const userNameInput = document.getElementById('userName');
        const userEmailInput = document.getElementById('userEmail');
        const jobSelectInput = document.getElementById('jobSelect');
        
        if (userNameInput) userNameInput.value = userData.name || '';
        if (userEmailInput) userEmailInput.value = userData.email || '';
        if (jobSelectInput) {
            jobSelectInput.value = userData.job || '';
            updateKeywords();
        }
    }
    
    // 저장된 하이라이트 설정 불러오기
    const savedHighlight = localStorage.getItem('highlightSettings');
    if (savedHighlight) {
        const highlightData = JSON.parse(savedHighlight);
        const highlightKeywordsInput = document.getElementById('highlightKeywords');
        
        if (highlightKeywordsInput && highlightData.keywords) {
            highlightKeywordsInput.value = highlightData.keywords.join(', ');
        }
        
        // 하이라이트 모드 설정
        if (highlightData.mode) {
            const options = document.querySelectorAll('.highlight-option');
            options.forEach(option => {
                if (option.getAttribute('data-value') === highlightData.mode) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
    }
});

// 애니메이션 CSS 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);