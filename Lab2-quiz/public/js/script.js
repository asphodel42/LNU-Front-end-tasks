document.querySelectorAll(".quiz-op").forEach((btn) => {
  btn.addEventListener("click", () => {
    const questionId = btn.getAttribute("btn_id");
    loadQuestion(questionId);
    console.log(questionId);
  });
});

// Функція для завантаження питання
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
        div.innerHTML = `<label><input type="radio" name="answer" value="${answer.text}" ${requiredAttribute}> ${answer.text}</label>`;
        answersContainer.appendChild(div);
      });

      // Активуємо кнопку при виборі відповіді
      const radioButtons = document.querySelectorAll('input[name="answer"]');
      radioButtons.forEach((radio) => {
        radio.addEventListener("change", () => {
          document.getElementById("submit-btn").disabled = false;
        });
      });

      // Скидаємо кнопку до неактивного стану при завантаженні нового питання
      document.getElementById("submit-btn").disabled = true;

      document.getElementById("question-number").value = questionId;
    })
    .catch((error) => console.log("Error loading question:", error));
}

// Функція для відображення результатів при завантаженні сторінки
function displayResultsOnLoad() {
  const lastResult = JSON.parse(localStorage.getItem("lastResult") || "{}");
  const penultimateResult = JSON.parse(
    localStorage.getItem("penultimateResult") || "{}"
  );

  // Оновлюємо останній результат
  if (lastResult.score !== undefined) {
    document.querySelector(".last-res-right").innerText = lastResult.score;
    document.querySelector(".last-res-all").innerText = lastResult.total;
  } else {
    document.querySelector(".last-res-right").innerText = "0";
    document.querySelector(".last-res-all").innerText = "5";
  }

  // Оновлюємо передостанній результат
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

// Обробка відправки форми
document.getElementById("quiz-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const questionId = parseInt(document.getElementById("question-number").value);
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');

  if (!selectedAnswer) {
    alert("Please select an answer before proceeding!");
    return;
  }

  // Надсилаємо відповідь на сервер
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
        // Зберігаємо поточний результат як передостанній у localStorage
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

        // Зберігаємо новий результат як останній у localStorage
        localStorage.setItem(
          "lastResult",
          JSON.stringify({
            score: data.score,
            total: data.total,
            timestamp: new Date().toISOString(),
          })
        );

        // Оновлюємо відображення останнього результату
        document.querySelector(".last-res-right").innerText = data.score;
        document.querySelector(".last-res-all").innerText = data.total;

        // Оновлюємо відображення передостаннього результату
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

        alert(`Quiz finished! Your score: ${data.score}/${data.total}`);
        loadQuestion(1); // Повертаємося до першого питання
      } else {
        // Завантажуємо наступне питання
        const nextQuestionId = questionId + 1;
        loadQuestion(nextQuestionId);
      }
    })
    .catch((error) => console.log("Error submitting answer:", error));
});

// Викликаємо функцію для відображення результатів при завантаженні сторінки
document.addEventListener("DOMContentLoaded", () => {
  displayResultsOnLoad();
  loadQuestion(1); // Завантажуємо перше питання за замовчуванням
});
