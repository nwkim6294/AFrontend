// calendar.js

// 오늘 날짜 및 현재 표시 월 설정
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0-11
const today = new Date();
const todayOnlyDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

// 캘린더에 표시할 샘플 이벤트 데이터
let events = [
    // 10월 1일 (화요일) - 오늘
    { date: new Date(currentYear, 9, 1), title: "AI 모델 업데이트 검토", type: "important" }, 
    { date: new Date(currentYear, 9, 1), title: "팀 점심 회식 예약", type: "meeting" }, 

        { date: new Date(currentYear, 9, 1), title: "AI 모델 업데이트 검토", type: "important" }, 
    { date: new Date(currentYear, 9, 1), title: "팀 점심 회식 예약", type: "meeting" }, 

        { date: new Date(currentYear, 9, 1), title: "AI 모델 업데이트 검토", type: "important" }, 
    { date: new Date(currentYear, 9, 1), title: "팀 점심 회식 예약", type: "meeting" }, 

    
    { date: new Date(currentYear, 9, 1), title: "개인 학습 시간", type: "personal" }, 
    { date: new Date(currentYear, 9, 1), title: "차기 프로젝트 회의 준비", type: "personal" }, 
    { date: new Date(currentYear, 9, 1), title: "청구서 제출", type: "personal" }, 
    { date: new Date(currentYear, 9, 1), title: "장비 주문 및 확인", type: "personal" }, 
    { date: new Date(currentYear, 9, 1), title: "주간 성과 정리", type: "personal" },
    // 10월 2일 (수요일)
    { date: new Date(currentYear, 9, 2), title: "주간 업무 보고 회의", type: "meeting" },
    { date: new Date(currentYear, 9, 2), title: "새로운 프로젝트 기획", type: "important" },
    // 10월 3일 (목요일)
    { date: new Date(currentYear, 9, 3), title: "인사팀 면접 일정", type: "meeting" },
    // 10월 4일 (금요일)
    { date: new Date(currentYear, 9, 4), title: "보고서 최종 검토 마감", type: "important" },
    { date: new Date(currentYear, 9, 4), title: "주말 계획 정리", type: "personal" },
    // 10월 7일 (월요일)
    { date: new Date(currentYear, 9, 7), title: "개발팀 정기 주간회의", type: "meeting" },
    { date: new Date(currentYear, 9, 7), title: "마케팅 전략 회의", type: "meeting" },
];

// 사용자가 직접 추가한 Todo 항목
let todos = []; 

// HTML 요소 가져오기 - 안전하게 체크
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

    // 필수 요소가 없으면 초기화 중단
    if (!calendarGrid || !currentMonthYear) {
        console.warn('캘린더 요소를 찾을 수 없습니다.');
        return;
    }

    // 요일 이름
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    // 월 이름
    function formatMonthYear(year, monthIndex) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return `${monthNames[monthIndex]} ${year}`;
    }

    // 날짜를 YYYY-MM-DD 형식으로 변환 (로컬 타임존)
    function formatDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 특정 날짜의 이벤트 가져오기
    function getEventsForDate(date) {
        const dateString = formatDateString(date);
        return events.filter(event => {
            const eventDateString = formatDateString(event.date);
            return eventDateString === dateString;
        });
    }

    // 이벤트 점 생성
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

    // 캘린더 그리기
    function renderCalendar() {
        calendarGrid.innerHTML = '';
        
        currentMonthYear.textContent = formatMonthYear(currentYear, currentMonth);

        // 요일 헤더 추가
        dayNames.forEach(day => {
            const dayLabel = document.createElement('div');
            dayLabel.className = 'calendar-day-label';
            dayLabel.textContent = day;
            calendarGrid.appendChild(dayLabel);
        });

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        // 이전 달의 날짜 채우기
        for (let i = 0; i < firstDayOfMonth; i++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-cell other-month';
            const dayNumber = document.createElement('span');
            dayNumber.className = 'day-number';
            dayNumber.textContent = daysInPrevMonth - firstDayOfMonth + 1 + i;
            dayCell.appendChild(dayNumber);
            calendarGrid.appendChild(dayCell);
        }

        // 현재 달의 날짜 채우기
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
        
        // 다음 달의 날짜 채우기
        const totalCells = calendarGrid.children.length;
        const remainingCells = 7 - (totalCells % 7);
        
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
    }

    // 날짜 선택 시 이벤트 목록 표시
    function selectDay(dateString) {
        if (!dailyEventsList) return;

        document.querySelectorAll('.calendar-day-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });

        const selectedCell = document.querySelector(`.calendar-day-cell[data-date="${dateString}"]`);
        if (selectedCell) {
            selectedCell.classList.add('selected');
        }
        
        // 날짜 파싱 수정 - UTC 오프셋 문제 해결
        const [year, month, day] = dateString.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, day);
        const dayEvents = getEventsForDate(selectedDate);

        if (dailyEventsTitle) {
            dailyEventsTitle.textContent = `${selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}의 일정`;
        }
        
        if (dailyEventsContent) {
            dailyEventsContent.innerHTML = '';
            
            // 회의와 Todo 분리
            const meetings = dayEvents.filter(e => e.type === 'meeting' || e.type === 'important');
            const todos = dayEvents.filter(e => e.type === 'personal');

            // 회의 정렬 (important -> meeting)
            const typeOrder = { 'important': 1, 'meeting': 2 };
            meetings.sort((a, b) => (typeOrder[a.type] || 3) - (typeOrder[b.type] || 3));

            // 왼쪽: 회의
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
            
            // 오른쪽: Todo
            const todoSection = document.createElement('div');
            todoSection.className = 'daily-events-section';
            todoSection.innerHTML = '<div class="daily-events-section-title">To-do</div>';
            
            const todoList = document.createElement('div');
            todoList.className = 'daily-events-list';
            
            if (todos.length === 0) {
                todoList.innerHTML = '<p class="cell-secondary" style="text-align: center; padding: 16px;">등록된 할 일이 없습니다.</p>';
            } else {
                todos.forEach(event => {
                    const eventItem = document.createElement('div');
                    eventItem.className = `daily-event-item type-${event.type}`;
                    
                    let time = '종일';
                    if (event.title.includes('학습')) {
                        time = '14:00';
                    }
                    
                    eventItem.innerHTML = `
                        <div class="event-time">${time}</div>
                        <div class="event-details">
                            <div class="event-title">${event.title}</div>
                            <div class="event-meta">개인</div>
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
    }

    // 일별 이벤트 목록 닫기 - 전역으로 노출
    window.closeDailyEvents = function() {
        if (dailyEventsList) {
            dailyEventsList.classList.add('hidden');
        }
        document.querySelectorAll('.calendar-day-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
    }

    // 월 이동
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

    // 회의 리스트 렌더링
    function renderMeetingList() {
        if (!meetingListEl) return;

        const formattedDate = todayOnlyDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric'});
        if (meetingCardTitleContentEl) {
            meetingCardTitleContentEl.textContent = `${formattedDate}의 회의`;
        }

        const todayEvents = getEventsForDate(todayOnlyDate);
        const meetings = todayEvents.filter(event => event.type === 'meeting' || event.type === 'important');

        const typeOrder = { 'important': 1, 'meeting': 2 };
        meetings.sort((a, b) => {
            return (typeOrder[a.type] || 3) - (typeOrder[b.type] || 3);
        });

        meetingListEl.innerHTML = '';

        if (meetings.length === 0) {
            meetingListEl.innerHTML = '<p class="cell-secondary" style="text-align: center; padding: 16px 0;">오늘의 회의가 없습니다.</p>';
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

    // 오늘의 할 일 (Todo List) 렌더링
    function renderTodoList() {
        if (!todoListEl) return;

        const formattedDate = todayOnlyDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric'});
        if (todoCardTitleContentEl) {
            todoCardTitleContentEl.textContent = `${formattedDate}의 To-do`;
        }

        const todayEvents = getEventsForDate(todayOnlyDate);
        const personalEvents = todayEvents.filter(event => event.type === 'personal');

        const combinedTodos = [
            ...personalEvents,
            ...todos.map(t => ({ title: t.title, type: t.type }))
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
            todoListEl.innerHTML = '<p class="cell-secondary" style="text-align: center; padding: 16px 0;">오늘의 할 일이 없습니다.</p>';
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

    // 새로운 할 일 추가
    function addTodo() {
        if (!todoInput) return;

        const title = todoInput.value.trim();
        if (title) {
            const todayDate = todayOnlyDate;
            
            events.push({ 
                date: todayDate, 
                title: title, 
                type: "personal"
            });
            
            todos.push({
                date: todayDate,
                title: title,
                type: "personal"
            });

            todoInput.value = '';
            renderMeetingList();
            renderTodoList();
            renderCalendar();

            const todayString = formatDateString(todayDate);
            const selectedCell = document.querySelector(`.calendar-day-cell.selected`);
            if(selectedCell && selectedCell.classList.contains('selected') && selectedCell.dataset.date === todayString) {
                selectDay(todayString);
            }
        }
    }

    // 이벤트 리스너 연결
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
    
    const todayString = formatDateString(todayOnlyDate);
    const todayCell = document.querySelector(`.calendar-day-cell[data-date="${todayString}"]`);
    if (todayCell) {
        selectDay(todayString);
    }
}