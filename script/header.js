const profileImage = document.querySelector('.header-profile');
const profileDropdown = document.querySelector('.profile-dropdown');
const profileModify = document.getElementById("profileModify");
const passwordModify = document.getElementById("passwordModify");
const logout = document.getElementById("logout");
const backButton = document.querySelector('.back-button');

profileModify.addEventListener('click', () => {
    window.location.href = "editProfilePage.html";
});

passwordModify.addEventListener('click', () => {
    window.location.href = "editPasswordPage.html";
});

logout.addEventListener('click', () => {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    window.location.href = "loginPage.html";
});

profileImage.addEventListener('click', (event) => {
    event.stopPropagation();
    profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (event) => {
    if (!profileImage.contains(event.target) && !profileDropdown.contains(event.target)) {
        profileDropdown.style.display = 'none';
    }
});

if (backButton) {
    backButton.addEventListener('click', () => {
        window.history.back();
    });
}

// 쿠키에서 값 가져오기
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

// 쿠키 삭제 함수
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

async function fetchUserProfile() {
    let accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");
    
    if (!accessToken) {
        profileImage.src = "../img/profile.png";
        return;
    }
    
    try {
        let response = await fetch("http://localhost:8080/users/profile", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'refreshToken': refreshToken
            }
        });
        
        if (response.status === 401 || response.status === 403) {
            console.warn("🔄 AccessToken 만료됨. 응답 헤더에서 새로운 토큰 확인 중...");

            // 응답 헤더에서 새로운 AccessToken 확인
            const newAccessToken = response.headers.get("Authorization")?.replace("Bearer ", "");
            
            if (newAccessToken) {
                console.warn(" 새 AccessToken 발견! 갱신 후 재요청");
                document.cookie = `accessToken=${newAccessToken}; path=/; Secure`;
                location.reload();
            
            } 
            
        }
        
        if (!response.ok) {
            throw new Error("Failed to fetch user profile");
        }
        
        const data = await response.json();
        console.log("User profile fetched:", data);
        
        if (data.success && data.data?.profileImage) {
            profileImage.src = data.data.profileImage;
        } else {
            profileImage.src = "../img/profile.png";
        }
    } catch (error) {
        console.error("Error fetching profile image:", error);
        profileImage.src = "../img/profile.png";
    }
}

fetchUserProfile();
