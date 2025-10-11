let isEditMode = false;
let originalContent = '';

// 뒤로가기
function goBack() {
  window.history.back();
}

// 수정 모드 토글
function toggleEdit() {
  isEditMode = !isEditMode;
  
  const contentView = document.getElementById('contentView');
  const contentEditor = document.getElementById('contentEditor');
  const editNotice = document.getElementById('editNotice');
  const editActions = document.getElementById('editActions');
  const editToggleBtn = document.getElementById('editToggleBtn');
  
  if (isEditMode) {
    // 수정 모드 활성화
    originalContent = contentView.innerHTML;
    contentEditor.value = contentView.innerText;
    
    contentView.classList.add('hidden');
    contentEditor.classList.remove('hidden');
    editNotice.classList.remove('hidden');
    editActions.classList.remove('hidden');
    
    editToggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
      취소
    `;
  } else {
    // 수정 모드 비활성화
    cancelEdit();
  }
}

// 수정 취소
function cancelEdit() {
  isEditMode = false;
  
  const contentView = document.getElementById('contentView');
  const contentEditor = document.getElementById('contentEditor');
  const editNotice = document.getElementById('editNotice');
  const editActions = document.getElementById('editActions');
  const editToggleBtn = document.getElementById('editToggleBtn');
  
  contentView.classList.remove('hidden');
  contentEditor.classList.add('hidden');
  editNotice.classList.add('hidden');
  editActions.classList.add('hidden');
  
  editToggleBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
    수정
  `;
}

// 수정 저장
function saveEdit() {
  const contentEditor = document.getElementById('contentEditor');
  const contentView = document.getElementById('contentView');
  
  const newContent = contentEditor.value;
  
  // 간단한 텍스트를 HTML로 변환 (실제로는 마크다운 파서 등 사용)
  const formattedContent = formatContent(newContent);
  contentView.innerHTML = formattedContent;
  
  // 서버에 저장하는 로직 추가 필요
  console.log('Content saved:', newContent);
  
  // 수정 모드 종료
  cancelEdit();
  
  // 저장 완료 알림
  showNotification('회의록이 저장되었습니다.');
}

// 간단한 텍스트 포맷팅
function formatContent(text) {
  // 실제로는 마크다운 파서나 더 복잡한 로직 사용
  return text
    .split('\n\n')
    .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

// PDF 내보내기
function exportToPDF() {
  // 실제 PDF 생성 로직은 jsPDF 같은 라이브러리 사용
  console.log('Exporting to PDF...');
  
  // 간단한 구현: 인쇄 대화상자 열기
  window.print();
  
  showNotification('PDF 다운로드가 준비되었습니다.');
}

// 알림 표시
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// 우선순위 변경
const prioritySelect = document.getElementById('prioritySelect');
if (prioritySelect) {
  prioritySelect.addEventListener('change', (e) => {
    const newPriority = e.target.value;
    e.target.className = `priority-select-large ${newPriority}`;
    
    // 서버에 저장하는 로직 추가 필요
    console.log('Priority changed to:', newPriority);
    showNotification('우선순위가 변경되었습니다.');
  });
}

// 키워드 클릭 이벤트
document.querySelectorAll('.keyword-chip').forEach(chip => {
  chip.addEventListener('click', (e) => {
    const keyword = e.target.textContent;
    console.log('Keyword clicked:', keyword);
    // 키워드 검색이나 필터링 기능 추가 가능
  });
});