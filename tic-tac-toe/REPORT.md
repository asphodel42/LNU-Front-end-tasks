# Звіт з лабораторної роботи: Розробка гри "Хрестики-нулики" на React

## Реалізація структури проекту

Проект реалізовано відповідно до заданої структури:

```
tic-tac-toe/
├── src/
│   ├── components/
│   │   ├── Game.jsx    # Головний компонент гри
│   │   ├── Board.jsx   # Компонент ігрового поля
│   │   └── Square.jsx  # Компонент окремої клітинки
│   ├── styles/
│   │   ├── Game.css    # Стилі для Game
│   │   ├── Board.css   # Стилі для Board
│   │   └── Square.css  # Стилі для Square
│   ├── App.jsx         # Основний файл застосунку
│   ├── App.css         # Стилі для App
│   ├── index.js        # Точка входу
│   └── index.css       # Глобальні стилі
└── public/
    └── index.html      # HTML шаблон
```

## Етапи реалізації

### 1. Створення компоненту Square

```jsx
// src/components/Square.jsx
import React from "react";
import "../styles/Square.css";

const Square = ({ value, onClick, isWinningSquare }) => {
  return (
    <button
      className={`square ${isWinningSquare ? "winning" : ""}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
```

Компонент Square відповідає за відображення окремої клітинки ігрового поля. Він приймає:

- `value` - значення клітинки (X, O або null)
- `onClick` - функцію для обробки кліку
- `isWinningSquare` - прапор, що вказує, чи є клітинка частиною виграшної комбінації

### 2. Створення компоненту Board

```jsx
// src/components/Board.jsx
import React from "react";
import Square from "./Square";
import "../styles/Board.css";

const Board = ({ squares, onClick, winningLine }) => {
  const renderSquare = (i) => {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        isWinningSquare={winningLine && winningLine.includes(i)}
      />
    );
  };

  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < 3; row++) {
      const currentRow = [];
      for (let col = 0; col < 3; col++) {
        const squareIndex = row * 3 + col;
        currentRow.push(renderSquare(squareIndex));
      }
      board.push(
        <div key={row} className="board-row">
          {currentRow}
        </div>
      );
    }
    return board;
  };

  return <div className="board">{renderBoard()}</div>;
};

export default Board;
```

Компонент Board відповідає за відображення ігрового поля 3х3. Він:

- Приймає масив `squares` зі станом кожної клітинки
- Передає функцію `onClick` для обробки кліків
- Позначає виграшні клітинки на основі `winningLine`
- Генерує ігрове поле через вкладені цикли

### 3. Створення головного компоненту Game

```jsx
// src/components/Game.jsx (фрагмент)
import React, { useState, useEffect } from "react";
import Board from "./Board";
import "../styles/Game.css";

const Game = () => {
  // Ініціалізація стану гри
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentStep, setCurrentStep] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [stats, setStats] = useState({
    xWins: 0,
    oWins: 0,
    draws: 0,
  });
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState(null);

  // Поточні клітинки на основі історії
  const current = history[currentStep];
  const winner = calculateWinner(current);

  // Завантаження статистики з localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem("ticTacToeStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Збереження статистики в localStorage
  useEffect(() => {
    localStorage.setItem("ticTacToeStats", JSON.stringify(stats));
  }, [stats]);

  // ... (решта коду)
```

Компонент Game відповідає за:

- Управління станом гри (історія ходів, поточний гравець, переможець, тощо)
- Обробку ходів гравців
- Перевірку на виграш або нічию
- Збереження статистики в localStorage
- Відображення інформації про гру та статистики

### 4. Функція перевірки переможця

```jsx
// src/components/Game.jsx (calculateWinner)
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // верхній рядок
    [3, 4, 5], // середній рядок
    [6, 7, 8], // нижній рядок
    [0, 3, 6], // лівий стовпець
    [1, 4, 7], // середній стовпець
    [2, 5, 8], // правий стовпець
    [0, 4, 8], // діагональ згори-зліва
    [2, 4, 6], // діагональ згори-справа
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
      };
    }
  }

  return null;
}
```

Функція перевіряє всі можливі виграшні комбінації та повертає переможця і виграшну лінію.

## Особливості реалізації

### Стилізація та анімації

В проекті використано CSS для стилізації компонентів та анімації:

```css
/* src/styles/Square.css (фрагмент) */
.winning {
  background-color: #dff2bf;
  color: #4f8a10;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
```

Для виграшних клітинок додано анімацію пульсації, що робить інтерфейс більш інтерактивним.

### Збереження статистики

В проекті реалізовано збереження статистики ігор в localStorage:

```jsx
// Завантаження статистики з localStorage
useEffect(() => {
  const savedStats = localStorage.getItem("ticTacToeStats");
  if (savedStats) {
    setStats(JSON.parse(savedStats));
  }
}, []);

// Збереження статистики в localStorage
useEffect(() => {
  localStorage.setItem("ticTacToeStats", JSON.stringify(stats));
}, [stats]);
```

Це дозволяє зберігати статистику перемог і нічиїх між сесіями користувача.

## Висновки

В рамках проекту було реалізовано гру "Хрестики-нулики" з використанням React. Завдяки компонентному підходу, код вийшов модульним та легко розширюваним.

Було застосовано такі концепції React:

1. Компонентна архітектура
2. Props для передачі даних між компонентами
3. Управління станом через `useState`
4. Побічні ефекти через `useEffect`
5. Умовний рендеринг для відображення різних станів гри
6. Локальне сховище для збереження даних

Додатково реалізовано:

- Виділення виграшної комбінації
- Анімацію для виграшних клітинок
- Відстеження та збереження статистики ігор
