const API_BASE_URL = "http://localhost:8080"; // ✅ 전역 변수 설정

document.addEventListener('DOMContentLoaded', () => {
    fetch('header.html') 
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            loadHeaderScript(); // 스크립트 로드 함수 실행
        })
        .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));
    
    const postId = localStorage.getItem('postId');
    const savedTitle = localStorage.getItem('postTitle') || '';
    const savedContent = localStorage.getItem('postContent') || '';
    const savedImage = localStorage.getItem('articleImg') || '';

    document.getElementById('title').value = savedTitle;
    document.getElementById('content').value = savedContent;

    if (savedImage) {
        const previewImg = document.getElementById('previewImage');
        if (previewImg) {
            previewImg.src = savedImage;
        }
    }

    const updateBtn = document.getElementById('updateBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', updatePost);
    }
});

async function updatePost() {
    const postId = localStorage.getItem("postId");
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    let accessToken = getCookie("accessToken");
    let refreshTokenValue = getCookie("refreshToken");

    if (!accessToken || !refreshTokenValue) {
        console.warn("❌ 인증 토큰 없음. 로그인 페이지로 이동.");
        window.location.href = "loginPage.html";
        return;
    }

    let contentImage = localStorage.getItem("articleImg"); // 기존 이미지 유지

    // ✅ 새로운 이미지가 업로드되었는지 확인
    const fileInput = document.getElementById("file-upload");
    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        console.log("📤 새로운 이미지 업로드 시작:", file.name);
        contentImage = await uploadImage(file); // ✅ 업로드된 이미지 URL을 가져옴
    }

    console.log("🔍 최종 이미지 URL:", contentImage);

    await sendPatchRequest(contentImage); // ✅ 수정 요청 실행
}

// ✅ 이미지 업로드 API (변경됨: fileUrl을 반환)
async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    let accessToken = getCookie("accessToken");
    let refreshTokenValue = getCookie("refreshToken");

    try {
        let response = await fetch(`${API_BASE_URL}/images`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Refresh-Token": refreshTokenValue
            },
            body: formData
        });

        if (response.status === 401) {
            console.warn("🔄 AccessToken 만료됨. RefreshToken으로 재발급 시도.");
            accessToken = await refreshToken();
            if (accessToken) {
                response = await fetch(`${API_BASE_URL}/images`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Refresh-Token": refreshTokenValue
                    },
                    body: formData
                });
            } else {
                throw new Error("토큰 갱신 실패, 로그인 페이지로 이동합니다.");
            }
        }

        if (!response.ok) throw new Error("이미지 업로드 실패");

        const data = await response.json();
        console.log("✅ 이미지 업로드 성공:", data);

        return data.data.fileUrl; // ✅ 업로드된 이미지 URL 반환
    } catch (error) {
        console.error("🚨 이미지 업로드 오류:", error);
        return null; // ✅ 업로드 실패 시 null 반환 (기존 이미지 유지)
    }
}

// ✅ PATCH API 요청 (게시글 수정)
async function sendPatchRequest(imageUrl) {
    const postId = localStorage.getItem("postId");
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    let accessToken = getCookie("accessToken");
    let refreshTokenValue = getCookie("refreshToken");

    const data = { title, content };
    if (imageUrl) data.contentImage = imageUrl; // ✅ 새로운 이미지 URL 포함

    console.log("📤 PATCH 요청 데이터:", JSON.stringify(data));

    try {
        let response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Refresh-Token": refreshTokenValue,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.status === 401) {
            console.warn("🔄 AccessToken 만료됨. RefreshToken으로 재발급 시도.");
            accessToken = await refreshToken();
            if (accessToken) {
                response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Refresh-Token": refreshTokenValue,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
            } else {
                throw new Error("토큰 갱신 실패, 로그인 페이지로 이동합니다.");
            }
        }

        if (!response.ok) throw new Error("게시글 수정 실패");

        console.log("✅ 게시글 수정 성공");
        alert("게시글이 수정되었습니다.");
        window.location.href = `postPage.html?postId=${postId}`; // ✅ 수정 완료 후 이동
    } catch (error) {
        console.error("🚨 게시글 수정 오류:", error);
    }
}

// ✅ header.js를 동적으로 로드하는 함수
function loadHeaderScript() {
    const script = document.createElement('script');
    script.src = '../script/header.js';
    document.body.appendChild(script);
}
