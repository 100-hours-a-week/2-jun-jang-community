const profileImage = document.querySelector('.header-profile');
const profileDropdown = document.querySelector('.profile-dropdown');
const profileModify = document.getElementById("profileModify");
const passwordModify = document.getElementById("passwordModify");
const logout = document.getElementById("logout");
const backButton = document.querySelector('.back-button'); // 뒤로 가기 버튼 선택

profileModify.addEventListener('click', () => {
    window.location.href = "editProfilePage.html";
});

passwordModify.addEventListener('click', () => {
    window.location.href = "editPasswordPage.html";
});

logout.addEventListener('click', () => {
    window.location.href = "loginPage.html";
});

// 프로필 이미지 클릭 시 드롭다운 메뉴 표시 및 토글
profileImage.addEventListener('click', (event) => {
    event.stopPropagation(); // 이벤트 버블링 방지
    profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
});

// 페이지의 다른 부분을 클릭 시 드롭다운 메뉴 숨김
document.addEventListener('click', (event) => {
    if (!profileImage.contains(event.target) && !profileDropdown.contains(event.target)) {
        profileDropdown.style.display = 'none';
    }
});

// 뒤로 가기 버튼 클릭 시 이전 페이지로 이동
if (backButton) {
    backButton.addEventListener('click', () => {
        window.history.back();
    });
}