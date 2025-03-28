

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
    let isRequestInProgress = false;

    function showLoading() {
        document.getElementById('loading-overlay').style.display = 'flex';
    }

    function hideLoading() {
        document.getElementById('loading-overlay').style.display = 'none';
    }
    // 회원가입 버튼 클릭 시
    document.querySelector('.signIn-btn').addEventListener('click', async function () {
        if (isRequestInProgress) return; // 중복 요청 방지
        isRequestInProgress = true;
        showLoading(); // 로딩 표시
    
        try {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('passwordConfirm').value;
            const nickname = document.getElementById('nickname').value;
    
            // ... 유효성 검사 부분은 그대로 유지 ...
    
            let profileImageUrl = '../img/profile.png';
            if (imageUploadInput.files.length > 0) {
                const file = imageUploadInput.files[0];
                profileImageUrl = await uploadProfileImage(file);
                if (!profileImageUrl) {
                    alert('프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.');
                    return;
                }
            }
    
            const response = await fetch('https://api.juncommunity.store/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    nickname: nickname,
                    profileImage: profileImageUrl
                })
            });
    
            if (!response.ok) {
                throw new Error('회원가입 실패');
            }
    
            const data = await response.json();
            console.log(data);
            window.location.href = 'loginPage.html';
        } catch (error) {
            console.error(error);
            window.location.href = 'loginPage.html'; // 실패해도 이동
        } finally {
            hideLoading();          // 항상 로딩 제거
            isRequestInProgress = false; // 요청 완료 상태로 변경
        }
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
async function uploadProfileImage(file) {
    if (!file) {
        console.error('파일이 선택되지 않았습니다.');
        console.log("123");
        return null;
    }

    const formData = new FormData();
    formData.append('file', file); // key: 'file'

    return await fetch('https://api.juncommunity.store/images', {
        method: 'POST',
        body: formData,
        mode: 'cors'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('이미지 업로드 실패');
        }
        return response.json();
    })
    .then(data => data.data.fileUrl) // 예: { "url": "http://localhost:8080/uploads/profile123.png" }
    .catch(error => {
        console.error(error);
        return null;
    });
}