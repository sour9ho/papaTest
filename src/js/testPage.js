import {fetchCsv} from './fileFetching.js'

const filePath = "./data/testpaper.csv"

export async function testPage(callback){

    const $title = document.getElementsByClassName("page-title")[0];
    $title.innerText = "PART-TIME PARTNER"

    const $nav = document.getElementsByClassName("bottom-nav")[0];
    $nav.innerText = "답을 선택해주세요"

    const $submission = document.createElement('button');
    $submission.classList.add('submission');
    $submission.innerText = "제출하기";

    const $main = document.getElementById("main");
    let data = await fetchCsv(filePath);
    while(data.length > 10){
        data.pop();
    }
    const testPaper = new TestPaper(data, $nav, $submission, callback);
    $main.appendChild(testPaper.getTestPaper());

}



class TestPaper{
    constructor(testPaperJson, nav, submission, callback){
        this.testPaper = this.makeTestPaper(testPaperJson);
        this.$nav = nav;
        this.$submission = submission;
        this.callback = callback;
        this.$submission.onclick = () => {
            this.callback(this.getScore());
        }
    }

    makeTestPaper(testPaperData){
        const arr = [];
        for(let problem of testPaperData){
            const problemNumber = problem["number"],
                problemPoint = parseInt(problem["points"], 10),
                question = problem["question"],
                choices = [problem["answer"], problem["wa1"], problem["wa2"], problem["wa3"]];

            const problemContainer = new ProblemContainer(problemNumber, problemPoint, question, choices, this);
            arr.push(problemContainer);
        }
        return arr;
    }

    getTestPaper(){
        const $div = document.createElement('div');
        $div.classList.add('test-paper');

        for(let problem of this.testPaper){
            const $problem = problem.getProblemContainer();
            $div.appendChild($problem);
        }
        
        return $div;
    }

    getScore(){
        let score = 0;
        for(let problem of this.testPaper){
            score += problem.getPoint();
        }
        return score;
    }
    
    getNotAnswered(){
        let answeredProblem = 0;
        for(let problem of this.testPaper){
            if(problem.getAnswered()){
                answeredProblem++;
            }
        }
        return this.testPaper.length - answeredProblem;
    }

    notifyingSelected(){
        const numNotAnswered = this.getNotAnswered();
        let message = "";
        if(numNotAnswered === 0){
            this.$nav.innerText = "";
            this.$nav.appendChild(this.$submission);
        } else{
            message = `${numNotAnswered} 개의 질문이 남았습니다`;
            this.$nav.innerText = message;
        }
    }
}



class ProblemContainer{
    constructor(problemNumber, problemPoint, question, choices, _testPaper){
        const [answerNumber, shuffledChoices] = this.shuffleChoices(choices);
        this.testPaper = _testPaper;
        this.point = problemPoint;
        this.answer = answerNumber;
        this.choiceManager = new ChoiceButtonContainer(shuffledChoices, this);
        this.$problemContainer = this.makeProblemContainer(problemNumber, question, this.choiceManager.getChoiceButtonContainer());
    }

    makeProblemContainer(problemNumber, question, $divChoice){
        const $divProblem = document.createElement('div');
        $divProblem.classList.add('problem');

        const $divQuestion = document.createElement('div');
        $divQuestion.classList.add('question');
        $divQuestion.innerText = `Q${problemNumber}.  ${question} (${this.point}/200)`;

        $divProblem.appendChild($divQuestion);
        $divProblem.appendChild($divChoice);

        return $divProblem;
    }

    shuffleChoices(choices){
        const numOfChoices = choices.length;
        const randomIndex = [];
        for(let i=0; i<numOfChoices; i++){
            randomIndex.push(i);
        }
        randomIndex.sort(() => Math.random() - 0.5);

        const shuffledChoices = [];
        for(let r of randomIndex){
            shuffledChoices.push(choices[r]);
        }

        let answerNumber = -1;
        for(let j=0; j<numOfChoices; j++){
            if(randomIndex[j] === 0){
                answerNumber = j;
            }
        }

        return [answerNumber, shuffledChoices];
    }

    getAnswered(){
        let answered = false;
        if(this.choiceManager.getSelected() !== -1){
            answered = true;
        }
        return answered;
    }

    getPoint(){
        let point = 0;
        console.log(this.answer, this.choiceManager.getSelected());
        if(this.answer === this.choiceManager.getSelected()){
            point = this.point;
        }
        return point;
    }

    getProblemContainer(){
        return this.$problemContainer;
    }

    notifyingSelected(){
        this.testPaper.notifyingSelected();
        console.log('answer:', this.answer);
    }
}



class ChoiceButtonContainer{
    constructor(choices, _problemContainer){
        this.problemContainer = _problemContainer;
        this.$choiceButtonContainer = this.makeChoiceButtonContainer();
        this.btnList = this.makeChoiceButtonList(choices);
        this.addActions();
        this.appendButtons();
    }

    makeChoiceButtonContainer(){
        const $div = document.createElement('div');
        $div.classList.add('choice');
        return $div;
    }

    makeChoiceButtonList(choices){
        const buttonList = [];
        for(let choice of choices){
            const $btn = document.createElement('button');
            $btn.classList.add('choice-button');
            $btn.innerText = choice;

            buttonList.push($btn);
        }
        return buttonList;
    }

    addActions(){
        const btnListLen = this.btnList.length;
        for(let i=0; i<btnListLen; i++){
            const $btn = this.btnList[i];
            $btn.onclick = () => {
                this.setSelected(i);
                console.log("select:", i)
            }
        }
    }

    appendButtons(){
        const btnListLen = this.btnList.length;
        for(let i=0; i<btnListLen; i++){
            const $btn = this.btnList[i];
            this.$choiceButtonContainer.appendChild($btn);
        }
        this.addActions();
    }

    setSelected(buttonIndex){
        const btnListLen = this.btnList.length;
        for(let i=0; i<btnListLen; i++){
            const $btn = this.btnList[i];
            if(buttonIndex === i){
                $btn.classList.add('selected');
            } else{
                $btn.classList.remove('selected');
            }
            this.problemContainer.notifyingSelected();
        }
    }

    getSelected(){
        let selected = -1;
        const btnListLen = this.btnList.length;
        for(let i=0; i<btnListLen; i++){
            const $btn = this.btnList[i];
            if($btn.classList.contains('selected')){
                selected = i;
            }
        }
        return selected;
    }

    getChoiceButtonContainer(){
        return this.$choiceButtonContainer;
    }
}
