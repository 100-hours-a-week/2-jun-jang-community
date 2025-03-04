document.addEventListener('DOMContentLoaded', () => {
    fetch('header.html') 
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            loadHeaderScript(); // 스크립트 로드 함수 실행
        })
        .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));

    const imageUploadInput = document.getElementById('image-upload');
    const profileImage = document.getElementById('profile-image');
    // 이미지 업로드 시 실행되는 이벤트 리스너
    imageUploadInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            // FileReader를 사용하여 파일을 읽음
            const reader = new FileReader();
            reader.onload = function (e) {
                // 읽은 이미지 데이터로 profile-image src 업데이트
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file); // 이미지 파일을 Data URL로 변환하여 읽기
        }
    });

    // 회원가입 버튼 클릭 시
    document.querySelector('.signIn-btn').addEventListener('click', function () {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        const nickname = document.getElementById('nickname').value;

        // 각 help-text 초기화 및 숨기기
        document.getElementById('email-help-text').textContent = '';
        document.getElementById('password-help-text').textContent = '';
        document.getElementById('password-confirm-help-text').textContent = '';
        document.getElementById('nickname-help-text').textContent = '';

        document.getElementById('email-help-text').style.display = 'none';
        document.getElementById('password-help-text').style.display = 'none';
        document.getElementById('password-confirm-help-text').style.display = 'none';
        document.getElementById('nickname-help-text').style.display = 'none';

        // 이메일 유효성 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email-help-text').textContent = '유효한 이메일을 입력해주세요.';
            document.getElementById('email-help-text').style.display = 'block'; // 이메일 오류 시 help-text 표시
            return;
        }

        // 비밀번호와 비밀번호 확인 일치 여부 체크
        if (password !== passwordConfirm) {
            document.getElementById('password-help-text').textContent = '비밀번호가 일치하지 않습니다.';
            document.getElementById('password-confirm-help-text').textContent = '비밀번호 확인이 일치하지 않습니다.';
            document.getElementById('password-help-text').style.display = 'block'; // 비밀번호 오류 시 help-text 표시
            document.getElementById('password-confirm-help-text').style.display = 'block'; // 비밀번호 확인 오류 시 help-text 표시
            return;
        }

        // 비밀번호 유효성 검사: 최소 8자, 숫자, 특수문자 포함
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
        if (!passwordRegex.test(password)) {
            document.getElementById('password-help-text').textContent = '비밀번호는 8자 이상, 숫자와 특수문자를 포함해야 합니다.';
            document.getElementById('password-help-text').style.display = 'block'; // 비밀번호 오류 시 help-text 표시
            return;
        }

        // 닉네임 유효성 검사
        if (nickname.length < 3) {
            document.getElementById('nickname-help-text').textContent = '닉네임은 최소 3자 이상이어야 합니다.';
            document.getElementById('nickname-help-text').style.display = 'block'; // 닉네임 오류 시 help-text 표시
            return;
        }

        // API 요청
        fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                nickname: nickname,
                profileImage: 'url'  // 프로필 이미지 URL
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('회원가입 실패');
            }
            return response.json();
        })
        .then(data => {
            // 성공 시
            console.log(data);
            // 토스트 메시지나 다른 피드백을 추가할 수 있습니다.

            // 성공적으로 회원가입 후 loginPage.html로 이동
            window.location.href = 'loginPage.html';
        })
        .catch(error => {
            // 실패 시에도 loginPage.html로 이동
            console.error(error);
            window.location.href = 'loginPage.html';
        });
    });

    // 로그인하러가기 버튼 클릭 시 loginPage.html로 이동
    document.querySelector('.login-btn').addEventListener('click', function () {
        window.location.href = 'loginPage.html';
    });
});

// header.js를 동적으로 로드하는 함수
function loadHeaderScript() {
    const script = document.createElement('script');
    script.src = '../script/header.js'; // 실제 header.js 경로 확인 필요
    document.body.appendChild(script);
}
