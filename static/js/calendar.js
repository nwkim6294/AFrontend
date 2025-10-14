// localStorage 키
const STORAGE_KEY = 'calendar_events';
const TODO_STORAGE_KEY = 'calendar_todos';

// 오늘 날짜 및 현재 표시 월 설정
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
const today = new Date();
const todayOnlyDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
let selectedDate = todayOnlyDate; // 기본값은 오늘

// localStorage 저장 함수
function saveEventsToStorage(events) {
    console.log('💾 [캘린더] 이벤트 저장:', events.length, '개');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function saveTodosToStorage(todos) {
    console.log('💾 [캘린더] TODO 저장:', todos.length, '개');
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

// localStorage 로드 함수
function loadEventsFromStorage() {
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

function loadTodosFromStorage() {
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
        { date: new Date(currentYear, 9, 9), title: "차기 프로젝트 회의 준비", type: "personal" }, 
        { date: new Date(currentYear, 9, 9), title: "청구서 제출", type: "personal" }, 
        { date: new Date(currentYear, 9, 9), title: "장비 주문 및 확인", type: "personal" }, 
        { date: new Date(currentYear, 9, 9), title: "주간 성과 정리", type: "personal" },
        { date: new Date(currentYear, 9, 10), title: "주간 업무 보고 회의", type: "meeting" },
        { date: new Date(currentYear, 9, 10), title: "새로운 프로젝트 기획", type: "important" },
        { date: new Date(currentYear, 9, 11), title: "인사팀 면접 일정", type: "meeting" },
        { date: new Date(currentYear, 9, 12), title: "보고서 최종 검토 마감", type: "important" },
        { date: new Date(currentYear, 9, 12), title: "주말 계획 정리", type: "personal" },
        { date: new Date(currentYear, 9, 13), title: "개발팀 정기 주간회의", type: "meeting" },
        { date: new Date(currentYear, 9, 13), title: "마케팅 전략 회의", type: "meeting" },
    ];
}

// localStorage에서 데이터 로드
let events = loadEventsFromStorage();
let todos = loadTodosFromStorage();
window.todos = todos; // ✅ 전역 접근 가능하게

// localStorage가 비어있을 때만 시드 데이터
if (events.length === 0) {
    events = getDefaultEvents();
    saveEventsToStorage(events);
}

console.log('📌 [캘린더] 초기 로드 - 이벤트:', events.length, 'TODO:', todos.length);

// HTML 요소 가져오기
function initCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const dailyEventsList = document.getElementById('dailyEventsList');
    const dailyEventsTitle = document.getElementById('dailyEventsTitle');
    const dailyEventsContent = document.getElementById('dailyEventsContent');
    const meetingListEl = document.getElementById('meetingList');
    const meetingCardTitleContentEl = document.getElementById('meetingCardTitleContent');
    const meetingCountEl = document.getElementById('meetingCount');
    const todoListEl = document.getElementById('todoList');
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoCardTitleContentEl = document.getElementById('todoCardTitleContent');
    const todoCountEl = document.getElementById('todoCount');

    if (!calendarGrid || !currentMonthYear) {
        console.warn('캘린더 요소를 찾을 수 없습니다.');
        return;
    }

    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    function formatMonthYear(year, monthIndex) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return `${monthNames[monthIndex]} ${year}`;
    }

    function formatDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getEventsForDate(date) {
        const dateString = formatDateString(date);
        return events.filter(event => {
            const eventDateString = formatDateString(event.date);
            return eventDateString === dateString;
        });
    }

    function createEventDots(dayEvents) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'event-dots';
        
        const uniqueTypes = [...new Set(dayEvents.map(e => e.type))];
        
        uniqueTypes.forEach(type => {
            const dot = document.createElement('span');
            dot.className = `event-dot event-type-${type}`;
            dotsContainer.appendChild(dot);
        });
        
        return dotsContainer;
    }

    function renderCalendar() {
        calendarGrid.innerHTML = '';
        
        currentMonthYear.textContent = formatMonthYear(currentYear, currentMonth);

        dayNames.forEach(day => {
            const dayLabel = document.createElement('div');
            dayLabel.className = 'calendar-day-label';
            dayLabel.textContent = day;
            calendarGrid.appendChild(dayLabel);
        });

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-cell other-month';
            const dayNumber = document.createElement('span');
            dayNumber.className = 'day-number';
            dayNumber.textContent = daysInPrevMonth - firstDayOfMonth + 1 + i;
            dayCell.appendChild(dayNumber);
            calendarGrid.appendChild(dayCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-cell';
            dayCell.dataset.date = formatDateString(date);
            
            if (formatDateString(date) === formatDateString(todayOnlyDate)) {
                dayCell.classList.add('today');
            }

            const dayNumber = document.createElement('span');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);

            const dayEvents = getEventsForDate(date);
            if (dayEvents.length > 0) {
                const eventDots = createEventDots(dayEvents);
                dayCell.appendChild(eventDots);
            }

            dayCell.addEventListener('click', () => {
                selectDay(dayCell.dataset.date);
            });

            calendarGrid.appendChild(dayCell);
        }
        
        // 다음 달 날짜 채우기
        const totalCells = calendarGrid.children.length;
        const remainingCells = 7 - ((totalCells - 7) % 7);
        
        if (remainingCells < 7) {
            for (let i = 1; i <= remainingCells; i++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-day-cell other-month';
                const dayNumber = document.createElement('span');
                dayNumber.className = 'day-number';
                dayNumber.textContent = i;
                dayCell.appendChild(dayNumber);
                calendarGrid.appendChild(dayCell);
            }
        }
        
        // 마지막에 총 행 개수 계산
        const totalRows = Math.ceil((calendarGrid.children.length - 7) / 7); // 요일 라벨 제외
        
        // 동적으로 grid-template-rows 설정
        calendarGrid.style.gridTemplateRows = `auto repeat(${totalRows}, 1fr)`;
    }

    function selectDay(dateString) {
        if (!dailyEventsList) return;

        document.querySelectorAll('.calendar-day-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });

        const selectedCell = document.querySelector(`.calendar-day-cell[data-date="${dateString}"]`);
        if (selectedCell) {
            selectedCell.classList.add('selected');
        }
        
        const [year, month, day] = dateString.split('-').map(Number);
        selectedDate = new Date(year, month - 1, day);
        const dayEvents = getEventsForDate(selectedDate);
        
        if (dailyEventsTitle) {
            dailyEventsTitle.textContent = `${selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}의 일정`;
        }
        
        if (dailyEventsContent) {
            dailyEventsContent.innerHTML = '';
            
            const meetings = dayEvents.filter(e => e.type === 'meeting' || e.type === 'important');
            const todos = dayEvents.filter(e => e.type === 'personal');

            const typeOrder = { 'important': 1, 'meeting': 2 };
            meetings.sort((a, b) => (typeOrder[a.type] || 3) - (typeOrder[b.type] || 3));

            const meetingSection = document.createElement('div');
            meetingSection.className = 'daily-events-section';
            meetingSection.innerHTML = '<div class="daily-events-section-title">회의</div>';
            
            const meetingList = document.createElement('div');
            meetingList.className = 'daily-events-list';
            
            if (meetings.length === 0) {
                meetingList.innerHTML = '<p class="cell-secondary" style="text-align: center; padding: 16px;">등록된 회의가 없습니다.</p>';
            } else {
                meetings.forEach(event => {
                    const eventItem = document.createElement('div');
                    eventItem.className = `daily-event-item type-${event.type}`;
                    
                    let time = '종일';
                    if (event.title.includes('회의')) {
                        time = '10:00';
                    } else if (event.title.includes('마감')) {
                        time = '18:00';
                    }
                    
                    eventItem.innerHTML = `
                        <div class="event-time">${time}</div>
                        <div class="event-details">
                            <div class="event-title">${event.title}</div>
                            <div class="event-meta">${event.type === 'meeting' ? '팀 회의' : '중요'}</div>
                        </div>
                    `;
                    meetingList.appendChild(eventItem);
                });
            }
            
            meetingSection.appendChild(meetingList);
            
            // selectDay 함수 내부의 To-do 섹션
            const todoSection = document.createElement('div');
            todoSection.className = 'daily-events-section';
            todoSection.innerHTML = '<div class="daily-events-section-title">To-do</div>';

            const todoList = document.createElement('div');
            todoList.className = 'daily-events-list';

            if (todos.length === 0) {
                todoList.innerHTML = '<p class="cell-secondary" style="text-align: center; padding: 16px;">등록된 할 일이 없습니다.</p>';
            } else {
                todos.forEach(event => {
                    // todos 배열에서 completed 상태 확인
                    const selectedDateString = formatDateString(selectedDate);
                    const matchedTodo = window.todos.find(t => 
                        t.title === event.title && 
                        formatDateString(new Date(t.date)) === selectedDateString
                    );
                    const isCompleted = matchedTodo ? matchedTodo.completed : false;
                    
                    const eventItem = document.createElement('div');
                    eventItem.className = `daily-event-item type-${event.type} ${isCompleted ? 'completed' : ''}`;
                    
                    let time = '종일';
                    if (event.title.includes('학습')) {
                        time = '14:00';
                    }
                    
                    eventItem.innerHTML = `
                        <div class="event-time">${time}</div>
                        <div class="event-details">
                            <div class="event-title" style="${isCompleted ? 'text-decoration: line-through; color: #9ca3af;' : ''}">${event.title}</div>
                            <div class="event-meta">개인${isCompleted ? ' • 완료' : ''}</div>
                        </div>
                    `;
                    todoList.appendChild(eventItem);
                });
            }
            
            todoSection.appendChild(todoList);
            
            dailyEventsContent.appendChild(meetingSection);
            dailyEventsContent.appendChild(todoSection);
        }

        dailyEventsList.classList.remove('hidden');

        renderTodoList();  // 우측 TODO 카드 업데이트
        renderMeetingList(); // 우측 회의 카드도 업데이트 (필요시)
    }

    window.closeDailyEvents = function() {
        if (dailyEventsList) {
            dailyEventsList.classList.add('hidden');
        }
        document.querySelectorAll('.calendar-day-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
    }

    function changeMonth(direction) {
        currentMonth += direction;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
        if (dailyEventsList) {
            dailyEventsList.classList.add('hidden');
        }
    }

    function renderMeetingList() {
        if (!meetingListEl) return;

        // selectedDate 사용 (todayOnlyDate → selectedDate)
        const formattedDate = selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric'});
        if (meetingCardTitleContentEl) {
            meetingCardTitleContentEl.textContent = `${formattedDate}의 회의`;
        }

        // 선택된 날짜의 이벤트 가져오기
        const selectedEvents = getEventsForDate(selectedDate);
        const meetings = selectedEvents.filter(event => event.type === 'meeting' || event.type === 'important');

        const typeOrder = { 'important': 1, 'meeting': 2 };
        meetings.sort((a, b) => {
            return (typeOrder[a.type] || 3) - (typeOrder[b.type] || 3);
        });

        meetingListEl.innerHTML = '';

        if (meetings.length === 0) {
            meetingListEl.innerHTML = '<p class="cell-secondary" style="text-align: center; padding: 16px 0;">회의가 없습니다.</p>';
            if (meetingCountEl) {
                meetingCountEl.textContent = `(총 0개)`;
            }
            return;
        }

        meetings.forEach(item => {
            const meetingItem = document.createElement('div');
            meetingItem.className = 'meeting-item';
            meetingItem.innerHTML = `
                <span class="meeting-item-dot event-type-${item.type}"></span>
                <span class="meeting-item-text">${item.title}</span>
            `;
            meetingListEl.appendChild(meetingItem);
        });

        if (meetingCountEl) {
            meetingCountEl.textContent = `(총 ${meetings.length}개)`;
        }
    }

    function renderTodoList() {
    if (!todoListEl) return;

    // 선택된 날짜 사용
    const formattedDate = selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric'});
    if (todoCardTitleContentEl) {
        todoCardTitleContentEl.textContent = `${formattedDate}의 To-do`;
    }

    // 선택된 날짜의 이벤트 가져오기
    const selectedEvents = getEventsForDate(selectedDate);
    const personalEvents = selectedEvents.filter(event => event.type === 'personal');

    // 선택된 날짜의 TODO만 필터링
    const selectedDateString = formatDateString(selectedDate);
    const selectedTodos = todos.filter(t => {
        const todoDateString = formatDateString(new Date(t.date));
        return todoDateString === selectedDateString;
    });

    const combinedTodos = [
        ...personalEvents,
        ...selectedTodos.map(t => ({ title: t.title, type: t.type }))
    ];

    const uniqueTitles = new Set();
    let finalTodos = [];
    combinedTodos.forEach(item => {
        if (!uniqueTitles.has(item.title)) {
            uniqueTitles.add(item.title);
            finalTodos.push(item);
        }
    });

    todoListEl.innerHTML = '';

    if (finalTodos.length === 0) {
        todoListEl.innerHTML = '<p class="cell-secondary" style="text-align: center; padding: 16px 0;">등록된 할 일이 없습니다.</p>';
        if (todoCountEl) {
            todoCountEl.textContent = `(총 0개)`;
        }
        return;
    }

    finalTodos.forEach(item => {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.innerHTML = `
            <span class="todo-item-dot event-type-${item.type}"></span>
            <span class="todo-item-text">${item.title}</span>
        `;
        todoListEl.appendChild(todoItem);
    });

    if (todoCountEl) {
        todoCountEl.textContent = `(총 ${finalTodos.length}개)`;
    }
}

    // addTodo 함수도 수정 - 선택한 날짜에 추가
    function addTodo() {
        if (!todoInput) return;

        const title = todoInput.value.trim();
        if (title) {
            events.push({ 
                date: selectedDate,
                title: title, 
                type: "personal"
            });
            
            todos.push({
                date: selectedDate,
                title: title,
                type: "personal",
                completed: false // 기본값 false
            });
            
            window.todos = todos; // 전역 업데이트

            saveEventsToStorage(events);
            saveTodosToStorage(todos);

            todoInput.value = '';
            renderMeetingList();
            renderTodoList();
            renderCalendar();

            // 팝업도 다시 렌더링 (추가된 TODO가 팝업에도 표시됨)
            const selectedString = formatDateString(selectedDate);
            selectDay(selectedString);
        }
    }

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    }
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => changeMonth(1));
    }
    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', addTodo);
    }
    if (todoInput) {
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo();
            }
        });
    }

    // 초기 렌더링
    renderCalendar();
    renderMeetingList();
    renderTodoList();
}

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalendar);
} else {
    initCalendar();
}