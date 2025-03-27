const API_BASE_URL = "https://api.juncommunity.store"; // ✅ 전역 변수로 설정

document.addEventListener("DOMContentLoaded", async () => {
    console.log("📌 DOMContentLoaded 이벤트 발생");

    await waitForElement(".post-header h1");

    // 요소 가져오기
    const postTitle = document.querySelector(".post-header h1");
    const profileImg = document.querySelector(".profile-img");
    const writer = document.querySelector(".writer");
    const createdAt = document.querySelector(".created-at");
    const articleImg = document.querySelector(".article-img");
    const articleContent = document.querySelector("article p");
    const likeContainer = document.querySelector("#like-count").parentElement;
    const likeCount = document.getElementById("like-count");
    const visitCount = document.getElementById("visit-count");
    const commentCount = document.getElementById("comment-count");
    const editButton = document.querySelector(".edit-button");
    const deleteButton = document.querySelector(".delete-button");
    const commentInput = document.getElementById("comment");
    const commentForm = document.querySelector(".comment-write");
    const commentsContainer = document.querySelector(".comments-container");

    // URL에서 postId 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("postId");

    // 헤더 로드
    await loadHeader();

    // 현재 로그인한 사용자 ID 가져오기 (쿼리에 포함되지 않음)
    const currentUserId = await fetchCurrentUserId();
    console.log("🔍 현재 로그인한 사용자 ID:", currentUserId);

    // 게시물 데이터 불러오기 및 UI 업데이트
    const postData = await fetchPostData(postId, {
        postTitle, profileImg, writer, createdAt, articleImg, articleContent,
        likeCount, visitCount, commentCount, editButton, deleteButton
    }, currentUserId);

    // 좋아요 UI 업데이트
    updateLikeUI(postData.isLike);

    // 좋아요 버튼 클릭 이벤트 추가
    likeContainer.addEventListener("click", async () => {
        await toggleLike(postId);
    });

    if (editButton) {
        editButton.addEventListener("click", () => {
            localStorage.setItem("postId", postId);
            localStorage.setItem("postTitle", postTitle.textContent);
            localStorage.setItem("postContent", articleContent.textContent);
            localStorage.setItem("articleImg", articleImg.src);
            window.location.href = "editPostPage.html";
        });
    }

    if (deleteButton) {
        deleteButton.addEventListener("click", async () => {
            if (confirm("정말 게시글을 삭제하시겠습니까?")) {
                await deletePost(postId);
            }
        });
    }

    await fetchComments(postId, currentUserId);

    commentForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const commentText = commentInput.value.trim();
        if (!commentText) {
            alert("댓글을 입력하세요!");
            return;
        }
        const success = await createComment(postId, commentText, currentUserId);
        if (success) {
            location.reload();
        }
    });
});
async function fetchCurrentUserId() {
    let accessToken = getCookie("accessToken");
    let refreshToken = getCookie("refreshToken");

    if (!accessToken) return null;

    try {
        let response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${accessToken}`,
                "RefreshToken": refreshToken
            }
        });

        // 401 또는 403 발생 시 재시도 (AccessToken 만료 가능성)
        if (response.status === 401 || response.status === 403) {
            console.warn("🔄 AccessToken 만료됨. 응답 헤더에서 새로운 토큰 확인 중...");

            // 응답 헤더에서 새로운 AccessToken 확인
            const newAccessToken = response.headers.get("Authorization")?.replace("Bearer ", "");

            if (newAccessToken) {
                console.warn("✅ 새 AccessToken 발견! 갱신 후 재요청");
                document.cookie = `accessToken=${newAccessToken}; path=/; Secure; HttpOnly`;

                // 새로운 AccessToken으로 다시 요청
                response = await fetch(`${API_BASE_URL}/users/profile`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${newAccessToken}` }
                });
            } 
            
            
        }

        if (!response.ok) throw new Error("사용자 정보 조회 실패");

        const data = await response.json();
        return data.data.userId;
    } catch (error) {
        console.error("🚨 현재 사용자 정보 가져오기 실패:", error);
        return null;
    }
}

// 특정 요소가 존재할 때까지 대기하는 함수 추가
async function waitForElement(selector) {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (document.querySelector(selector)) {
                clearInterval(interval);
                resolve();
            }
        }, 100); // 100ms 간격으로 확인
    });
}

// 🔹 헤더 불러오기 및 script 추가
async function loadHeader() {
    return new Promise((resolve) => {
        fetch("header.html")
            .then((response) => response.text())
            .then((data) => {
                document.getElementById("header-placeholder").innerHTML = data;
                loadHeaderScript(); // header.js 추가 로드
                resolve();
            })
            .catch((error) => console.error("헤더를 불러오는 중 오류 발생:", error));
    });
}

function loadHeaderScript() {
    const script = document.createElement("script");
    script.src = "../script/header.js";
    document.body.appendChild(script);
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




async function fetchPostData(postId, elements, currentUserId) {
    let accessToken = getCookie("accessToken");
    let refreshToken = getCookie("refreshToken");
    if (!accessToken) {
        console.warn("인증 필요. 로그인 페이지로 이동.");
        window.location.href = "loginPage.html";
        return;
    }

    try {
        let response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${accessToken}`,
                "RefreshToken": refreshToken
            }
        });

        // 401 또는 403 발생 시 재시도 (AccessToken 만료 가능성)
        if (response.status === 401 || response.status === 403) {
            console.warn("🔄 AccessToken 만료됨. 응답 헤더에서 새로운 토큰 확인 중...");

            // 응답 헤더에서 새로운 AccessToken 확인
            const newAccessToken = response.headers.get("Authorization")?.replace("Bearer ", "");

            if (newAccessToken) {
                console.warn("✅ 새 AccessToken 발견! 갱신 후 재요청");
                document.cookie = `accessToken=${newAccessToken}; path=/; Secure; HttpOnly`;

                // 새로운 AccessToken으로 다시 요청
                response = await fetch(`${API_BASE_URL}/users/profile`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${newAccessToken}` }
                });
            } 
            
            
        }

        if (!response.ok) throw new Error("게시글 조회 실패");

        const data = await response.json();
        console.log("✅ 게시글 조회 성공:", data);

        const postData = data.data;

        elements.postTitle.textContent = postData.title;
        elements.profileImg.src = postData.userProfileImage || "../img/profile.png";
        elements.writer.textContent = postData.userName;
        elements.createdAt.textContent = new Date(postData.createdAt).toLocaleString();
        elements.articleImg.src = postData.contentImage || "../img/default.jpg";
        elements.articleContent.textContent = postData.content;
        elements.likeCount.textContent = postData.likeCount;
        elements.visitCount.textContent = postData.visitCount;
        elements.commentCount.textContent = postData.commentCount;

        if (postData.userId === currentUserId) {
            elements.editButton.style.display = "block";
            elements.deleteButton.style.display = "block";
        } else {
            elements.editButton.style.display = "none";
            elements.deleteButton.style.display = "none";
        }

        return postData;
    } catch (error) {
        console.error("🚨 게시글 조회 오류:", error);
        alert("게시글을 불러오는 데 실패했습니다.");
    }
}
// ✅ 댓글 조회
async function fetchComments(postId, currentUserId) {
    let accessToken = getCookie("accessToken");
    let refreshToken = getCookie("refreshToken");

    if (!accessToken) {
        console.warn("❌ 인증 필요. 로그인 페이지로 이동.");
        window.location.href = "loginPage.html";
        return;
    }

    try {
        let response = await fetch(`${API_BASE_URL}/posts/${postId}/comments?page=0&offset=20`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "RefreshToken": refreshToken
            }
        });

        // 401 또는 403 발생 시 재시도 (AccessToken 만료 가능성)
        if (response.status === 401 || response.status === 403) {
            console.warn("🔄 AccessToken 만료됨. 응답 헤더에서 새로운 토큰 확인 중...");

            // 응답 헤더에서 새로운 AccessToken 확인
            const newAccessToken = response.headers.get("Authorization")?.replace("Bearer ", "");

            if (newAccessToken) {
                console.warn("✅ 새 AccessToken 발견! 갱신 후 재요청");
                document.cookie = `accessToken=${newAccessToken}; path=/; Secure; HttpOnly`;

                // 새로운 AccessToken으로 다시 요청
                response = await fetch(`${API_BASE_URL}/users/profile`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${newAccessToken}` }
                });
            } 
            
            
        }

        if (!response.ok) throw new Error("댓글 조회 실패");

        const data = await response.json();
        console.log("✅ 댓글 조회 성공:", data);

        const commentsContainer = document.querySelector('.comments-container');
        commentsContainer.innerHTML = ""; // 기존 댓글 제거 후 추가

        data.data.comments.forEach(comment => {
            commentsContainer.appendChild(createCommentElement(comment, currentUserId,postId));
        });
    } catch (error) {
        console.error(error);
    }
}

// ✅ 댓글 UI 생성 (본인 댓글만 수정/삭제 버튼 표시)
function createCommentElement(comment, currentUserId, postId) {
    const commentContainer = document.createElement("section");
    commentContainer.classList.add("comment-container");

    commentContainer.innerHTML = `
        <div class="comment-information">
            <div class="comment-profile">
                <img src="${comment.userProfileImage || "../img/profile.png"}" class="profile-img"/>
                <p class="writer"><strong>${comment.userName}</strong></p>
                <p class="created-at">${new Date(comment.createdAt).toLocaleString()}</p>
            </div>
            <p class="comment-content">${comment.content}</p>
        </div>
        <div class="comment-buttons" style="${comment.userId !== currentUserId ? 'display: none;' : ''}">
            <button class="edit-comment" data-id="${comment.commentId}">수정</button>
            <button class="delete-comment" data-id="${comment.commentId}">삭제</button>
        </div>
    `;

    // ✅ 수정 버튼 이벤트 추가
    const editButton = commentContainer.querySelector(".edit-comment");
    editButton?.addEventListener("click", () => {
        const newContent = prompt("수정할 내용을 입력하세요.", comment.content);
        if (newContent) {
            editComment(postId, comment.commentId, newContent);
        }
    });

    // ✅ 삭제 버튼 이벤트 추가
    const deleteButton = commentContainer.querySelector(".delete-comment");
    deleteButton?.addEventListener("click", () => {
        if (confirm("정말 삭제하시겠습니까?")) {
            deleteComment(postId, comment.commentId);
        }
    });

    return commentContainer;
}
// 🔹 댓글 작성 API 적용
async function createComment(postId, content, currentUserId) {
    let accessToken = getCookie("accessToken");
    if (!accessToken) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${accessToken}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ content }) // ✅ API 요청 본문 적용
        });

        if (!response.ok) throw new Error("댓글 작성 실패");

        const data = await response.json();
        console.log("✅ 댓글 작성 성공:", data);
        
        // ✅ 성공했으면 true 반환
        return true;
    } catch (error) {
        console.error("🚨 댓글 작성 오류:", error);
        return false;
    }
}
async function editComment(postId, commentId, newContent) {
    let accessToken = getCookie("accessToken");
    let refreshTokenValue = getCookie("refreshToken");
    if (!accessToken || !refreshTokenValue) return;

    try {
        let response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
            method: "PUT",
            headers: { 
                "Authorization": `Bearer ${accessToken}`, 
                "Refresh-Token": refreshTokenValue, 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: newContent }) // ✅ API 요청 본문 적용
        });

        // ✅ accessToken이 만료되면 refreshToken 사용하여 재요청
        if (response.status === 401) {
            console.warn("AccessToken 만료됨. RefreshToken으로 재발급 시도.");
            accessToken = await refreshToken();
            if (accessToken) {
                response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
                    method: "PUT",
                    headers: { 
                        "Authorization": `Bearer ${accessToken}`, 
                        "Refresh-Token": refreshTokenValue, 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ content: newContent })
                });
            } else {
                throw new Error("토큰 갱신 실패, 로그인 페이지로 이동합니다.");
            }
        }

        if (!response.ok) throw new Error("댓글 수정 실패");

        console.log("✅ 댓글 수정 성공");
        location.reload(); // ✅ 수정 후 새로고침하여 UI 업데이트
    } catch (error) {
        console.error("🚨 댓글 수정 오류:", error);
    }
}
// 🔹 댓글 삭제 API 적용 (refreshToken 포함)
async function deleteComment(postId, commentId) {
    let accessToken = getCookie("accessToken");
    let refreshTokenValue = getCookie("refreshToken");
    if (!accessToken || !refreshTokenValue) return;

    try {
        let response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
            method: "DELETE",
            headers: { 
                "Authorization": `Bearer ${accessToken}`, 
                "Refresh-Token": refreshTokenValue
            }
        });

        // ✅ accessToken이 만료되면 refreshToken 사용하여 재요청
        if (response.status === 401) {
            console.warn("AccessToken 만료됨. RefreshToken으로 재발급 시도.");
            accessToken = await refreshToken();
            if (accessToken) {
                response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
                    method: "DELETE",
                    headers: { 
                        "Authorization": `Bearer ${accessToken}`, 
                        "Refresh-Token": refreshTokenValue
                    }
                });
            } else {
                throw new Error("토큰 갱신 실패, 로그인 페이지로 이동합니다.");
            }
        }

        if (!response.ok) throw new Error("댓글 삭제 실패");

        console.log("✅ 댓글 삭제 성공");
        location.reload(); // ✅ 삭제 후 새로고침하여 UI 업데이트
    } catch (error) {
        console.error("🚨 댓글 삭제 오류:", error);
    }
}
// 🔹 게시글 삭제 API 적용
async function deletePost(postId) {
    let accessToken = getCookie("accessToken");
    let refreshTokenValue = getCookie("refreshToken");
    if (!accessToken || !refreshTokenValue) return;

    try {
        let response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: "DELETE",
            headers: { 
                "Authorization": `Bearer ${accessToken}`, 
                "Refresh-Token": refreshTokenValue
            }
        });

        // ✅ accessToken이 만료되면 refreshToken 사용하여 재요청
        if (response.status === 401) {
            console.warn("AccessToken 만료됨. RefreshToken으로 재발급 시도.");
            accessToken = await refreshToken();
            if (accessToken) {
                response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
                    method: "DELETE",
                    headers: { 
                        "Authorization": `Bearer ${accessToken}`, 
                        "Refresh-Token": refreshTokenValue
                    }
                });
            } else {
                throw new Error("토큰 갱신 실패, 로그인 페이지로 이동합니다.");
            }
        }

        if (!response.ok) throw new Error("게시글 삭제 실패");

        console.log("✅ 게시글 삭제 성공");
        alert("게시글이 삭제되었습니다.");
        window.location.href = "postsPage.html"; // ✅ 삭제 후 메인 페이지로 이동
    } catch (error) {
        console.error("🚨 게시글 삭제 오류:", error);
    }
}
// ✅ 좋아요 UI 업데이트
function updateLikeUI(isLiked) {
    const likeContainer = document.querySelector("#like-count").parentElement;
    likeContainer.style.backgroundColor = isLiked ? "#ACA0EB" : "#D9D9D9";
}
// ✅ 좋아요 토글 API 요청
async function toggleLike(postId) {
    let accessToken = getCookie("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        window.location.href = "loginPage.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${accessToken}` }
        });

        if (!response.ok) throw new Error("좋아요 요청 실패");

        console.log("✅ 좋아요 요청 성공");
        location.reload();
    } catch (error) {
        console.error("🚨 좋아요 요청 오류:", error);
    }
}