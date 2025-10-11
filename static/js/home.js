// localStorage 키
const STORAGE_KEY = 'calendar_events';
const TODO_STORAGE_KEY = 'calendar_todos';

// 현재 날짜
const today = new Date();
const todayOnlyDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

// 전역 변수 추가
let globalEvents = [];
let globalTodos = [];

// 날짜를 YYYY-MM-DD 형식으로 변환
function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// localStorage에서 이벤트 로드
function loadEvents() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map(event => ({
            ...event,
            date: new Date(event.date)
        }));
    }
    return getDefaultEvents();
}

// localStorage에서 TODO 로드
function loadTodos() {
    const stored = localStorage.getItem(TODO_STORAGE_KEY);
    if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map(todo => ({
            ...todo,
            date: new Date(todo.date)
        }));
    }
    return [];
}

// 기본 이벤트 데이터
function getDefaultEvents() {
    return [
        { date: new Date(currentYear, 9, 9), title: "AI 모델 업데이트 검토", type: "important" },
        { date: new Date(currentYear, 9, 9), title: "팀 점심 회식 예약", type: "meeting" },
        { date: new Date(currentYear, 9, 9), title: "개인 학습 시간", type: "personal" },
        { date: new Date(currentYear, 9, 10), title: "주간 업무 보고 회의", type: "meeting" },
        { date: new Date(currentYear, 9, 13), title: "개발팀 정기 주간회의", type: "meeting" },
    ];
}

// localStorage에 저장
function saveEvents(events) {
    console.log('💾 [홈] 이벤트 저장:', events.length, '개');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function saveTodos(todos) {
    console.log('💾 [홈] TODO 저장:', todos.length, '개');
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

// 특정 날짜의 이벤트 가져오기
function getEventsForDate(date, events) {
    const dateString = formatDateString(date);
    return events.filter(event => {
        const eventDateString = formatDateString(event.date);
        return eventDateString === dateString;
    });
}

// 월 이름 포맷
function formatMonthYear(year, monthIndex) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${monthNames[monthIndex]} ${year}`;
}

// 홈 캘린더 렌더링 (오늘 날짜 기준 현재 월)
function renderHomeCalendar(events) {
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;
    
    // 캘린더 헤더 업데이트
    const calendarHeader = document.querySelector('.calendar-month');
    if (calendarHeader) {
        calendarHeader.textContent = formatMonthYear(currentYear, currentMonth);
    }
    
    // 기존 날짜 셀만 찾기 (요일 라벨 제외)
    const dayLabels = calendarGrid.querySelectorAll('.calendar-day-label');
    const calendarDays = calendarGrid.querySelectorAll('.calendar-day');
    
    // 요일 라벨이 없으면 추가
    if (dayLabels.length === 0) {
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const fragment = document.createDocumentFragment();
        
        dayNames.forEach(day => {
            const dayLabel = document.createElement('div');
            dayLabel.className = 'calendar-day-label';
            dayLabel.textContent = day;
            fragment.appendChild(dayLabel);
        });
        
        calendarGrid.insertBefore(fragment, calendarGrid.firstChild);
    }
    
    // 기존 날짜 셀 제거
    calendarDays.forEach(day => day.remove());
    
    // 현재 월의 첫 날과 마지막 날 계산
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    const fragment = document.createDocumentFragment();
    
    // 이전 달 날짜 (빈 공간)
    for (let i = 0; i < firstDayOfMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day other-month';
        dayCell.textContent = daysInPrevMonth - firstDayOfMonth + 1 + i;
        fragment.appendChild(dayCell);
    }
    
    // 현재 달 날짜
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;
        
        const dayEvents = getEventsForDate(date, events);
        
        // 오늘 날짜 표시
        if (formatDateString(date) === formatDateString(todayOnlyDate)) {
            dayCell.classList.add('today');
        }
        
        // 이벤트가 있으면 표시
        if (dayEvents.length > 0) {
            dayCell.classList.add('has-event');
        }
        
        fragment.appendChild(dayCell);
    }
    
    // 다음 달 날짜 (남은 공간)
    const totalCells = firstDayOfMonth + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    
    for (let i = 1; i <= remainingCells; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day other-month';
        dayCell.textContent = i;
        fragment.appendChild(dayCell);
    }
    
    calendarGrid.appendChild(fragment);
    console.log('✅ [홈] 캘린더 렌더링 완료:', currentYear, '년', currentMonth + 1, '월');
}

// 홈 TODO 리스트 렌더링
function renderHomeTodoList(events, todos) {
    const todoListEl = document.querySelector('.todo-list');
    if (!todoListEl) return;
    
    const todayEvents = getEventsForDate(todayOnlyDate, events);
    const personalEvents = todayEvents.filter(e => e.type === 'personal');
    
    const todayTodos = todos.filter(t => {
        const todoDate = new Date(t.date);
        return formatDateString(todoDate) === formatDateString(todayOnlyDate);
    });
    
    const allTodos = [
        ...personalEvents.map(e => {
            // events에서 온 것도 todos에서 completed 상태 찾기
            const matchedTodo = todayTodos.find(t => t.title === e.title);
            return { 
                title: e.title, 
                completed: matchedTodo ? matchedTodo.completed : false, 
                type: 'personal' 
            };
        }),
        ...todayTodos.map(t => ({ 
            title: t.title, 
            completed: t.completed || false, 
            type: t.type 
        }))
    ];
    
    const uniqueTodos = [];
    const seenTitles = new Set();
    allTodos.forEach(todo => {
        if (!seenTitles.has(todo.title)) {
            seenTitles.add(todo.title);
            uniqueTodos.push(todo);
        }
    });
    
    todoListEl.innerHTML = '';
    
    if (uniqueTodos.length === 0) {
        todoListEl.innerHTML = `
            <div class="todo-item">
                <span class="cell-secondary" style="margin-left: 32px;">오늘의 할 일이 없습니다</span>
            </div>
        `;
        return;
    }
    
    uniqueTodos.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.id = `home-todo-${index}`;
        checkbox.checked = todo.completed || false;
        
        // 체크박스 변경 시 localStorage에 저장
        checkbox.addEventListener('change', (e) => {
            const isCompleted = e.target.checked;
            
            if (isCompleted) {
                todoItem.classList.add('completed');
            } else {
                todoItem.classList.remove('completed');
            }
            
            // globalTodos 사용
            const todoIndex = globalTodos.findIndex(t => 
                t.title === todo.title && 
                formatDateString(new Date(t.date)) === formatDateString(todayOnlyDate)
            );
            
            if (todoIndex !== -1) {
                globalTodos[todoIndex].completed = isCompleted;
            } else {
                globalTodos.push({
                    date: todayOnlyDate,
                    title: todo.title,
                    type: 'personal',
                    completed: isCompleted
                });
            }
            
            saveTodos(globalTodos);
            console.log('✅ [홈] TODO 완료 상태 저장:', todo.title, isCompleted);
        });
        
        const label = document.createElement('label');
        label.htmlFor = `home-todo-${index}`;
        label.className = 'todo-label';
        label.textContent = todo.title;
        
        todoItem.appendChild(checkbox);
        todoItem.appendChild(label);
        todoListEl.appendChild(todoItem);
    });
    
    console.log('✅ [홈] TODO 리스트 렌더링 완료:', uniqueTodos.length, '개');
}

// TODO 추가 버튼 설정
function setupTodoAddButton(events, todos) {
    const addBtn = document.querySelector('.add-todo-btn');
    
    if (!addBtn) {
        console.warn('[홈] TODO 추가 버튼을 찾을 수 없습니다.');
        return;
    }
    
    addBtn.addEventListener('click', () => {
        const title = prompt('새로운 할 일을 입력하세요:');
        
        if (!title || title.trim() === '') {
            return;
        }
        
        const newEvent = {
            date: todayOnlyDate,
            title: title.trim(),
            type: 'personal'
        };
        
        const newTodo = {
            date: todayOnlyDate,
            title: title.trim(),
            type: 'personal',
            completed: false
        };
        
        // globalEvents, globalTodos 사용
        globalEvents.push(newEvent);
        globalTodos.push(newTodo);
        
        saveEvents(globalEvents);
        saveTodos(globalTodos);
        
        console.log('✅ [홈] TODO 추가:', title);
        
        renderHomeCalendar(globalEvents);
        renderHomeTodoList(globalEvents, globalTodos);
    });
}

// "캘린더 보기" 버튼 클릭 시 캘린더 페이지로 이동
function setupCalendarViewButton() {
    const calendarCard = document.querySelector('.card');
    if (!calendarCard) return;
    
    const calendarViewBtn = calendarCard.querySelector('.card-link');
    
    if (calendarViewBtn) {
        calendarViewBtn.style.cursor = 'pointer';
        
        calendarViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('📅 캘린더 페이지로 이동');
            window.location.href = 'calendar.html';
        });
    }
}

// 홈 페이지가 표시될 때마다 데이터 새로고침
window.refreshHomeData = function() {
    console.log('🔄 [홈] 데이터 새로고침');
    globalEvents = loadEvents();
    globalTodos = loadTodos();
    renderHomeCalendar(globalEvents);
    renderHomeTodoList(globalEvents, globalTodos);
};

// 홈 페이지 초기화
function initHome() {
    console.log('🏠 홈 페이지 초기화 시작');
    console.log('📅 오늘 날짜:', formatDateString(todayOnlyDate));
    
    // 전역 변수에 할당
    globalEvents = loadEvents();
    globalTodos = loadTodos();
    
    console.log('📌 로드된 이벤트:', globalEvents.length, '개');
    console.log('✅ 로드된 TODO:', globalTodos.length, '개');
    
    const todayEvents = getEventsForDate(todayOnlyDate, globalEvents);
    console.log('🎯 오늘의 이벤트:', todayEvents.length, '개');
    
    renderHomeCalendar(globalEvents);
    renderHomeTodoList(globalEvents, globalTodos);
    setupTodoAddButton(globalEvents, globalTodos);
    setupCalendarViewButton();
    
    console.log('✅ 홈 페이지 초기화 완료');
}

// 페이지 복귀 시 데이터 새로고침
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        console.log('🔄 [홈] 페이지 복귀 - 데이터 새로고침');
        window.refreshHomeData();
    }
});

// localStorage 변경 감지
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY || e.key === TODO_STORAGE_KEY) {
        console.log('🔄 [홈] localStorage 변경 감지');
        window.refreshHomeData();
    }
});

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHome);
} else {
    initHome();
}

// 회의록 관리 페이지로 이동
function goToMeetings() {
    window.location.href = 'meetings.html';  // 회의록 관리 페이지 경로
}