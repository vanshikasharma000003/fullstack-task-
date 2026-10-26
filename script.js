const questions = [
  {
    question: "Which keyword is used to declare a variable that can be reassigned?",
    options: ["const", "let", "static", "define"],
    answer: 1,
    explanation: "Use let when the variable's value may change. A const variable cannot be reassigned."
  },
  {
    question: "What does typeof [] return in JavaScript?",
    options: ["array", "undefined", "object", "list"],
    answer: 2,
    explanation: "In JavaScript, arrays are a type of object, so typeof [] returns \"object\"."
  },
  {
    question: "Which method adds an item to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: 0,
    explanation: "push() adds one or more items to the end of an array."
  },
  {
    question: "Which symbol is used for strict equality?",
    options: ["=", "==", "===", "!="],
    answer: 2,
    explanation: "=== checks both value and type without converting one type into another."
  },
  {
    question: "Which function runs code after a specified delay?",
    options: ["setDelay()", "wait()", "setIntervalOnce()", "setTimeout()"],
    answer: 3,
    explanation: "setTimeout() runs a callback once after the specified delay, measured in milliseconds."
  }
];

const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");
const reviewScreen = document.getElementById("reviewScreen");
const questionCount = document.getElementById("questionCount");
const timerLabel = document.getElementById("timer");
const timerBox = document.querySelector(".timer");
const progressBar = document.getElementById("progressBar");
const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("options");
const liveScore = document.getElementById("liveScore");
const feedback = document.getElementById("feedback");
const feedbackTitle = document.getElementById("feedbackTitle");
const explanation = document.getElementById("explanation");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const finalScore = document.getElementById("finalScore");
const ratingMessage = document.getElementById("ratingMessage");
const reviewBtn = document.getElementById("reviewBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const backBtn = document.getElementById("backBtn");
const reviewList = document.getElementById("reviewList");
const noMistakes = document.getElementById("noMistakes");

let currentIndex = 0;
let score = 0;
let timeLeft = 30;
let timerId = null;
let answered = false;
let wrongAnswers = [];

function startQuiz() {
  clearInterval(timerId);
  currentIndex = 0;
  score = 0;
  timeLeft = 30;
  answered = false;
  wrongAnswers = [];
  liveScore.textContent = score;
  resultScreen.classList.add("hidden");
  reviewScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  renderQuestion();
}

function renderQuestion() {
  clearInterval(timerId);
  answered = false;
  timeLeft = 30;
  const q = questions[currentIndex];

  questionCount.textContent = `Question ${currentIndex + 1}/${questions.length}`;
  progressBar.style.width = `${(currentIndex / questions.length) * 100}%`;
  questionText.textContent = q.question;
  timerLabel.textContent = timeLeft;
  timerBox.classList.remove("urgent");
  feedback.className = "feedback hidden";
  feedbackTitle.textContent = "";
  explanation.textContent = "";
  optionsBox.innerHTML = "";
  nextBtn.disabled = true;
  nextBtn.textContent = currentIndex === questions.length - 1 ? "See results →" : "Next question →";

  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.type = "button";
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(option)}</span>`;
    button.addEventListener("click", () => chooseAnswer(index));
    optionsBox.appendChild(button);
  });

  timerId = setInterval(() => {
    timeLeft--;
    timerLabel.textContent = timeLeft;
    if (timeLeft <= 5) timerBox.classList.add("urgent");
    if (timeLeft <= 0) {
      clearInterval(timerId);
      chooseAnswer(-1);
    }
  }, 1000);
}

function chooseAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  clearInterval(timerId);

  const q = questions[currentIndex];
  const buttons = [...optionsBox.querySelectorAll(".option")];
  const isCorrect = selectedIndex === q.answer;

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === q.answer) button.classList.add("correct");
    if (index === selectedIndex && !isCorrect) button.classList.add("wrong");
  });

  if (isCorrect) {
    score++;
    liveScore.textContent = score;
    feedback.className = "feedback good";
    feedbackTitle.textContent = "Correct answer! 🎉";
  } else {
    feedback.className = "feedback bad";
    feedbackTitle.textContent = selectedIndex === -1 ? "Time's up! ⏰" : "Not quite! Keep learning.";
    wrongAnswers.push({
      question: q.question,
      yourAnswer: selectedIndex === -1 ? "No answer (time ran out)" : q.options[selectedIndex],
      correctAnswer: q.options[q.answer],
      explanation: q.explanation
    });
  }

  explanation.textContent = q.explanation;
  progressBar.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
  nextBtn.disabled = false;
}

function showResults() {
  clearInterval(timerId);
  quizScreen.classList.add("hidden");
  reviewScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  finalScore.textContent = score;

  if (score === questions.length) ratingMessage.textContent = "Perfect score! You're a JavaScript champion.";
  else if (score >= 4) ratingMessage.textContent = "Excellent work! You know your JavaScript well.";
  else if (score >= 3) ratingMessage.textContent = "Good effort! Review a few answers and try again.";
  else ratingMessage.textContent = "Keep practising. Every attempt makes you better!";
}

function showReview() {
  resultScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  reviewScreen.classList.remove("hidden");
  reviewList.innerHTML = "";
  noMistakes.classList.toggle("hidden", wrongAnswers.length > 0);

  wrongAnswers.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "review-item";
    const heading = document.createElement("h3");
    heading.textContent = `${index + 1}. ${item.question}`;
    const your = document.createElement("p");
    your.className = "your-answer";
    your.textContent = `Your answer: ${item.yourAnswer}`;
    const correct = document.createElement("p");
    correct.className = "right-answer";
    correct.textContent = `Correct answer: ${item.correctAnswer}`;
    const explain = document.createElement("p");
    explain.textContent = `Explanation: ${item.explanation}`;
    card.append(heading, your, correct, explain);
    reviewList.appendChild(card);
  });
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

nextBtn.addEventListener("click", () => {
  if (!answered) return;
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    showResults();
  }
});

restartBtn.addEventListener("click", startQuiz);
playAgainBtn.addEventListener("click", startQuiz);
reviewBtn.addEventListener("click", showReview);
backBtn.addEventListener("click", () => {
  reviewScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
});

startQuiz();
