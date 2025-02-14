document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailHelper = document.getElementById("email-helper");
    const passwordHelper = document.getElementById("password-helper");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // 기본 폼 제출 방지

        let isValid = true;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // 이메일 정규식

        // 이메일 유효성 검사
        if (!emailPattern.test(emailInput.value)) {
            emailHelper.textContent = "올바른 이메일 주소를 입력해주세요.";
            emailHelper.style.color = "red";
            isValid = false;
        } else {
            emailHelper.textContent = "";
        }

        // 비밀번호 유효성 검사 (8~20자, 대소문자, 숫자, 특수문자 포함)
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        if (!passwordPattern.test(passwordInput.value)) {
            passwordHelper.textContent = "비밀번호는 8~20자이며, 대소문자/숫자/특수문자를 포함해야 합니다.";
            passwordHelper.style.color = "red";
            isValid = false;
        } else {
            passwordHelper.textContent = "";
        }

        // 유효성 검사를 통과하면 post 페이지로 이동
        if (isValid) {
            window.location.href = "post.html";
        }
    });
});