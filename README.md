# AFrontend

`npx http-server .`로 실행

---
- app.js : 페이지 전환 함수 showPage 추가
- style.css : calendar관련 스타일 제거
- 원래 홈 기능을 하던 index.html제거 후, home.html로 통합

---
- recordSetting : 회의록 생성 전 설정 페이지(회의 이름, 일자, 참석자, 키워드, 마이크 테스트 등)
- recording: 회의록 작성 페이지(실시간 STT 변환, 녹음 파일 생성)
- recordingFinish: 작성된 회의록 확인 및 AI 요약 생성(STT 변환 결과, 하이라이트 키워드, 액션 아이템, AI 요약, 회의 기본 정보 등)