const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.getElementById("add-todo-btn");
const todoList = document.getElementById("todo-list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    const todoItem = document.createElement("li");
    todoItem.className = "todo-item";

    const todoText = document.createElement("span");
    todoText.className = "todo-text" + (todo.completed ? " completed" : "");
    todoText.textContent = todo.text;

    const todoActions = document.createElement("div");
    todoActions.className = "todo-actions";

    const completeBtn = document.createElement("button");
    completeBtn.className = "btn btn-complete";
    completeBtn.textContent = todo.completed ? "Undo" : "Complete";
    completeBtn.addEventListener("click", () => toggleComplete(index));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTodo(index));

    todoActions.appendChild(completeBtn);
    todoActions.appendChild(deleteBtn);

    todoItem.appendChild(todoText);
    todoItem.appendChild(todoActions);

    todoList.appendChild(todoItem);
  });
}

function addTodo() {
  const text = todoInput.value.trim();

  if (text) {
    todos.push({
      text,
      completed: false,
    });

    todoInput.value = "";
    saveTodos();
    renderTodos();
  }
}

function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

addTodoBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

renderTodos();
