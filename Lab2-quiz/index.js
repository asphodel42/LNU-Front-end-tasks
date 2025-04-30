const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();

const host = "localhost";
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

const quizQuestions = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "src/data", "quiz_questions.json"),
    "utf8"
  )
);

let userAnswers = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
  console.log(quizQuestions);
});

app.get(`/quiz/question/:id`, (req, res) => {
  const questionId = parseInt(req.params.id);
  const questionData = quizQuestions[questionId - 1];
  if (questionData) {
    res.json(questionData);
  } else {
    res.status(404).json({ error: "Question not found" });
  }
});

app.post("/quiz", (req, res) => {
  const { questionId, answer } = req.body;

  const question = quizQuestions[questionId - 1];
  const correctAnswer = question.answers.find((ans) => ans.is_correct).text;
  const isCorrect = answer === correctAnswer;

  userAnswers.push({
    questionId,
    answer,
    isCorrect,
  });

  if (questionId >= quizQuestions.length) {
    const score = userAnswers.filter((ans) => ans.isCorrect).length;
    const total = quizQuestions.length;

    // Зберігаємо результат останнього тесту в JSON
    const result = {
      score,
      total,
      timestamp: new Date().toISOString(),
    };
    fs.writeFileSync(
      path.join(__dirname, "src/data", "last_result.json"),
      JSON.stringify(result, null, 2),
      "utf8"
    );

    userAnswers = [];
    res.json({
      finished: true,
      score,
      total,
    });
  } else {
    const nextQuestion = quizQuestions[questionId];
    res.json({
      finished: false,
      nextQuestion,
    });
  }
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
