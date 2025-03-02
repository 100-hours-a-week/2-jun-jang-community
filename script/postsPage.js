document.addEventListener("DOMContentLoaded", async () => {
    const postsContainer = document.querySelector('.posts-list-container');
    const profileImage = document.querySelector('.header-profile'); // 헤더 프로필 이미지
    const writeButton = document.querySelector('.write-btn');
    
    const API_BASE_URL = "http://localhost:3000";
    let userProfile = null; // 사용자 프로필 데이터 저장
    let currentPage = 1; // 페이지네이션 변수

    // **JWT 토큰 가져오기 (실제 로그인 구현 시 localStorage에 저장한다고 가정)**
    const jwtToken = localStorage.getItem("jwtToken"); 

    /** 1. **프로필 조회 API 호출 (실패 시 기본 프로필 이미지 설정)** */
    async function fetchUserProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            });
    
            if (!response.ok) throw new Error("API 요청 실패");
    
            const data = await response.json();
            console.log("프로필 조회 성공:", data);
    
            // 프로필 이미지 요소가 존재하는지 확인 후 적용
            const profileImage = document.querySelector('.header-profile');
            if (profileImage) {
                profileImage.src = data.profileImageUrl;
            } else {
                console.warn("프로필 이미지 요소를 찾을 수 없음.");
            }
    
            userProfile = data;
        } catch (error) {
            console.error("프로필 조회 실패, 기본 이미지 적용");
    
            userProfile = {
                userId: 1,
                username: "익명 사용자",
                profileImageUrl: "../img/profile.png"
            };
    
            // 프로필 이미지 요소가 존재하는지 확인 후 적용
            const profileImage = document.querySelector('.header-profile');
            if (profileImage) {
                profileImage.src = userProfile.profileImageUrl;
            } else {
                console.warn("기본 프로필 이미지 적용 실패: 요소가 존재하지 않음.");
            }
        }
    }
    

    /** 2. **게시물 리스트 조회 API 호출 (실패 시 기본 게시글 설정)** */
    async function fetchPosts(page = 1, offset = 10) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts?page=${page}&offset=${offset}`, {
                method: "GET",
                headers: jwtToken ? { "Authorization": `Bearer ${jwtToken}` } : {}
            });

            if (!response.ok) throw new Error("API 요청 실패");

            const data = await response.json();
            console.log("게시글 조회 성공:", data);

            if (data.posts.length > 0) {
                data.posts.forEach(post => createPostElement(post));
            }
        } catch (error) {
            console.error("게시글 조회 실패, 기본 게시글 생성");

            // 기본 게시글 5개 생성
            for (let i = 0; i < 5; i++) {
                createPostElement({
                    postId: i,
                    title: `임시 제목 ${i + 1}`,
                    likes: Math.floor(Math.random() * 100),
                    comments: Math.floor(Math.random() * 50),
                    views: Math.floor(Math.random() * 500),
                    date: "2025-03-02 12:00:00",
                    username: "익명 사용자",
                    profileImageUrl: "../img/profile.png"
                });
            }
        }
    }

   /** 3. **게시물 HTML 동적 생성 함수** */
    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post-container');
        postDiv.setAttribute("data-post-id", post.postId); // postId 저장

        postDiv.innerHTML = `
            <h2>${post.title}</h2>
            <section class="information-container">
                <div class="information">
                    <p class="writer">좋아요</p>
                    <p class="writer-num">${post.likes}</p>
                    <p class="comment">댓글</p>
                    <p class="comment-count">${post.comments}</p>
                    <p class="visit">조회수</p>
                    <p class="visit-count">${post.views}</p>
                </div>
                <p class="created-at">${post.date}</p>
            </section>
            <hr class="horizontal-rule"/>
            <section class="user-container">
                <img src="${post.profileImageUrl}" class="profile-img"/>
                <p class="name">${post.username}</p>
            </section>
        `;

        // 게시물을 클릭하면 해당 postId를 포함하여 postPage.html로 이동
        postDiv.addEventListener("click", () => {
            const postId = postDiv.getAttribute("data-post-id");
            window.location.href = `postPage.html?postId=${postId}`;
        });

        postsContainer.appendChild(postDiv);
    }


    /** 4. **게시글 작성 페이지 이동** */
    writeButton.addEventListener("click", () => {
        window.location.href = "writePostPage.html";
    });

    /** 5. **무한 스크롤 이벤트 (추가 게시글 로딩)** */
    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            currentPage++;
            fetchPosts(currentPage, 5);
        }
    });
    async function loadHeader() {
        return new Promise((resolve) => {
            fetch('header.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('header-placeholder').innerHTML = data;
                    loadHeaderScript();
                    resolve(); // 헤더 로드 완료 후 resolve
                })
                .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));
        });
    }
    // header.js를 동적으로 로드하는 함수
    function loadHeaderScript() {
        const script = document.createElement('script');
        script.src = '../script/header.js'; // 실제 header.js 경로 확인 필요
        document.body.appendChild(script);
    }

    
    /** 6. **초기 데이터 로드** */
    await loadHeader();
    await fetchUserProfile(); // 프로필 불러오기
    await fetchPosts(); // 게시물 불러오기
});
