document.addEventListener('DOMContentLoaded', () => {
    fetch('header.html') 
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            loadHeaderScript(); // 스크립트 로드 함수 실행
        })
        .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));
    
    const imageUploadInput = document.getElementById('image-upload');
    const profileImage = document.getElementById('profile-image');
    
    imageUploadInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result; // 프로필 이미지 변경
            };
            reader.readAsDataURL(file);
        }
    });

   
    document.querySelector('.submit-btn').addEventListener('click', function() {
        const nickname = document.getElementById('nickname').value;
        const postId = 12345; 
        const title = '게시물 제목'; 
        const content = '게시물 내용'; 
        const contentImage = '이미지 URL'; 
        // PATCH 요청 보내기
        fetch(`/posts/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer xxxxx' 
            },
            body: JSON.stringify({
                title: title,
                content: content,
                contentImage: contentImage
            })
        })
        .then(response => response.json())
        .then(data => {
            
            const toast = document.getElementById('toast-message');
            toast.className = 'toast-message show';
            
            
            setTimeout(function() {
                toast.className = toast.className.replace('show', '');
            }, 3000);

            
            window.location.href = 'postsPage.html';
        })
        .catch(error => {
            console.error('게시물 수정 중 오류 발생:', error);
            
            window.location.href = 'postsPage.html';
        });
    });
});

function loadHeaderScript() {
    const script = document.createElement('script');
    script.src = '../script/header.js'; 
    document.body.appendChild(script);
}
document.querySelector('.submit-btn').addEventListener('click', function() {
    
    const toast = document.getElementById('toast-message');
    toast.className = 'toast-message show';

   
    setTimeout(function() {
        toast.className = toast.className.replace('show', '');
    }, 3000); // 3초 후 사라짐
});