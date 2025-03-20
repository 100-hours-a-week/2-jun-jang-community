document.addEventListener('DOMContentLoaded', async () => {
    fetch('header.html') 
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            loadHeaderScript(); // 스크립트 로드 함수 실행
        })
        .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));

    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');
    
    if (!accessToken || !refreshToken) {
        console.error('토큰이 없습니다. 로그인 필요');
        return;
    }

    let currentProfileImage = '';
    let isNewImageUploaded = false;

    try {
        const profileResponse = await fetch('http://localhost:8080/users/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'refreshToken': refreshToken
            }
        });
        
        const profileData = await profileResponse.json();
        if (profileData.success) {
            document.getElementById('email').textContent = profileData.data.email;
            document.getElementById('nickname').value = profileData.data.nickname;
            document.getElementById('profile-image').src = profileData.data.profileImage;
            document.getElementById('profile-image').setAttribute('data-image-url', profileData.data.profileImage);
            currentProfileImage = profileData.data.profileImage;
        } else {
            console.error('프로필 조회 실패:', profileData.message);
        }
    } catch (error) {
        console.error('프로필 조회 중 오류 발생:', error);
    }

    const imageUploadInput = document.getElementById('image-upload');
    const profileImage = document.getElementById('profile-image');
    
    imageUploadInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            profileImage.src = e.target.result;
            isNewImageUploaded = true;
        };
        reader.readAsDataURL(file);
    });

    document.querySelector('.submit-btn').addEventListener('click', async function() {
        const nickname = document.getElementById('nickname').value;
        let updatedProfileImage = currentProfileImage;
        
        if (isNewImageUploaded) {
            console.log("🔄 새 이미지 업로드 진행 중...");
            updatedProfileImage = await uploadImage(imageUploadInput.files[0]);
        }

        if (!updatedProfileImage) {
            console.error("🚨 이미지 업로드 실패. 기존 프로필 이미지 유지.");
            updatedProfileImage = currentProfileImage;
        }

        try {
            const updateResponse = await fetch('http://localhost:8080/users/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'refreshToken': refreshToken
                },
                body: JSON.stringify({
                    nickname: nickname,
                    profileImage: updatedProfileImage
                })
            });
            
            const updateData = await updateResponse.json();
            if (updateData.success) {
                showToast('수정 완료');
                setTimeout(() => window.location.href = 'postsPage.html', 3000);
            } else {
                console.error('프로필 수정 실패:', updateData.message);
            }
        } catch (error) {
            console.error('프로필 수정 중 오류 발생:', error);
        }
    });
});

async function uploadImage(file) {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    let accessToken = getCookie("accessToken");
    let refreshTokenValue = getCookie("refreshToken");

    try {
        let response = await fetch("http://localhost:8080/images", {
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
                response = await fetch("http://localhost:8080/images", {
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

        return data.data.fileUrl;
    } catch (error) {
        console.error("🚨 이미지 업로드 오류:", error);
        return null;
    }
}

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
    setTimeout(() => toast.classList.remove('show'), 3000);
}