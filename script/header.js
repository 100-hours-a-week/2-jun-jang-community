
const profileImage = document.querySelector('.header-profile');
const profileDropdown = document.querySelector('.profile-dropdown');
const profileModify= document.getElementById("profileModfiy");
const passwordModfiy=document.getElementById("passwordModfiy");
const logout =document.getElementById("logout");

profileModify.addEventListener('click',()=>{
    window.location.href="editProfilePage.html";
})
passwordModfiy.addEventListener('click',()=>{
    window.location.href="editPasswordePage.html";
})
logout.addEventListener('click',()=>{
    window.location.href="loginPage.js"
})

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