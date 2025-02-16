// Infinite scroll for dynamically loading post containers
let currentPage = 1;
const postsContainer = document.querySelector('.posts-list-container');
const ButtonContainer = document.querySelector('.write-container');
const profileImage = document.querySelector('.header-profile');
const postTemplate = {
    title: '제목 1',
    likes: 0,
    comments: 0,
    views: 0,
    date: '2027-01-01 00:00:00',
    username: '유저 1',
    profileImage: '../img/profile.png'
};


const createMenu= ()=>{
    
}
// 메뉴 보이기/숨기기 토글
profileImage.addEventListener('click', (event) => {
    const menu = document.createElement('div');
    const rect = profileImage.getBoundingClientRect();

    menu.classList.add('profile-menu');
    menu.innerHTML = `
        <ul>
            <li class="menu-item">회원정보수정</li>
            <li class="menu-item">비밀번호수정</li>
            <li class="menu-item">로그아웃</li>
        </ul>
    `;
    document.body.appendChild(menu);
    menu.style.top = `${rect.bottom + 5}px`;
    menu.style.left = `${rect.left}px`;
    menu.classList.toggle('show');
    
    event.stopPropagation(); // 이벤트 전파 방지
});
// 외부 클릭 시 메뉴 숨기기
document.addEventListener('click', () => {
    menu.classList.remove('show');
});
// 게시물 생성
const templatePost = () => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post-container');
    postDiv.innerHTML = `
        <h2>${postTemplate.title}</h2>
        <section class="information-container">
            <div class="information">
                <p class="writer">좋아요</p>
                <p class="writer-num">${postTemplate.likes}</p>
                <p class="comment">댓글</p>
                <p class="comment-count">${postTemplate.comments}</p>
                <p class="visit">조회수</p>
                <p class="visit-count">${postTemplate.views}</p>
            </div>
            <p class="created-at">${postTemplate.date}</p>
        </section>
        <hr class="horizontal-rule"/>
        <section class="user-container">
            <img src="${postTemplate.profileImage}" class="profile-img"/>
            <p class="name">${postTemplate.username}</p>
        </section>
    `;
    postsContainer.appendChild(postDiv);
};

//10개 정도 생성
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < 1; i++) {
        templatePost();
    }
});
ButtonContainer.addEventListener('click',()=>{
    window.location.href="writePostPage.hrml";
})
//무한 스크롤
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        for (let i = 0; i < 5; i++) {
            templatePost();
        }
    }
});
document.addEventListener('')