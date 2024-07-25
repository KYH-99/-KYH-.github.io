document.addEventListener('DOMContentLoaded', () => {
    const clockTimeElement = document.getElementById('clock-time');
    const colorPicker = document.getElementById('colorPicker');
    const alarmMessage = document.getElementById('alarmMessage');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerProgress = document.getElementById('timerProgress');
    const cancelTimerButton = document.getElementById('cancel-timer');
    const alarmSound = document.getElementById('alarmSound');
    const alertModal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');

    let alarmTime = null;
    let alarmTimeout = null;
    let timerTimeout = null;
    let timerInterval = null;
    let alarmInterval = null;

    // 디지털 시계
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockTimeElement.textContent = `${hours}:${minutes}:${seconds}`;

        // 알람 체크
        if (alarmTime && now.getHours() === alarmTime.hours && now.getMinutes() === alarmTime.minutes && now.getSeconds() === 0) {
            showAlert('알람이 울립니다!');
            playAlarmSound(); // 알람 소리 재생
        }
    }

    setInterval(updateClock, 1000);

    // 색상 변경
    colorPicker.addEventListener('input', (event) => {
        clockTimeElement.style.color = event.target.value;
    });

    // 알람 설정
    window.setAlarm = function () {
        const alarmTimeInput = document.getElementById('alarmTime').value;
        if (!alarmTimeInput) {
            alert("알람 시간을 설정해주세요.");
            return;
        }
        const [hours, minutes] = alarmTimeInput.split(':').map(Number);
        alarmTime = { hours, minutes };
        alarmMessage.textContent = `알람 설정: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    // 알람 리셋
    function resetAlarm() {
        alarmTime = null;
        alarmMessage.textContent = '';
        clearTimeout(alarmTimeout);
    }

    // 타이머 설정 및 시작
    window.startTimer = function () {
        const timerHours = parseInt(document.getElementById('timerHours').value) || 0;
        const timerMinutes = parseInt(document.getElementById('timerMinutes').value) || 0;
        const timerSeconds = parseInt(document.getElementById('timerSeconds').value) || 0;
        const timerDuration = (timerHours * 60 * 60 + timerMinutes * 60 + timerSeconds) * 1000;

        if (timerDuration <= 0) {
            alert("유효한 시간을 입력해주세요.");
            return;
        }

        const startTime = Date.now();
        const endTime = startTime + timerDuration;

        timerDisplay.textContent = `타이머: ${timerHours}시 ${timerMinutes}분 ${timerSeconds}초`;
        timerProgress.style.height = '100%';
        cancelTimerButton.style.display = 'flex'; // 타이머 시작 시 X 버튼 표시

        timerInterval = setInterval(() => {
            const now = Date.now();
            const timeLeft = endTime - now;
            const progress = Math.max(0, timeLeft / timerDuration) * 100;
            timerProgress.style.height = `${progress}%`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                showAlert('타이머 시간이 끝났습니다!');
                playAlarmSound(); // 타이머 소리 재생
                resetTimer();
            }
        }, 100);

        timerTimeout = setTimeout(() => {
            clearInterval(timerInterval);
            showAlert('타이머 시간이 끝났습니다!');
            playAlarmSound(); // 타이머 소리 재생
            resetTimer();
        }, timerDuration);
    }

    // 타이머 취소
    window.cancelTimer = function () {
        clearTimeout(timerTimeout);
        clearInterval(timerInterval);
        resetTimer();
    }

    // 타이머 초기화
    function resetTimer() {
        timerDisplay.textContent = '';
        timerProgress.style.height = '0%';
        cancelTimerButton.style.display = 'none';
        clearTimeout(timerTimeout); // 타이머를 완전히 초기화
        clearInterval(timerInterval); // 타이머 인터벌을 완전히 초기화
    }

    // 카테고리 전환
    window.showCategory = function (category) {
        document.querySelectorAll('.category-container').forEach(container => {
            container.classList.remove('active');
        });
        document.querySelectorAll('.btn-category').forEach(button => {
            button.classList.remove('active');
        });

        document.getElementById(category).classList.add('active');
        document.getElementById(`btn-${category}`).classList.add('active');

        if (category === 'timer') {
            if (timerProgress.style.height !== '0%') {
                cancelTimerButton.style.display = 'flex'; // 타이머가 진행 중이면 X 버튼 표시
            }
        } else {
            cancelTimerButton.style.display = 'none'; // 타이머 카테고리가 아닌 경우 X 버튼 숨김
        }
    }

    // 초기 설정
    showCategory('clock');

    // 알람 소리 재생 함수
    function playAlarmSound() {
        alarmSound.play().catch(error => {
            console.error('알람 소리 재생 오류:', error);
        });
    }

    // 알람 소리 중지 함수
    window.stopAlarm = function () {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        clearInterval(alarmInterval);
        hideAlert();
        resetAlarm(); // 알람 초기화
        resetTimer(); // 타이머 초기화
    }

    // 알람 모달 표시 함수
    function showAlert(message) {
        alertMessage.textContent = message;
        alertModal.style.display = 'flex';
        playAlarmSound();
    }

    // 알람 모달 숨기기 함수
    function hideAlert() {
        alertModal.style.display = 'none';
    }
});
