document.addEventListener("DOMContentLoaded", async () => {
    const postsContainer = document.querySelector('.posts-list-container');
    const writeButton = document.querySelector('.write-btn');

    const API_BASE_URL = "http://localhost:8080";
    let currentPage = 0;
    const offset = 20;
    let hasMorePosts = true; // 더 불러올 게시물이 있는지 확인
    let isFetching = false; // 중복 요청 방지

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

    function loadHeaderScript() {
        const script = document.createElement('script');
        script.src = '../script/header.js'; // 실제 header.js 경로 확인 필요
        document.body.appendChild(script);
    }

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

    async function fetchPosts(page = 0, offset = 20) {
        if (isFetching || !hasMorePosts) return;
        isFetching = true;

        let accessToken = getCookie("accessToken");
        const refreshToken = getCookie("refreshToken");

        if (!accessToken) {
            console.error("인증이 필요합니다. 로그인 페이지로 이동합니다.");
            window.location.href = "loginPage.html";
            return;
        }

        try {
            let response = await fetch(`${API_BASE_URL}/posts?page=${page}&offset=${offset}`, {
                method: "GET",
                headers: { 
                    "Authorization": `Bearer ${accessToken}`,
                    'RefreshToken': refreshToken }
            });

            console.log(response.headers.get("name"));

            // 401 또는 403 발생 시 재시도 (AccessToken 만료 가능성)
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

            if (!response.ok) throw new Error("게시글 조회 실패");

            const data = await response.json();
            console.log("게시글 조회 성공:", data);

            if (data.data.posts.length < offset) {
                hasMorePosts = false; // 다음 페이지 요청 중단
            }

            data.data.posts.forEach(post => createPostElement(post));
            currentPage++; // 다음 페이지 증가
        } catch (error) {
            console.error(error);
        } finally {
            isFetching = false;
        }
    }

    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post-container');
        postDiv.setAttribute("data-post-id", post.postId);

        postDiv.innerHTML = `
            <h2>${post.title}</h2>
            <section class="information-container">
                <div class="information">
                    <p class="writer">좋아요</p>
                    <p class="writer-num">${post.likeCount}</p>
                    <p class="comment">댓글</p>
                    <p class="comment-count">${post.commentCount}</p>
                    <p class="visit">조회수</p>
                    <p class="visit-count">${post.visitCount}</p>
                </div>
                <p class="created-at">${new Date(post.createdAt).toLocaleString()}</p>
            </section>
            <hr class="horizontal-rule"/>
            <section class="user-container">
                <img src="${post.userProfileImage || '../img/profile.png'}" class="profile-img"/>
                <p class="name">${post.userName}</p>
            </section>
        `;

        postDiv.addEventListener("click", () => {
            window.location.href = `postPage.html?postId=${post.postId}`;
        });

        postsContainer.appendChild(postDiv);
    }

    writeButton.addEventListener("click", () => {
        window.location.href = "makePostPage.html";
    });

    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            fetchPosts(currentPage, offset);
        }
    });

    await loadHeader(); // 헤더 먼저 로드
    await fetchPosts(); // 게시물 불러오기
});
