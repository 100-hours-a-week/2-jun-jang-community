// header.html을 동적으로 가져와 #header-placeholder에 삽입
document.addEventListener('DOMContentLoaded', () => {
    fetch('header.html') // header.html 경로 확인 필요
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('헤더를 불러오는 중 오류 발생:', error));
});