# Tic-Tac-Toe React Game

A simple Tic-Tac-Toe game built with React that demonstrates fundamental React concepts.

## Features

- Play Tic-Tac-Toe against another player
- Visual indication of winning squares
- Game state management with React hooks
- Statistics tracking using localStorage
- Responsive design

## Project Structure

```
tic-tac-toe/
├── src/
│   ├── components/
│   │   ├── Game.jsx    # Main game component with game logic
│   │   ├── Board.jsx   # Game board component
│   │   └── Square.jsx  # Individual square component
│   ├── styles/
│   │   ├── Game.css    # Styles for Game component
│   │   ├── Board.css   # Styles for Board component
│   │   └── Square.css  # Styles for Square component
│   ├── App.jsx         # Main application component
│   ├── App.css         # Styles for App component
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
└── public/
    └── index.html      # HTML template
```

## React Concepts Demonstrated

1. **Component-based architecture**: Breaking UI into reusable components
2. **Props**: Passing data between components
3. **State management**: Using `useState` hook to manage game state
4. **Side effects**: Using `useEffect` hook for localStorage operations
5. **Event handling**: Responding to user interactions
6. **Conditional rendering**: Displaying different content based on game state

## How to Run

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view the game in your browser
