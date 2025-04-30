// Object to store user answers (questionId: answer)
let userAnswers = JSON.parse(localStorage.getItem("userAnswers") || "{}");
// Track the highest question ID answered
let lastAnsweredQuestionId = parseInt(
  localStorage.getItem("lastAnsweredQuestionId") || "0"
);

// Function to update quiz-op button states based on last answered question
function updateQuizOpButtons() {
  document.querySelectorAll(".quiz-op").forEach((btn) => {
    const questionId = parseInt(btn.getAttribute("btn_id"));
    if (questionId <= lastAnsweredQuestionId + 1) {
      btn.classList.remove("disabled");
      btn.style.pointerEvents = "auto";
      btn.style.opacity = "1";
    } else {
      btn.classList.add("disabled");
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.5";
    }
  });
}

// Initialize quiz-op buttons and event listeners
document.querySelectorAll(".quiz-op").forEach((btn) => {
  btn.addEventListener("click", () => {
    const questionId = btn.getAttribute("btn_id");
    // Only allow clicking if questionId is accessible
    if (parseInt(questionId) <= lastAnsweredQuestionId + 1) {
      loadQuestion(questionId);
      console.log(questionId);
    }
  });
});

// Function to load a question
function loadQuestion(questionId) {
  fetch(`/quiz/question/${questionId}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("question-text").innerText = data.question;
      document.getElementById("question-image").src = data.image;

      const answersContainer = document.getElementById("answers-container");
      answersContainer.innerHTML = ""; // Clear previous answers
      data.answers.forEach((answer, index) => {
        const div = document.createElement("div");
        div.classList.add("quiz-btn");
        div.classList.add(`quiz-btn-${index + 1}`);
        const requiredAttribute = index === 0 ? "required" : "";
        // Check if this answer was previously selected
        const isChecked =
          userAnswers[questionId] === answer.text ? "checked" : "";
        div.innerHTML = `<label><input type="radio" name="answer" value="${answer.text}" ${requiredAttribute} ${isChecked}> ${answer.text}</label>`;
        answersContainer.appendChild(div);
      });

      // Enable submit button on answer selection
      const radioButtons = document.querySelectorAll('input[name="answer"]');
      radioButtons.forEach((radio) => {
        radio.addEventListener("change", () => {
          document.getElementById("submit-btn").disabled = false;
        });
      });

      // Disable submit button by default, unless an answer is already selected
      document.getElementById("submit-btn").disabled = !userAnswers[questionId];

      document.getElementById("question-number").value = questionId;
    })
    .catch((error) => console.log("Error loading question:", error));
}

// Function to display results on page load
function displayResultsOnLoad() {
  const lastResult = JSON.parse(localStorage.getItem("lastResult") || "{}");
  const penultimateResult = JSON.parse(
    localStorage.getItem("penultimateResult") || "{}"
  );

  // Update last result
  if (lastResult.score !== undefined) {
    document.querySelector(".last-res-right").innerText = lastResult.score;
    document.querySelector(".last-res-all").innerText = lastResult.total;
  } else {
    document.querySelector(".last-res-right").innerText = "0";
    document.querySelector(".last-res-all").innerText = "5";
  }

  // Update penultimate result
  if (penultimateResult.score !== undefined) {
    document.querySelector(".penultimate-res-right").innerText =
      penultimateResult.score;
    document.querySelector(".penultimate-res-all").innerText =
      penultimateResult.total;
  } else {
    document.querySelector(".penultimate-res-right").innerText = "0";
    document.querySelector(".penultimate-res-all").innerText = "5";
  }
}

// Handle form submission
document.getElementById("quiz-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const questionId = parseInt(document.getElementById("question-number").value);
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');

  if (!selectedAnswer) {
    alert("Please select an answer before proceeding!");
    return;
  }

  // Store the answer
  userAnswers[questionId] = selectedAnswer.value;
  localStorage.setItem("userAnswers", JSON.stringify(userAnswers));

  // Update last answered question ID
  if (questionId > lastAnsweredQuestionId) {
    lastAnsweredQuestionId = questionId;
    localStorage.setItem("lastAnsweredQuestionId", lastAnsweredQuestionId);
    updateQuizOpButtons();
  }

  // Send answer to server
  fetch("/quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      questionId,
      answer: selectedAnswer.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.finished) {
        // Save current result as penultimate in localStorage
        const currentResult = JSON.parse(
          localStorage.getItem("lastResult") || "{}"
        );
        if (currentResult.score !== undefined) {
          localStorage.setItem(
            "penultimateResult",
            JSON.stringify({
              score: currentResult.score,
              total: currentResult.total,
              timestamp: currentResult.timestamp || new Date().toISOString(),
            })
          );
        }

        // Save new result as last in localStorage
        localStorage.setItem(
          "lastResult",
          JSON.stringify({
            score: data.score,
            total: data.total,
            timestamp: new Date().toISOString(),
          })
        );

        // Update last result display
        document.querySelector(".last-res-right").innerText = data.score;
        document.querySelector(".last-res-all").innerText = data.total;

        // Update penultimate result display
        const penultimateResult = JSON.parse(
          localStorage.getItem("penultimateResult") || "{}"
        );
        if (penultimateResult.score !== undefined) {
          document.querySelector(".penultimate-res-right").innerText =
            penultimateResult.score;
          document.querySelector(".penultimate-res-all").innerText =
            penultimateResult.total;
        } else {
          document.querySelector(".penultimate-res-right").innerText = "0";
          document.querySelector(".penultimate-res-all").innerText = "5";
        }

        // Reset quiz state
        userAnswers = {};
        localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
        lastAnsweredQuestionId = 0;
        localStorage.setItem("lastAnsweredQuestionId", lastAnsweredQuestionId);
        updateQuizOpButtons();

        alert(`Quiz finished! Your score: ${data.score}/${data.total}`);
        loadQuestion(1); // Return to first question
      } else {
        // Load next question
        const nextQuestionId = questionId + 1;
        loadQuestion(nextQuestionId);
      }
    })
    .catch((error) => console.log("Error submitting answer:", error));
});

// Display results, load first question, and update button states on page load
document.addEventListener("DOMContentLoaded", () => {
  displayResultsOnLoad();
  updateQuizOpButtons();
  loadQuestion(1); // Load first question by default
});
