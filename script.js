const api = "https://the-trivia-api.com/v2/questions/";
let currentQuestionIndex = 0;
let currentQuestion;
let Questions = [];
let score = 0;
let optionsElement;
let interval;
let timer = document.getElementById("timer");
const nextBtn = document.getElementById("next");
async function loadData() {
  Questions = await fetch(api).then((res) => res.json());
  console.log(Questions);
}

function handleStart() {
  const start = document.getElementById("start");
  console.log("start");
  const Container = document.getElementById("container");
  start.classList.add("hidden");
  Container.classList.remove("opacity-30", "cursor-not-allowed");
  loadQuestion();
}

function loadQuestion() {
  timer.innerHTML = 10;
  let questionElement = document.getElementById("question");
  optionsElement = document.getElementById("answers");
  currentQuestion = Questions[currentQuestionIndex];
  questionElement.innerHTML = `${currentQuestionIndex + 1}.${
    currentQuestion.question.text
  }`;

  console.log(currentQuestion.correctAnswer);
  let options = [
    currentQuestion.correctAnswer,
    ...currentQuestion.incorrectAnswers,
  ].sort(() => Math.random() - 0.5);
  optionsElement.innerHTML = "";
  options.forEach((element) => {
    const button = document.createElement("button");
    button.innerHTML = element;
    button.classList.add(
      "p-2",
      "border-2",
      "border-black",
      "rounded",
      "font-semibold",
      "hover:bg-black",
      "hover:text-white"
    );
    button.onclick = (e) => handleAnswer(e);
    optionsElement.appendChild(button);
  });
  timerCountDown();
}

function handleAnswer(selectedAnswer) {
  clearTimeout(interval);
  if (selectedAnswer) {
    if (selectedAnswer.target.innerHTML == currentQuestion.correctAnswer) {
      score++;
    } else {
      selectedAnswer.target.classList.add("bg-red-300");
    }
  } else {
    const timeUpMsg = document.createElement("div");
    timeUpMsg.innerHTML = `"OOps TimeUp!"`;
    timeUpMsg.classList.add(
      "text-center",
      "font-bold",
      "text-red-700",
      "text-xl"
    );
    optionsElement.appendChild(timeUpMsg);
  }

  const optionButtons = optionsElement.querySelectorAll("button");
  optionButtons.forEach(function (item) {
    item.disabled = true;
    item.classList.add("opacity-50", "cursor-not-allowed");
    item.classList.remove("hover:bg-black", "hover:text-white");
    if (item.innerHTML == currentQuestion.correctAnswer) {
      item.classList.remove("opacity-50");
      item.classList.add("bg-green-300", "opacity-80");
    }
    nextBtn.classList.remove("hidden");
  });
}

function handleNext() {
  if (currentQuestionIndex < Questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
    nextBtn.classList.add("hidden");
  } else {
    console.log("Question over");
    const mainContent = document.getElementById("main-content");
    const finalPage = document.getElementById("final-page");
    const scoreElement = document.getElementById("score");
    scoreElement.innerHTML = score;
    mainContent.classList.add("hidden");
    finalPage.classList.remove("hidden");
    finalPage.classList.add("flex");
  }
}

function handleReplay() {
  score = 0;
  currentQuestionIndex = 0;
  loadData();
  const mainContent = document.getElementById("main-content");
  const finalPage = document.getElementById("final-page");
  const nextBtn = document.getElementById("next");
  mainContent.classList.remove("hidden");
  finalPage.classList.add("hidden");
  finalPage.classList.remove("flex");
  nextBtn.classList.add("hidden");

  const start = document.getElementById("start");
  console.log("start");
  const Container = document.getElementById("container");
  start.classList.remove("hidden");
  Container.classList.add("opacity-30", "cursor-not-allowed");
}

loadData();

function timerCountDown() {
  let countDown = 10;
  //   console.log(timer);

  interval = setInterval(function () {
    timer.innerHTML = countDown;
    countDown--;
    if (countDown < 1) {
      timer.innerHTML = countDown--;
      clearTimeout(interval);
      handleAnswer();
    }
  }, 1000);
}
