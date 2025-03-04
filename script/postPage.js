document.addEventListener("DOMContentLoaded", async () => {
    const API_BASE_URL = "http://localhost:3000";
    
    // DOM 요소들
    const postTitle = document.querySelector(".post-header h1");
    const profileImg = document.querySelector(".profile-img");
    const writer = document.querySelector(".writer");
    const createdAt = document.querySelector(".created-at");
    const articleImg = document.querySelector(".article-img");
    const articleContent = document.querySelector("article p");
    const likeCount = document.getElementById("like-count");
    const visitCount = document.getElementById("visit-count");
    const commentCount = document.getElementById("comment-count");
    const commentsContainer = document.querySelector(".comments-container");
    const commentForm = document.querySelector(".comment-write");
    const commentInput = document.getElementById("comment");

    // 수정 및 삭제 버튼
    const editButtons = document.querySelectorAll(".edit-button");
    const deleteButtons = document.querySelectorAll(".delete-button");

    // 이미지 파일 업로드 처리
    const fileInput = document.querySelector("#file-upload");

    // URL에서 postId와 userId 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("postId");
    const currentUserId = urlParams.get("userId"); // URL에서 userId 가져오기

    
    async function loadHeader() {
        return new Promise((resolve) => {
            fetch("header.html")
                .then((response) => response.text())
                .then((data) => {
                    document.getElementById("header-placeholder").innerHTML = data;
                    loadHeaderScript();
                    resolve(); // 헤더 로드 완료 후 resolve
                })
                .catch((error) => console.error("헤더를 불러오는 중 오류 발생:", error));
        });
    }

    // header.js를 동적으로 로드하는 함수
    function loadHeaderScript() {
        const script = document.createElement("script");
        script.src = "../script/header.js";
        document.body.appendChild(script);
    }

   
    const seasonData = {
        0: { // 봄
            postId:0,
            title: "봄의 시작",
            content: "봄이 오면 따뜻한 햇살과 함께 벚꽃이 피어나고, 세상이 다시 살아나는 것 같아요. 겨울의 차가움을 이겨내고 피어나는 꽃들은 우리에게 희망을 줍니다. 공원에서 봄바람을 맞으며 산책을 하거나, 카페에서 봄 한정 메뉴를 즐기는 것도 참 좋죠.",
            image: "../img/spring.jpg",
            userId: 1,
            likes: Math.floor(Math.random() * 50) + 100,
            views: Math.floor(Math.random() * 300) + 500,
            comments: [
                "봄이 정말 좋아요! 벚꽃 보러 가고 싶어요.",
                "봄이 오면 기분이 좋아져요!",
                "벚꽃 축제 가본 사람 있나요?",
            ]
        },
        1: { // 여름
            postId:1,
            title: "여름의 열기",
            content: "여름은 뜨거운 태양과 시원한 바다를 떠올리게 합니다. 친구들과 함께 해변에서 수영을 하고, 바베큐 파티를 열어 즐기는 것도 여름의 묘미죠. 아이스크림을 한입 베어물 때 느껴지는 달콤함과 함께 여름의 더위를 이겨내요!",
            image: "../img/summer.jpg",
            userId: 2,
            likes: Math.floor(Math.random() * 50) + 200,
            views: Math.floor(Math.random() * 300) + 800,
            comments: [
                "여름엔 수박과 바다가 최고죠!",
                "더워도 여름밤이 정말 좋아요!",
                "여름휴가 어디 가시나요?",
            ]
        },
        2: { // 가을
            postId:2,
            title: "가을의 낭만",
            content: "가을이 되면 나뭇잎들이 붉게 물들고, 바람이 선선해집니다. 독서하기 좋은 계절이며, 가을밤에 따뜻한 커피 한 잔과 함께 분위기 있는 음악을 듣는 것도 좋습니다. 단풍이 가득한 산책길을 걸으며 계절의 변화를 만끽해보세요",
            image: "../img/autumn.jpg",
            userId: 3,
            likes: Math.floor(Math.random() * 50) + 150,
            views: Math.floor(Math.random() * 300) + 700,
            comments: [
                "가을 감성 최고! 단풍 구경 가고 싶어요.",
                "선선한 바람이 불 때가 제일 좋아요.",
                "가을밤엔 독서가 딱이죠!",
            ]
        },
        3: { // 겨울
            postId:3,
            title: "겨울의 마법",
            content: "겨울은 눈 내리는 풍경과 함께 포근한 분위기를 줍니다. 크리스마스와 연말이 다가오면 따뜻한 코코아 한 잔을 마시며 가족과 함께 시간을 보내는 것이 가장 행복한 순간이죠. 겨울에는 스키와 썰매 타는 재미도 빼놓을 수 없습니다!",
            image: "../img/winter.jpg",
            userId: 4,
            likes: Math.floor(Math.random() * 50) + 120,
            views: Math.floor(Math.random() * 300) + 600,
            comments: [
                "겨울에는 눈사람 만들기 최고!",
                "크리스마스가 기대돼요 🎄",
                "스키 타러 가고 싶은데 어디가 좋을까요?",
            ]
        }
    };

   
    async function fetchPostData(postId) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });

            if (!response.ok) throw new Error("API 요청 실패");

            const data = await response.json();
            console.log("게시글 조회 성공:", data);

            postTitle.textContent = data.title;
            profileImg.src = data.profileImageUrl;
            writer.textContent = data.username;
            createdAt.textContent = data.date;
            articleImg.src = data.imageUrl;
            articleContent.textContent = data.content;
            likeCount.textContent = data.likes;
            visitCount.textContent = data.views;
            commentCount.textContent = data.comments.length;

            
            if (data.userId === Number(currentUserId)) {
                // 수정 및 삭제 버튼 표시
                editButtons.forEach(button => button.style.display = 'inline-block');
                deleteButtons.forEach(button => button.style.display = 'inline-block');

                
                editButtons.forEach(button => {
                    button.addEventListener("click", () => {
                        localStorage.setItem("postId", data.postId); // 해당 게시글 ID 저장
                        localStorage.setItem("postTitle", data.title); // 제목 저장
                        localStorage.setItem("postContent", data.content); // 내용 저장
                        localStorage.setItem("articleImg",data.image);
                        localStorage.setItem("userId",currentUserId);
                        window.location.href = "editPostPage.html"; // 수정 페이지로 이동
                    });
                });

              
                deleteButtons.forEach(button => {
                    button.addEventListener("click", () => {
                        if (confirm("정말로 게시물을 삭제하시겠습니까?")) {
                            deletePost(postId);
                        }
                    });
                });
            } else {
                
                editButtons.forEach(button => button.style.display = 'none');
                deleteButtons.forEach(button => button.style.display = 'none');
            }

            fetchComments(postId); // 댓글 불러오기
        } catch (error) {
            console.error("게시글 조회 실패, 기본 계절 데이터 적용");

            const season = seasonData[postId] || seasonData[0];

            postTitle.textContent = season.title;
            profileImg.src = "../img/profile.png";
            writer.textContent = "익명 사용자";
            createdAt.textContent = "2025-03-02 12:00:00";
            articleImg.src = season.image;
            articleContent.textContent = season.content;
            likeCount.textContent = season.likes;
            visitCount.textContent = season.views;
            
            if (season.userId === Number(currentUserId)) {
                
                editButtons.forEach(button => button.style.display = 'inline-block');
                deleteButtons.forEach(button => button.style.display = 'inline-block');

                
                editButtons.forEach(button => {
                    button.addEventListener("click", () => {
                        localStorage.setItem("postId", season.postId); // 해당 게시글 ID 저장
                        localStorage.setItem("postTitle", season.title); // 제목 저장
                        localStorage.setItem("postContent", season.content); // 내용 저장
                        localStorage.setItem("articleImg",season.image);
                        localStorage.setItem("userId",currentUserId);
                        window.location.href = "editPostPage.html"; // 수정 페이지로 이동
                    });
                });

                
                deleteButtons.forEach(button => {
                    button.addEventListener("click", () => {
                        if (confirm("정말로 게시물을 삭제하시겠습니까?")) {
                            deletePost(postId);
                        }
                    });
                });
            } else {
                
                editButtons.forEach(button => button.style.display = 'none');
                deleteButtons.forEach(button => button.style.display = 'none');
            }
            fetchComments(postId, true); // API 실패 시 기본 댓글 사용
        }
    }

    
    async function fetchComments(postId) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment?page=1&offset=5`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });

            if (!response.ok) throw new Error("댓글 API 요청 실패");

            const data = await response.json();
            console.log("댓글 조회 성공:", data);

            commentsContainer.innerHTML = "";
            data.forEach(comment => {
                addCommentElement(comment, false); // 실제 댓글 (수정/삭제 버튼 O)
            });

            commentCount.textContent = data.length;
        } catch (error) {
            console.error("댓글 조회 실패, 기본 계절 댓글 적용");

            const season = seasonData[postId] || seasonData[0];

            commentsContainer.innerHTML = "";
            season.comments.forEach(commentText => {
                addCommentElement({
                    commentSeq: `temp-${Date.now()}`,
                    username: "익명 사용자",
                    date: new Date().toISOString(),
                    content: commentText
                }, true); // 기본 댓글 (수정/삭제 버튼 X)
            });

            commentCount.textContent = season.comments.length;
        }
    }

    
    function addCommentElement(comment, isDefault = false) {
        const commentDiv = document.createElement("section");
        commentDiv.classList.add("comment-container");
        commentDiv.dataset.commentSeq = comment.commentSeq;

        commentDiv.innerHTML = `
            <div class="comment-information">
                <div class="comment-profile">
                    <img src="../img/profile.png" class="profile-img"/>
                    <p class="writer"><strong>${comment.username}</strong></p>
                    <p class="created-at">${new Date(comment.date).toLocaleString()}</p>
                </div>
                <p class="comment-content">${comment.content}</p>
            </div>
        `;

       
        if (!isDefault) {
            const buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("comment-buttons");
            buttonsDiv.innerHTML = `
                <button class="edit-button">수정</button>
                <button class="delete-button">삭제</button>
            `;

            
            buttonsDiv.querySelector(".edit-button").addEventListener("click", () => {
                const newContent = prompt("새로운 댓글을 입력하세요:", comment.content);
                if (newContent) {
                    editComment(comment.commentSeq, newContent);
                }
            });

            
            buttonsDiv.querySelector(".delete-button").addEventListener("click", () => {
                if (confirm("정말로 댓글을 삭제하시겠습니까?")) {
                    deleteComment(comment.commentSeq);
                }
            });

            commentDiv.appendChild(buttonsDiv);
        }

        commentsContainer.prepend(commentDiv);
    }

   
    async function postComment(content) {
        const tempComment = {
            commentSeq: `temp-${Date.now()}`, // 임시 ID (API 실패 시 삭제할 수 있도록 설정)
            username: "익명 사용자",
            date: new Date().toISOString(),
            content
        };

        // 로컬에 즉시 추가
        addCommentElement(tempComment);

        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) throw new Error("댓글 작성 실패");

            const data = await response.json();
            console.log("댓글 작성 성공:", data);

            // 임시 댓글을 실제 댓글 데이터로 업데이트
            replaceTempComment(tempComment.commentSeq, data);
        } catch (error) {
            console.error("댓글 작성 오류:", error);
            alert("댓글 작성이 실패했지만, 로컬에 임시 저장되었습니다.");
        } finally {
            commentInput.value = ""; // 입력창 초기화
        }
    }

   
    async function editComment(commentSeq, newContent) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentSeq}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content: newContent })
            });

            if (!response.ok) throw new Error("댓글 수정 실패");

            console.log("댓글 수정 성공");
            fetchComments(postId);
        } catch (error) {
            console.error("댓글 수정 오류:", error);
            alert("댓글 수정에 실패했습니다.");
        }
    }

    
    async function deleteComment(commentSeq) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentSeq}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });

            if (!response.ok) throw new Error("댓글 삭제 실패");

            console.log("댓글 삭제 성공");
            fetchComments(postId);
        } catch (error) {
            console.error("댓글 삭제 오류:", error);
            alert("댓글 삭제에 실패했습니다.");
        }
    }

    
    function replaceTempComment(tempId, actualComment) {
        const tempComment = document.querySelector(`[data-comment-seq="${tempId}"]`);
        if (tempComment) {
            tempComment.dataset.commentSeq = actualComment.commentSeq;
            tempComment.querySelector(".writer strong").textContent = actualComment.username;
            tempComment.querySelector(".created-at").textContent = new Date(actualComment.date).toLocaleString();
            tempComment.querySelector(".comment-content").textContent = actualComment.content;
        }
    }

    commentForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const content = commentInput.value.trim();
        if (content === "") {
            alert("댓글을 입력해주세요.");
            return;
        }
        postComment(content);
    });

   
    await loadHeader();
    await fetchPostData(postId);
});
