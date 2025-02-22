

document.addEventListener('DOMContentLoaded', () => {
    fetch('header.html') 
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            loadHeaderScript(); // 스크립트 로드 함수 실행
        })
        .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));
});

// header.js를 동적으로 로드하는 함수
function loadHeaderScript() {
    const script = document.createElement('script');
    script.src = '../script/header.js'; // 실제 header.js 경로 확인 필요
    document.body.appendChild(script);
}


document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const helper = document.getElementById("helper");
    const signUpButton = document.getElementById("signup-text");
    const loginButton = document.querySelector(".login-form button");

    // 정규식 패턴 정의
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;


    
    // 입력 시 실시간 유효성 검사
    function validateInputs() {
        const isEmailValid = emailPattern.test(emailInput.value);
        const isPasswordValid = passwordPattern.test(passwordInput.value);
        let isValid=true;
         // 이메일 유효성 검사
        if (!isEmailValid) {
            helper.textContent = "올바른 이메일 주소를 입력해주세요.";
            helper.style.color = "red";
            isValid = false;
        }else{
            helper.textContent = "";
        }
        // 비밀번호 유효성 검사
        if (!isPasswordValid) {
            helper.textContent = "비밀번호는 8~20자이며, 대소문자/숫자/특수문자를 포함해야 합니다.";
            helper.style.color = "red";
            isValid = false;
        }else if(isValid){
            helper.textContent = "";
        }
        if (isValid) {
            loginButton.style.backgroundColor = "#7F6AEE"; // 유효성 통과 시 색 변경
            loginButton.disabled = false;
        } else {
            loginButton.style.backgroundColor = "#ACA0EB"; // 기본 색상
            loginButton.disabled = true;
        }
        
    }

    // 입력 필드에 이벤트 리스너 추가
    emailInput.addEventListener("input", validateInputs);
    passwordInput.addEventListener("input", validateInputs);

    // 폼 제출 이벤트
    loginForm.addEventListener("submit", (event)=> {
        event.preventDefault(); // 기본 제출 방지
        window.location.href = "postsPage.html";
        
    });

    // 회원가입 버튼 클릭 이벤트
    signUpButton.addEventListener("click", (event)=> {
        event.preventDefault();
        window.location.href = "signUpPage.html";
    });

    // 페이지 로드 시 버튼 비활성화
    loginButton.style.backgroundColor = "#ACA0EB";
    loginButton.disabled = true;
});