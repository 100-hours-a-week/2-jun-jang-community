// Infinite scroll for dynamically loading post containers
let currentPage = 1;
const postsContainer = document.querySelector('.posts-list-container');
const ButtonContainer = document.querySelector('.write-btn');


const logout =document.getElementById("logout");

const postTemplate = {
    title: '제목 1',
    likes: 0,
    comments: 0,
    views: 0,
    date: '2027-01-01 00:00:00',
    username: '유저 1',
    profileImage: '../img/profile.png'
};


document.addEventListener('DOMContentLoaded', () => {
    fetch('header.html') 
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            loadHeaderScript(); // 스크립트 로드 함수 실행
        })
        .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));
});

// header.js를 동적으로 로드하는 함수
function loadHeaderScript() {
    const script = document.createElement('script');
    script.src = '../script/header.js'; // 실제 header.js 경로 확인 필요
    document.body.appendChild(script);
}


postsContainer.addEventListener('click', (event) => {
    const clickedPost = event.target.closest('.post-container');
    if (clickedPost) {
        window.location.href = "postPage.html";
    }
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