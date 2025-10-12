/* ===============================
   Chatbot & Sidebar Fetch
=================================*/
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

fetch("components/sidebar.html")
  .then(res => res.text())
  .then(html => {
    const sidebar = document.getElementById("sidebar-container");
    sidebar.innerHTML = html;

    const currentPage = window.location.pathname.split("/").pop();
    const navItems = sidebar.querySelectorAll(".nav-menu a");

    navItems.forEach(item => {
      const linkPath = item.getAttribute("href");
      if (linkPath === currentPage) item.classList.add("active");
      else item.classList.remove("active");
    });
  });

/* ===============================
   공통 메시지
=================================*/
function showSuccessMessage(msg) {
  const div = document.createElement("div");
  div.className = "success-toast";
  div.textContent = msg;
  Object.assign(div.style, {
    position: "fixed",
    top: "24px",
    right: "24px",
    background: "#10b981",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    zIndex: "9999",
  });
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2500);
}

function showErrorMessage(msg) {
  const div = document.createElement("div");
  div.className = "error-toast";
  div.textContent = msg;
  Object.assign(div.style, {
    position: "fixed",
    top: "24px",
    right: "24px",
    background: "#ef4444",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    zIndex: "9999",
  });
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2500);
}

/* ===============================
   전역 변수
=================================*/
let meetingData = null;
let speakerMappingData = {};
let actionItems = [];
let currentEditingActionIndex = -1;
let currentEditingTranscriptIndex = -1;
let activeKeyword = null;
let isEditingSummary = false;
let originalSummaryData = {};

/* ===============================
   회의 데이터 로드
=================================*/
function loadMeetingData() {
  if (!meetingData) return;
  actionItems = meetingData.actions || [];
  displayMeetingInfo();
  displayTranscripts();
  generateAISummary();
  renderActionItems();
}

/* ===============================
   회의 정보
=================================*/
function displayMeetingInfo() {
  const title = meetingData.title || "제목 없음";
  document.getElementById("meetingTitleBadge").textContent = title;
  document.getElementById("meetingTitle").textContent = title;

  const dateEl = document.getElementById("meetingDate");
  if (meetingData.date && dateEl) {
    const date = new Date(meetingData.date);
    dateEl.textContent = `${date.getFullYear()}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${String(date.getDate()).padStart(
      2,
      "0"
    )} ${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  }

  const dur = document.getElementById("meetingDuration");
  if (meetingData.duration && dur)
    dur.textContent = formatDuration(meetingData.duration);

  const part = document.getElementById("participantCount");
  if (meetingData.participants && part)
    part.textContent = meetingData.participants.length + "명";
}

function formatDuration(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(
    2,
    "0"
  )}:${String(s).padStart(2, "0")}`;
}

/* ===============================
   회의 제목 수정
=================================*/
function editMeetingTitle() {
  const el = document.getElementById("meetingTitle");
  const cur = el.textContent;
  el.innerHTML = `<input type="text" id="meetingTitleInput" class="info-input" value="${cur}" />`;
  const input = document.getElementById("meetingTitleInput");
  input.focus();
  input.addEventListener("blur", saveMeetingTitle);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") saveMeetingTitle();
  });
}

function saveMeetingTitle() {
  const input = document.getElementById("meetingTitleInput");
  if (!input) return;
  const newTitle = input.value.trim() || "제목 없음";
  meetingData.title = newTitle;
  document.getElementById("meetingTitle").textContent = newTitle;
  document.getElementById("meetingTitleBadge").textContent = newTitle;
  showSuccessMessage("회의 제목이 수정되었습니다.");
}

/* ===============================
   실시간 로그
=================================*/
function highlightKeywords(text) {
  if (!activeKeyword) return text;
  const regex = new RegExp("(" + activeKeyword + ")", "gi");
  return text.replace(
    regex,
    '<mark style="background:#fef3c7;color:#d97706;padding:2px 4px;border-radius:3px;">$1</mark>'
  );
}

function displayTranscripts() {
    if (!meetingData || !meetingData.transcripts) return;
    const body = document.getElementById('transcriptBody');
    body.innerHTML = '';
    meetingData.transcripts.forEach((transcript, index) => {
    const item = document.createElement('div');
    item.className = 'transcript-item';
    item.setAttribute('data-index', index);
    const speakerClass = speakerMappingData[transcript.speaker] ? 'mapped' : '';
    const displayName = speakerMappingData[transcript.speaker] || transcript.speaker;
    item.innerHTML = '<button class="btn-icon-small transcript-edit-btn" onclick="editTranscript(' + index + ')" title="수정"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button><div class="transcript-meta"><span class="speaker-name ' + speakerClass + '" onclick="openSpeakerMappingModal(\'' + transcript.speaker + '\')">' + displayName + '</span><span class="transcript-time">' + transcript.time + '</span></div><div class="transcript-text" id="transcript-text-' + index + '">' + highlightKeywords(transcript.text) + '</div>';
    body.appendChild(item);
    });
    updateTranscriptStats();
}

/* ===============================
   로그 통계 업데이트
=================================*/
function updateTranscriptStats() {
  const countEl = document.getElementById("transcriptCount");
  const mappingEl = document.getElementById("mappingStatus");

  if (!meetingData || !meetingData.transcripts) return;

  const total = meetingData.transcripts.length;
  const uniqueSpeakers = [...new Set(meetingData.transcripts.map(t => t.speaker))];
  const mappedCount = uniqueSpeakers.filter(s => speakerMappingData[s]).length;

  if (countEl) countEl.textContent = `총 ${total}개 발화`;
  if (mappingEl) mappingEl.textContent = `${mappedCount}/${uniqueSpeakers.length} 매핑 완료`;
}

/* ===============================
   발화자 매핑
=================================*/
let currentMappingSpeaker = null;

function openSpeakerMappingModal(speaker) {
  currentMappingSpeaker = speaker;
  const modal = document.getElementById("speakerMappingModal");
  const list = document.getElementById("participantList");
  list.innerHTML = "";
  meetingData.participants.forEach(p => {
    const item = document.createElement("div");
    item.className = "participant-item";
    if (speakerMappingData[speaker] === p) item.classList.add("selected");
    item.innerHTML = `
      <div class="participant-avatar">${p.charAt(0)}</div>
      <span class="participant-name">${p}</span>
      <div class="participant-check">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      </div>`;
    item.onclick = () => selectParticipant(item, p);
    list.appendChild(item);
  });
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function selectParticipant(item, participant) {
  document
    .querySelectorAll(".participant-item")
    .forEach(el => el.classList.remove("selected"));
  item.classList.add("selected");
  speakerMappingData[currentMappingSpeaker] = participant;
}

function saveSpeakerMapping() {
  closeSpeakerMappingModal();
  displayTranscripts();
  showSuccessMessage("발화자 매핑이 저장되었습니다.");
}

function closeSpeakerMappingModal() {
  const modal = document.getElementById("speakerMappingModal");
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

/* ===============================
   발화 점유율 차트
=================================*/
function openParticipationChart() {
  if (!meetingData || !meetingData.transcripts) {
    showErrorMessage("회의 데이터가 없습니다.");
    return;
  }

  // 발화자별 발화 수 계산
  const speakerCounts = {};
  meetingData.transcripts.forEach(t => {
    const speaker = speakerMappingData[t.speaker] || t.speaker;
    speakerCounts[speaker] = (speakerCounts[speaker] || 0) + 1;
  });

  const total = meetingData.transcripts.length;
  const chartData = Object.entries(speakerCounts).map(([speaker, count]) => ({
    speaker,
    count,
    percentage: ((count / total) * 100).toFixed(1)
  }));

  // 퍼센티지 순으로 정렬
  chartData.sort((a, b) => b.count - a.count);

  // 차트 렌더링
  const container = document.getElementById("participationChartContainer");
  container.innerHTML = "";

  chartData.forEach(data => {
    const barDiv = document.createElement("div");
    barDiv.className = "chart-bar";
    barDiv.innerHTML = `
      <div class="chart-label">
        <span class="chart-name">${data.speaker}</span>
        <span class="chart-percentage">${data.percentage}% (${data.count}회)</span>
      </div>
      <div class="chart-bar-bg">
        <div class="chart-bar-fill" style="width: ${data.percentage}%"></div>
      </div>
    `;
    container.appendChild(barDiv);
  });

  const modal = document.getElementById("participationChartModal");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeParticipationChart() {
  const modal = document.getElementById("participationChartModal");
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

/* ===============================
   AI 요약 편집
=================================*/
function toggleSummaryEdit() {
  isEditingSummary = !isEditingSummary;
  const btns = document.getElementById("summaryActions");

  const sections = [
    { view: "purposeView", editor: "purposeEditor" },
    { view: "agendaView", editor: "agendaEditor" },
    { view: "summaryView", editor: "summaryEditor" },
  ];

  if (isEditingSummary) {
    originalSummaryData = {};
    sections.forEach(({ view, editor }) => {
      const viewEl = document.getElementById(view);
      const editEl = document.getElementById(editor);
      const text = viewEl.textContent.trim();
      originalSummaryData[view] = text;
      editEl.value = text;
      viewEl.classList.add("hidden");
      editEl.classList.remove("hidden");
    });
    btns.classList.remove("hidden");
  } else {
    sections.forEach(({ view, editor }) => {
      const viewEl = document.getElementById(view);
      const editEl = document.getElementById(editor);
      viewEl.classList.remove("hidden");
      editEl.classList.add("hidden");
    });
    btns.classList.add("hidden");
  }
}

function saveSummaryEdit() {
  ["purpose", "agenda", "summary"].forEach(id => {
    const editor = document.getElementById(`${id}Editor`);
    const view = document.getElementById(`${id}View`);
    view.textContent = editor.value.trim() || "내용 없음";
  });
  toggleSummaryEdit();
  showSuccessMessage("AI 요약이 저장되었습니다.");
}

function cancelSummaryEdit() {
  ["purpose", "agenda", "summary"].forEach(id => {
    const view = document.getElementById(`${id}View`);
    view.textContent = originalSummaryData[`${id}View`];
  });
  toggleSummaryEdit();
}

/* ===============================
   AI 요약 표시
=================================*/
function generateAISummary() {
  document.getElementById("purposeView").textContent =
    meetingData.purpose || "회의 목적 없음";
  document.getElementById("agendaView").textContent =
    meetingData.agenda || "의제 없음";
  document.getElementById("summaryView").textContent =
    meetingData.summary || "요약 내용이 없습니다.";

  const kwContainer = document.getElementById("keywordTags");
  kwContainer.innerHTML = "";
  (meetingData.keywords || []).forEach(k => {
    const tag = document.createElement("span");
    tag.className = "keyword-tag";
    tag.textContent = k;
    tag.onclick = () => toggleKeywordHighlight(k, tag);
    kwContainer.appendChild(tag);
  });
}

function toggleKeywordHighlight(keyword, el) {
  if (activeKeyword === keyword) {
    activeKeyword = null;
    el.classList.remove("highlighted");
  } else {
    document
      .querySelectorAll(".keyword-tag")
      .forEach(tag => tag.classList.remove("highlighted"));
    el.classList.add("highlighted");
    activeKeyword = keyword;
  }
  displayTranscripts();
}

/* ===============================
   액션 아이템
=================================*/
function renderActionItems() {
  const container = document.getElementById("actionItemsList");
  container.innerHTML = "";
  actionItems.forEach(a => {
    const div = document.createElement("div");
    div.className = "action-item";
    div.innerHTML = `
      <div class="action-header"><div class="action-title">${a.title}</div></div>
      <div class="action-meta">${a.assignee ? `담당: ${a.assignee}` : ""}</div>`;
    container.appendChild(div);
  });
}

function openActionModal() {
  const modal = document.getElementById("actionModal");
  document.getElementById("actionTitle").value = "";
  document.getElementById("actionAssignee").value = "";
  document.getElementById("actionDeadline").value = "";
  
  // 참석자 목록 채우기
  const assigneeSelect = document.getElementById("actionAssignee");
  assigneeSelect.innerHTML = '<option value="">선택하세요</option>';
  if (meetingData && meetingData.participants) {
    meetingData.participants.forEach(p => {
      const option = document.createElement("option");
      option.value = p;
      option.textContent = p;
      assigneeSelect.appendChild(option);
    });
  }
  
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeActionModal() {
  const modal = document.getElementById("actionModal");
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

function saveAction() {
  const title = document.getElementById("actionTitle").value.trim();
  if (!title) {
    showErrorMessage("액션 아이템을 입력해주세요.");
    return;
  }
  
  const assignee = document.getElementById("actionAssignee").value;
  const deadline = document.getElementById("actionDeadline").value;
  
  actionItems.push({ title, assignee, deadline });
  renderActionItems();
  closeActionModal();
  showSuccessMessage("액션 아이템이 추가되었습니다.");
}

/* ===============================
   저장 및 내보내기
=================================*/
function collectFinalData() {
  return {
    ...meetingData,
    speakerMapping: speakerMappingData,
    actions: actionItems,
    createdAt: new Date().toISOString(),
  };
}

function exportJSON() {
  const data = collectFinalData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${meetingData.title || "meeting"}.json`;
  a.click();
  showSuccessMessage("JSON 파일이 다운로드되었습니다.");
}

function exportPDF() {
  showErrorMessage("PDF 내보내기 기능은 준비 중입니다.");
}

function saveMeeting() {
  const data = collectFinalData();
  localStorage.setItem("savedMeeting", JSON.stringify(data));
  showSuccessMessage("회의록이 저장되었습니다.");
}

/* ===============================
   초기화
=================================*/
document.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("lastMeeting");
  if (stored) {
    meetingData = JSON.parse(stored);
    loadMeetingData();
  } else {
    // 테스트 데이터
    meetingData = {
      title: "프로젝트 기획 회의",
      date: new Date().toISOString(),
      duration: 2723,
      participants: ["김철수", "이영희", "박민수"],
      transcripts: [
        { speaker: "Speaker 1", time: "00:00:15", text: "안녕하세요. 오늘 회의를 시작하겠습니다." },
        { speaker: "Speaker 2", time: "00:00:32", text: "네, 예산 부분에 대해 논의해야 할 것 같습니다." },
        { speaker: "Speaker 1", time: "00:01:05", text: "좋습니다. 예산안을 검토해보죠." },
        { speaker: "Speaker 3", time: "00:01:28", text: "일정도 함께 조율하면 좋겠습니다." },
        { speaker: "Speaker 1", time: "00:02:10", text: "그렇게 하겠습니다. 다음 주까지 정리하죠." }
      ],
      purpose: "프로젝트 방향성 논의 및 세부 일정 수립",
      agenda: "예산 배정, 일정 조율, 역할 분담",
      summary: "이번 회의에서는 프로젝트의 주요 목표와 일정에 대해 논의했습니다.",
      keywords: ["예산", "일정", "역할", "검토"],
      actions: []
    };
    loadMeetingData();
  }
});

/* ===============================
   로그 수정 기능
=================================*/
function editTranscript(index) {
  if (currentEditingTranscriptIndex !== -1) {
    cancelTranscriptEdit(currentEditingTranscriptIndex);
  }
  currentEditingTranscriptIndex = index;

  const item = document.querySelector(`.transcript-item[data-index="${index}"]`);
  const textDiv = item.querySelector(".transcript-text");
  const originalText = meetingData.transcripts[index].text;

  textDiv.innerHTML = `
    <textarea class="transcript-text-editor" id="transcript-editor-${index}">${originalText}</textarea>
    <div class="transcript-edit-actions">
      <button class="btn btn-secondary" onclick="cancelTranscriptEdit(${index})">취소</button>
      <button class="btn btn-primary" onclick="saveTranscriptEdit(${index})">저장</button>
    </div>
  `;
  const editor = document.getElementById(`transcript-editor-${index}`);
  editor.focus();
}

function saveTranscriptEdit(index) {
  const editor = document.getElementById(`transcript-editor-${index}`);
  const newText = editor.value.trim();
  if (!newText) {
    showErrorMessage("내용을 입력해주세요.");
    return;
  }

  meetingData.transcripts[index].text = newText;
  currentEditingTranscriptIndex = -1;
  displayTranscripts();
  showSuccessMessage("발화 로그가 수정되었습니다.");
}

function cancelTranscriptEdit(index) {
  currentEditingTranscriptIndex = -1;
  displayTranscripts();
}