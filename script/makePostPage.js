document.addEventListener('DOMContentLoaded', () => {
    // header.html 파일을 동적으로 불러와서 페이지에 삽입
    fetch('header.html') 
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            loadHeaderScript(); // 스크립트 로드 함수 실행
        })
        .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));

    
    const submitButton = document.querySelector('button[type="submit"]');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');

    updateButtonState();

    
    titleInput.addEventListener('input', updateButtonState);
    contentInput.addEventListener('input', updateButtonState);

    
    submitButton.addEventListener('click', handleSubmit);
});

// header.js를 동적으로 로드하는 함수
function loadHeaderScript() {
    const script = document.createElement('script');
    script.src = '../script/header.js'; // 실제 header.js 경로 확인 필요
    document.body.appendChild(script);
}


function updateButtonState() {
    const submitButton = document.querySelector('button[type="submit"]');
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    // 제목과 내용이 모두 입력되면 버튼 활성화
    if (title && content) {
        submitButton.style.backgroundColor = '#7F6AEE'; // 버튼 색상 변경
        submitButton.disabled = false; // 버튼 활성화
    } else {
        submitButton.style.backgroundColor = '#ACA0EB'; // 기본 버튼 색상
        submitButton.disabled = true; // 버튼 비활성화
    }
}


async function handleSubmit(event) {
    event.preventDefault(); // 기본 폼 제출을 막음

   
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageFile = document.getElementById('file-upload').files[0];

    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        // POST 요청 보내기
        const response = await fetch('https://your-api-url.com/posts', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer xxxxxxx', // 실제 인증 토큰을 여기에 넣어주세요
            },
            body: formData,
        });

        if (response.ok) {
            
            const data = await response.json();
            console.log('게시글 작성 성공:', data);
            window.location.href = 'postsPage.html'; // 게시글 목록 페이지로 이동
        } else {
            
            throw new Error('게시글 작성 실패');
        }
    } catch (error) {
        console.error('오류 발생:', error);
        window.location.href = 'postsPage.html';
    }
}



