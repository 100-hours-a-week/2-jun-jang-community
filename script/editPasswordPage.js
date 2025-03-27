document.addEventListener('DOMContentLoaded', () => {
    fetch('header.html') 
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            loadHeaderScript(); // 스크립트 로드 함수 실행
        })
        .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));
     
    const helpTextPassword = document.getElementById('password-help');
    const helpTextConfirm = document.getElementById('password-confirm-help');

    helpTextPassword.textContent = '';
    helpTextConfirm.textContent = '';
    
    document.querySelector('.submit-btn').addEventListener('click', async function () {
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        
        if (password === '') {
            helpTextPassword.textContent = '비밀번호를 입력해주세요';
            helpTextConfirm.textContent = '';
            return;
        } else if (passwordConfirm === '') {
            helpTextPassword.textContent = '';
            helpTextConfirm.textContent = '비밀번호를 한번 더 입력해주세요';
            return;
        } else if (password !== passwordConfirm) {
            helpTextPassword.textContent = '비밀번호 확인과 다릅니다';
            helpTextConfirm.textContent = '비밀번호와 다릅니다.';
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
        if (!passwordRegex.test(password)) {
            helpTextPassword.textContent = '비밀번호는 8자 이상 20자 이하로, 숫자와 특수문자를 포함해야 합니다.';
            return;
        }

        const accessToken = getCookie('accessToken');
        const refreshToken = getCookie('refreshToken');
        
        if (!accessToken || !refreshToken) {
            console.error('토큰이 없습니다. 로그인 필요');
            return;
        }

        try {
            const response = await fetch('https://api.juncommunity.store/users/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'refreshToken': refreshToken
                },
                body: JSON.stringify({ password })
            });

            if (!response.ok) {
                throw new Error('비밀번호 수정 실패');
            }

            const data = await response.json();
            console.log('비밀번호 변경 성공:', data);
            
            showToast('비밀번호 변경 완료');
            
            helpTextPassword.textContent = '';
            helpTextConfirm.textContent = '';

            setTimeout(() => {
                window.location.href = 'postsPage.html';
            }, 3000);
        } catch (error) {
            console.error('비밀번호 수정 중 오류 발생:', error);
            showToast('비밀번호 변경 실패');
        }
    });
});

function loadHeaderScript() {
    const script = document.createElement('script');
    script.src = '../script/header.js';
    document.body.appendChild(script);
}

function getCookie(name) {
    const matches = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : null;
}

function showToast(message) {
    const toast = document.getElementById('toast-message');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
