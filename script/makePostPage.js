document.addEventListener('DOMContentLoaded', async () => {
    await loadHeader();

    const submitButton = document.querySelector('button[type="submit"]');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');

    updateButtonState();

    titleInput.addEventListener('input', updateButtonState);
    contentInput.addEventListener('input', updateButtonState);

    submitButton.addEventListener('click', handleSubmit);
});

// 🔹 헤더 불러오기 및 script 추가
async function loadHeader() {
    return new Promise((resolve) => {
        fetch('header.html') 
            .then(response => response.text())
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
                loadHeaderScript(); // header.js 추가 로드
                resolve();
            })
            .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));
    });
}

function loadHeaderScript() {
    const script = document.createElement('script');
    script.src = '../script/header.js';
    document.body.appendChild(script);
}

function updateButtonState() {
    const submitButton = document.querySelector('button[type="submit"]');
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    submitButton.disabled = !(title && content);
    submitButton.style.backgroundColor = title && content ? '#7F6AEE' : '#ACA0EB';
}

// 🔹 쿠키에서 accessToken, refreshToken 가져오기
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

// 🔹 이미지 업로드 후 URL 반환
async function uploadPostImage(file) {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('https://api.juncommunity.store/images', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('이미지 업로드 실패');

        const data = await response.json();
        return data.data.fileUrl;
    } catch (error) {
        console.error('이미지 업로드 오류:', error);
        return null;
    }
}



// 🔹 게시글 작성 API 요청
async function handleSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageFile = document.getElementById('file-upload').files[0];

    let accessToken = getCookie("accessToken");
    if (!accessToken) {
        console.warn("인증 필요. 로그인 페이지로 이동.");
        window.location.href = "loginPage.html";
        return;
    }

    let imageUrl = null;
    if (imageFile) {
        imageUrl = await uploadPostImage(imageFile);
        if (!imageUrl) {
            console.error("이미지 업로드 실패. 텍스트 게시만 진행.");
        }
    }

    const requestBody = {
        title,
        content,
        contentImage: imageUrl || ""
    };

    try {
        let response = await fetch('https://api.juncommunity.store/posts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.status === 401) {
            console.warn("AccessToken 만료됨. RefreshToken으로 재발급 시도.");

            accessToken = await refreshToken();
            if (accessToken) {
                response = await fetch('https://api.juncommunity.store/posts', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });
            } else {
                throw new Error("토큰 갱신 실패");
            }
        }

        if (!response.ok) throw new Error("게시글 작성 실패");

        const data = await response.json();
        console.log("게시글 작성 성공:", data);
        window.location.href = 'postsPage.html';
    } catch (error) {
        console.error("게시글 작성 오류:", error);
        window.location.href = 'postsPage.html';
    }
}
