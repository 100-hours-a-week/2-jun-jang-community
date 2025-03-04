document.addEventListener('DOMContentLoaded', () => {
    fetch('header.html') 
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            loadHeaderScript(); // 스크립트 로드 함수 실행
        })
        .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));
     // 비밀번호와 비밀번호 확인 영역의 help-text 요소 가져오기
     const helpTextPassword = document.getElementById('password-help');
     const helpTextConfirm = document.getElementById('password-confirm-help');

     // help-text 초기화
     helpTextPassword.textContent = '';
     helpTextConfirm.textContent = '';
    // 수정하기 버튼 클릭 시
    document.querySelector('.submit-btn').addEventListener('click', function () {
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        
       
        if(password==''){
            helpTextPassword.textContent = '비밀번호를 입력해주세요';
            helpTextConfirm.textContent = '';
            return;
        }
        else if(passwordConfirm==''){
            helpTextPassword.textContent = '';
            helpTextConfirm.textContent = '비밀번호를 한번 더  입력해주세요';
            return;
        }
        // 비밀번호와 비밀번호 확인 일치 여부 체크
        else if (password !== passwordConfirm) {
            helpTextPassword.textContent = '비밀번호 확인과 다릅니다';  // *help-text 수정
            helpTextConfirm.textContent = '비밀번호와 다릅니다.';  // *help-text 수정
            return;
        }

        // 비밀번호 유효성 검사: 비밀번호 길이, 특수문자, 숫자 포함 여부
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
        if (!passwordRegex.test(password)) {
            helpTextPassword.textContent = '비밀번호는 8자 이상 20자 이하로, 숫자와 특수문자를 포함해야 합니다.';  // *help-text 수정
            return;
        }

        // API 요청
        fetch('/users/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer xxxxx' // 실제 Authorization 토큰 사용
            },
            body: JSON.stringify({
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('비밀번호 수정 실패');
            }
            return response.json();
        })
        .then(data => {
            // 성공 시 토스트 메시지 표시
            const toast = document.getElementById('toast-message');
            toast.className = 'toast-message show';

            setTimeout(() => {
                toast.className = toast.className.replace('show', '');
            }, 3000);

            // *help-text에 성공 메시지 업데이트
            helpTextPassword.textContent = '';
            helpTextConfirm.textContent = '';
        })
        .catch(error => {
            const toast = document.getElementById('toast-message');
            toast.className = 'toast-message show';

            setTimeout(() => {
                toast.className = toast.className.replace('show', '');
            }, 3000);
            // 오류 발생 시에도 *help-text에 오류 메시지 표시
            helpTextPassword.textContent = '';
            helpTextConfirm.textContent = '';
            console.error('비밀번호 수정 중 오류 발생:', error);
        });
    });
});

// header.js를 동적으로 로드하는 함수
function loadHeaderScript() {
    const script = document.createElement('script');
    script.src = '../script/header.js'; // 실제 header.js 경로 확인 필요
    document.body.appendChild(script);
}


// header.js를 동적으로 로드하는 함수
function loadHeaderScript() {
    const script = document.createElement('script');
    script.src = '../script/header.js'; // 실제 header.js 경로 확인 필요
    document.body.appendChild(script);
}
