import React from "react";

const TodoItem = ({ todo, onToggleComplete, onDelete }) => {
  return (
    <li className="todo-item">
      <span className={`todo-text ${todo.completed ? "completed" : ""}`}>
        {todo.text}
      </span>
      <div className="todo-actions">
        <button
          className="btn btn-complete"
          onClick={() => onToggleComplete(todo.id)}
        >
          {todo.completed ? "Undo" : "Complete"}
        </button>
        <button className="btn btn-delete" onClick={() => onDelete(todo.id)}>
          Delete
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
