let question = document.querySelector(".question");
let answers = document.querySelectorAll(".answer");
let score = document.querySelector(".score");
let questCount = document.querySelector(".header p:first-of-type");
let progressBar = document.querySelector(".progress_bar>div")

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function fetchdata() {
  try {
    let response = await fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple");
    let json = await response.json();
    return json["results"];
  } catch (err) {
    alert(err);
  }
}

async function check(rightAns) {
  let promiseAns = new Promise((resolve) => {
    document.addEventListener("click", (e) => {
      if (e.target.parentElement.classList.contains("mcq")) {
        let answerExtract = e.target.parentElement.children[1];
        if (answerExtract.innerHTML == rightAns) {
          answerExtract.setAttribute("style", "background-color: lightgreen;");
          setTimeout(() => {
            answerExtract.setAttribute("style", "background-color: white;");
            resolve("correct");
          }, 2000);
        }
        else {
          answerExtract.setAttribute("style", "background-color: rgb(233, 72, 72);");
          let correctAns;
          for (let j = 0; j < answers.length; j++) {
            if (answers[j].innerHTML == rightAns) {
              correctAns = answers[j];
              correctAns.setAttribute("style", "background-color: lightgreen;");
              break;
            }
          }
          setTimeout(() => {
            for (let j = 0; j < answers.length; j++) {
              answers[j].setAttribute("style", "background-color: white;");
            }
            resolve("incorrect");
          }, 2000);
        }
      }
    })
  })
  return promiseAns;
}

async function questionLoop(quest) {
  question.innerHTML = quest.question;
  let answerArr = quest.incorrect_answers;
  answerArr.push(quest.correct_answer);
  answerArr = shuffleArray(answerArr);
  for (let j = 0; j < answers.length; j++) {
    answers[j].innerHTML = answerArr[j];
  }
  let value = await check(quest.correct_answer)

  return value;
}

fetchdata().then(async (masterArr) => {
  let count = 1;
  let scoreVal = 0;
  score.innerHTML = "0";
  for (let i = 0; i < masterArr.length; i++) {
    questCount.innerHTML = `Question : ${count}/10`;
    progressBar.setAttribute("style",`width: ${count*10}% !important;`)
    let value = await questionLoop(masterArr[i]);
    console.log(value);
    if (value == "correct"){
      scoreVal += 10;
      score.innerHTML = scoreVal; 
    }
    count++;
    if (count == 11)
      break;
  }
  localStorage.setItem('score', scoreVal);
  setTimeout(function(){document.location.href = "end.html"},500);
  
})