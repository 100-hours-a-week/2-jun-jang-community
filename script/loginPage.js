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
        let isValid = true;

        if (!isEmailValid) {
            helper.textContent = "올바른 이메일 주소를 입력해주세요.";
            helper.style.color = "red";
            isValid = false;
        } else {
            helper.textContent = "";
        }

        if (!isPasswordValid) {
            helper.textContent = "비밀번호는 8~20자이며, 대소문자/숫자/특수문자를 포함해야 합니다.";
            helper.style.color = "red";
            isValid = false;
        } else if (isValid) {
            helper.textContent = "";
        }

        loginButton.style.backgroundColor = isValid ? "#7F6AEE" : "#ACA0EB";
        loginButton.disabled = !isValid;
    }

    emailInput.addEventListener("input", validateInputs);
    passwordInput.addEventListener("input", validateInputs);

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + "; path=/" + expires;
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch("http://localhost:8080/users/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error("API 요청 실패");
            }

            const data = await response.json();
            console.log("로그인 성공:", data);

            if (data.success && data.data?.accessToken) {
                setCookie("accessToken", data.data.accessToken, 7);
                setCookie("refreshToken", data.data.refreshToken, 7);
                window.location.href = `postsPage.html`;
            } else {
                throw new Error("로그인 실패: 응답 데이터 오류");
            }
        } catch (error) {
            console.log("API 요청 실패, 로컬 인증 시작");

            if (email === "test@email.com" && password === "PASSword@1234") {
                setCookie("accessToken", "dummyAccessToken", 7);
                setCookie("refreshToken", "dummyRefreshToken", 7);
                window.location.href = "postsPage.html?userId=1";
            } else {
                helper.textContent = "로그인 실패: 이메일 또는 비밀번호를 확인해주세요.";
                helper.style.color = "red";
            }
        }
    });

    signUpButton.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "signUpPage.html";
    });

    loginButton.style.backgroundColor = "#ACA0EB";
    loginButton.disabled = true;
});