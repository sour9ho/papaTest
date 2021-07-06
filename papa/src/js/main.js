import {testPage} from './testPage.js'

const $welcome = document.getElementById('welcome-page');
const $test = document.getElementById('test-page');
const $result = document.getElementById('result-page'); 

$test.style.display = "none";
$result.style.display = "none";

function moveToResult(score){
    const $score = document.getElementsByClassName('score')[0];
    $score.innerText = `${score}/200점`;
    $test.style.display = "none";
    $result.style.display = "block";
}

async function loadTestPage(callback){
    await testPage(callback);
}
loadTestPage(moveToResult);

const $apply = document.getElementsByClassName('apply')[0];
$apply.onclick = () => {
    $welcome.style.display = "none";
    $test.style.display = "block";
}




//Javascript
let lastScrollTop = 0;
let delta = 5;
let fixBox = document.querySelector('.bottom-nav');
let fixBoxHeight = fixBox.offsetHeight;
let didScroll;
//스크롤 이벤트 
window.onscroll = function(e) {
    didScroll = true;
};

//0.25초마다 스크롤 여부 체크하여 스크롤 중이면 hasScrolled() 호출
setInterval(function(){
    if(didScroll){
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled(){
    let nowScrollTop = window.scrollY;
    if(Math.abs(lastScrollTop - nowScrollTop) <= delta){
        return;
    }
    if(nowScrollTop > lastScrollTop && nowScrollTop > fixBoxHeight){
        //Scroll down
        fixBox.classList.remove('show');
    }else{
        if(nowScrollTop + window.innerHeight < document.body.offsetHeight){
            //Scroll up
            fixBox.classList.add('show');
        }
    }
    lastScrollTop = nowScrollTop;
}