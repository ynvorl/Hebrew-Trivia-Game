const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDuration = document.querySelector("#timer-duration");
const resultContainer = document.querySelector(".result-container");

const QUIZ_TIME_LIMIT = 20;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let currentQuestion = null;
const questionIndexHistory = [];
let questionCounter = 0;
let correctAnswersCounter = 0;
let mouseX = 0;
let mouseY = 0;

function coordinate(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

const showQuizResult = () => {
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";

  document.querySelector(
    "#result-message"
  ).innerHTML = `הצלחת לענות על <b>${correctAnswersCounter}</b> מתוך <b>30</b> שאלות נכונות!`;
};

const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timerDuration.textContent = `${currentTime} שניות`;
};

const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDuration.textContent = `${currentTime} שניות`;

    if (currentTime <= 0) {
      clearInterval(timer);
      highlightCorrectAnswer();

      answerOptions
        .querySelectorAll(".answer-option")
        .forEach((option) => (option.style.pointerEvents = "none"));

      nextQuestionBtn.style.visibility = "visible";
    }
  }, 1000);
};

const getRandomQuestion = () => {
  if (questionIndexHistory.length >= questions.length) {
    return showQuizResult();
  }
  const availableQuestions = questions.filter(
    (_, index) => !questionIndexHistory.includes(index)
  );
  const randomQuestion =
    availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

  questionIndexHistory.push(questions.indexOf(randomQuestion));
  return randomQuestion;
};

const highlightCorrectAnswer = () => {
  const correctOption =
    answerOptions.querySelectorAll(".answer-option")[
      currentQuestion.correctAnswer
    ];

  correctOption.classList.add("correct");

  const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;
  correctOption.insertAdjacentHTML("beforeend", iconHTML);
};

const correctAnswerEffect = () => {
  correctAnswersCounter++;

  confetti({
    startVelocity: 23,
    spread: 120,
    origin: {
      x: mouseX / window.innerWidth,
      y: mouseY / window.innerHeight,
    },
  });
};

const handleAnswer = (option, answerIndex) => {
  clearInterval(timer);

  const isCorrect = currentQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "wrong");

  !isCorrect ? highlightCorrectAnswer() : correctAnswerEffect();

  const iconHTML = `<span class="material-symbols-rounded">${
    isCorrect ? "check_circle" : "cancel"
  }</span>`;
  option.insertAdjacentHTML("beforeend", iconHTML);

  answerOptions
    .querySelectorAll(".answer-option")
    .forEach((option) => (option.style.pointerEvents = "none"));

  nextQuestionBtn.style.visibility = "visible";
};

const renderQuestion = () => {
  questionCounter++;
  currentQuestion = getRandomQuestion();
  if (!currentQuestion) return;

  resetTimer();
  startTimer();

  // Update UI
  answerOptions.innerHTML = "";
  nextQuestionBtn.style.visibility = "hidden";
  document.querySelector(".quiz-question").textContent =
    currentQuestion.question;
  questionStatus.innerHTML = `שאלה <b>${questionCounter}</b> מתוך <b>30</b> שאלות`;

  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerOptions.appendChild(li);

    li.addEventListener("click", () => handleAnswer(li, index));
  });
};

const resetQuiz = () => {
  resetTimer();
  questionCounter = 0;
  correctAnswersCounter = 0;
  questionIndexHistory.length = 0;

  quizContainer.style.display = "block";
  resultContainer.style.display = "none";

  renderQuestion();
};

renderQuestion();

nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
