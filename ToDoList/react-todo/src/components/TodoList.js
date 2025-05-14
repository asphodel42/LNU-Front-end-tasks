import React from "react";
import TodoItem from "./TodoItem";

const TodoList = ({ todos, onToggleComplete, onDelete }) => {
  if (todos.length === 0) {
    return <p>No tasks yet. Add a task to get started.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
