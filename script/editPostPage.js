document.addEventListener('DOMContentLoaded', () => {
    fetch('header.html') 
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            loadHeaderScript(); // 스크립트 로드 함수 실행
        })
        .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));
    const postId = localStorage.getItem('postId');
    const userId = localStorage.getItem('userId');
    const savedTitle = localStorage.getItem('postTitle') || '';
    const savedContent = localStorage.getItem('postContent') || '';
    const savedImage = localStorage.getItem('articleImg') || '';
    
    document.getElementById('title').value = savedTitle;
    document.getElementById('content').value = savedContent;
    
    if (savedImage) {
        const previewImg = document.getElementById('previewImage');
        if (previewImg) {
        previewImg.src = savedImage;
        }
    }
    
    // "수정하기" 버튼 클릭 이벤트 설정
    const updateBtn = document.getElementById('updateBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', updatePost);
    }
});
function updatePost() {
    const postId = localStorage.getItem('postId');
    const userId = localStorage.getItem('userId');  
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    // 기본적으로 contentImage에 기존 이미지 값을 넣음
    let contentImage = localStorage.getItem('articleImg');
    
    // 3. 새로운 이미지가 선택되었는지 확인
    const fileInput = document.getElementById('imageFile');  // 파일 선택 input의 ID가 'imageFile'인 경우
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
     
      const reader = new FileReader();
      reader.onload = function (e) {
        contentImage = e.target.result;  // 이미지 파일을 Base64 문자열(Data URL)로 변환
        
        
        sendPatchRequest();
      };
      reader.readAsDataURL(file);
    } else {
      
      sendPatchRequest();
    }
    

    function sendPatchRequest() {
      
      const data = {
        title: title,
        content: content
      };
  
      if (contentImage) {
        data.contentImage = contentImage;
      }
      
      // 4. PATCH API 호출
      fetch(`/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authentication': 'Bearer xxxxxx.'  // 인증 토큰을 포함한 헤더
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        // 서버 응답 확인 (필요하면 response.ok로 성공 여부 체크 가능)
        return response.json().catch(() => ({}));  // JSON 응답 파싱 (응답이 없거나 JSON이 아닐 경우 대비)
      })
      .then(result => {
        // 5. 성공 여부와 관계없이 게시글 상세 페이지로 이동
        window.location.href = `postPage.html?postId=${postId}&userId=${userId}`;
      })
      .catch(error => {
        // 에러 발생 시 콘솔에 출력하고, 동일하게 게시글 페이지로 이동
        console.error('게시글 수정 요청 실패:', error);
        window.location.href = `postPage.html?postId=${postId}&userId=${userId}`;
      });
    }
  }
// header.js를 동적으로 로드하는 함수
function loadHeaderScript() {
    const script = document.createElement('script');
    script.src = '../script/header.js'; // 실제 header.js 경로 확인 필요
    document.body.appendChild(script);
}
