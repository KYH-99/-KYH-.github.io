document.addEventListener('DOMContentLoaded', () => {
    const noteTitle = document.getElementById('noteTitle'); // 제목 입력 요소
    const noteInput = document.getElementById('noteInput'); // 메모 입력 요소
    const saveButton = document.getElementById('saveButton'); // 저장 버튼
    const clearAllButton = document.getElementById('clearAllButton'); // 전체 지우기 버튼
    const savedNotes = document.getElementById('savedNotes'); // 저장된 메모 영역
    const alertModal = document.getElementById('alertModal'); // 알림 모달 요소
    const alertMessage = document.getElementById('alertMessage'); // 알림 메시지 요소

    // 파스텔톤 색상 클래스 목록
    const pastelColors = ['pastel-blue', 'pastel-green', 'pastel-pink', 'pastel-purple', 'pastel-yellow'];

    // 로컬 스토리지에서 메모를 불러와서 표시하는 함수
    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes')) || []; // 로컬 스토리지에서 메모 불러오기
        savedNotes.innerHTML = ''; // 저장된 메모 영역 초기화

        if (notes.length === 0) {
            savedNotes.innerHTML = '<p>저장된 메모가 없습니다.</p>'; // 저장된 메모가 없을 때 메시지 표시
        } else {
            notes.forEach((note, index) => {
                const noteElement = document.createElement('div'); // 메모 요소 생성
                noteElement.classList.add('note', note.color); // 메모 요소에 클래스 추가
                noteElement.innerHTML = `
                    <div class="note-title">${note.title}</div>
                    <div class="note-content">${note.content}</div>
                    <div class="button-group">
                        <button class="btn btn-success download-button" onclick="downloadNoteAsImage(${index})">저장</button>
                        <button class="btn btn-danger delete-button" onclick="deleteNote(${index})">삭제</button>
                    </div>
                `; // 메모 내용 및 버튼 추가
                savedNotes.appendChild(noteElement); // 저장된 메모 영역에 추가
            });
        }
    }

    // 메모를 저장하는 함수
    function saveNote() {
        const title = noteTitle.value.trim(); // 제목 입력값
        const content = noteInput.value.trim(); // 메모 입력값

        if (title === '' || content === '') {
            showAlert('제목과 메모를 모두 입력하세요.'); // 제목 또는 메모가 비어있을 때 알림 표시
            return;
        }

        const notes = JSON.parse(localStorage.getItem('notes')) || []; // 로컬 스토리지에서 메모 불러오기
        const color = pastelColors[Math.floor(Math.random() * pastelColors.length)]; // 랜덤 색상 선택
        notes.push({ title, content, color }); // 새로운 메모 추가
        localStorage.setItem('notes', JSON.stringify(notes)); // 로컬 스토리지에 저장
        loadNotes(); // 메모 목록 업데이트

        noteTitle.value = ''; // 제목 입력값 초기화
        noteInput.value = ''; // 메모 입력값 초기화
    }

    // 메모를 삭제하는 함수
    window.deleteNote = function (index) {
        const notes = JSON.parse(localStorage.getItem('notes')) || []; // 로컬 스토리지에서 메모 불러오기
        notes.splice(index, 1); // 해당 인덱스의 메모 삭제
        localStorage.setItem('notes', JSON.stringify(notes)); // 로컬 스토리지에 저장
        loadNotes(); // 메모 목록 업데이트
    }

    // 전체 메모를 지우는 함수
    function clearAllNotes() {
        localStorage.removeItem('notes'); // 로컬 스토리지에서 모든 메모 삭제
        loadNotes(); // 메모 목록 초기화
    }

    // 특정 메모를 PNG 파일로 저장하는 함수
    window.downloadNoteAsImage = function (index) {
        const notes = JSON.parse(localStorage.getItem('notes')) || []; // 로컬 스토리지에서 메모 불러오기
        const note = notes[index]; // 해당 인덱스의 메모 가져오기
        const noteElement = document.createElement('div'); // 메모 요소 생성
        noteElement.classList.add('note', note.color); // 메모 요소에 클래스 추가
        noteElement.style.position = 'absolute'; // 화면에서 보이지 않도록 위치 설정
        noteElement.style.left = '-9999px';
        noteElement.innerHTML = `
            <div class="note-title">${note.title}</div>
            <div class="note-content">${note.content}</div>
        `; // 메모 내용 추가
        document.body.appendChild(noteElement); // 임시로 메모 요소를 문서에 추가
        html2canvas(noteElement).then(canvas => {
            const link = document.createElement('a'); // 다운로드 링크 생성
            link.href = canvas.toDataURL('image/png'); // 캔버스를 이미지 데이터로 변환
            link.download = `${note.title}.png`; // 파일명 설정
            link.click(); // 다운로드 링크 클릭
            document.body.removeChild(noteElement); // 임시로 추가한 메모 요소 제거
        });
    }

    // 알림 메시지를 표시하는 함수
    function showAlert(message) {
        alertMessage.textContent = message; // 알림 메시지 설정
        alertModal.style.display = 'flex'; // 알림 모달 표시
    }

    // 알림 모달을 닫는 함수
    window.closeAlert = function() {
        alertModal.style.display = 'none'; // 알림 모달 숨기기
    }

    // 이벤트 리스너
    saveButton.addEventListener('click', saveNote); // 저장 버튼 클릭 시 메모 저장
    clearAllButton.addEventListener('click', clearAllNotes); // 전체 지우기 버튼 클릭 시 모든 메모 삭제

    // 페이지가 로드될 때 메모를 불러옴
    loadNotes(); // 초기 메모 목록 로드
});
