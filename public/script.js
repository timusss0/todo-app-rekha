window.dataLayer = window.dataLayer || [];

const todoList = document.getElementById("todoList");

const priorityRank = {
  High: 3,
  Medium: 2,
  Low: 1
};

async function loadTodos() {

  const response = await fetch("/api/todos");
  let todos = await response.json();

  const keyword =
    document.getElementById("searchInput")
      .value
      .toLowerCase();

  const filter =
    document.getElementById("filterPriority").value;

  const sort =
    document.getElementById("sortPriority").value;

  todos = todos.filter(todo =>
    todo.task.toLowerCase().includes(keyword)
  );

  if (filter !== "All") {
    todos = todos.filter(todo =>
      todo.priority === filter
    );
  }

  todos.sort((a, b) => {

    if (sort === "desc") {
      return (
        priorityRank[b.priority] -
        priorityRank[a.priority]
      );
    }

    return (
      priorityRank[a.priority] -
      priorityRank[b.priority]
    );

  });

  todoList.innerHTML = "";

  todos.forEach(todo => {

    const li = document.createElement("li");

    li.innerHTML = `
    <div class="task-info">

      <span class="${todo.completed ? "completed" : ""}">
        ${todo.task}
      </span>

      <span class="priority ${todo.priority.toLowerCase()}">
        ${todo.priority}
      </span>

      <span class="due-date">
        📅 ${todo.dueDate || "-"}
      </span>

    </div>

    <div class="actions">

      <button
        class="done-btn"
        onclick="toggleTodo(${todo.id})">
        ${todo.completed ? "Undo" : "Done"}
      </button>

      <button
        class="edit-btn"
        onclick="editTodo(${todo.id}, '${todo.task}', '${todo.priority}', '${todo.dueDate || ""}')">
        Edit
      </button>

      <button
        class="delete-btn"
        onclick="deleteTodo(${todo.id})">
        Hapus
      </button>

    </div>
    `;

    todoList.appendChild(li);

  });
}

async function addTodo() {

  const task =
    document.getElementById("todoInput")
      .value.trim();

  const priority =
    document.getElementById("priorityInput").value;

  const dueDate =
    document.getElementById("dueDateInput").value;

  if (!task) {
    alert("Tugas tidak boleh kosong!");
    return;
  }

  await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      task,
      priority,
      dueDate
    })
  });

  dataLayer.push({
    event: "add_task",
    task_name: task,
    priority: priority,
    due_date: dueDate
  });

  document.getElementById("todoInput").value = "";
  document.getElementById("dueDateInput").value = "";

  loadTodos();
}

async function toggleTodo(id) {

  await fetch(`/api/todos/${id}`, {
    method: "PUT"
  });

  dataLayer.push({
    event: "complete_task",
    task_id: id
  });

  loadTodos();
}

async function editTodo(
  id,
  currentTask,
  currentPriority,
  currentDueDate
) {

  const task =
    prompt("Edit tugas:", currentTask);

  if (!task) return;

  const priority =
    prompt(
      "Priority (High/Medium/Low)",
      currentPriority
    );

  const dueDate =
    prompt(
      "Due Date (YYYY-MM-DD)",
      currentDueDate
    );

  await fetch(`/api/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      task,
      priority,
      dueDate
    })
  });

  dataLayer.push({
    event: "edit_task",
    task_name: task,
    priority: priority,
    due_date: dueDate
  });

  loadTodos();
}

async function deleteTodo(id) {

  if (!confirm("Hapus tugas ini?")) return;

  await fetch(`/api/todos/${id}`, {
    method: "DELETE"
  });

  dataLayer.push({
    event: "delete_task",
    task_id: id
  });

  loadTodos();
}

document.getElementById("searchInput")
  .addEventListener("input", function () {

    dataLayer.push({
      event: "search_task",
      search_term: this.value
    });

    loadTodos();
  });

document.getElementById("filterPriority")
  .addEventListener("change", function () {

    dataLayer.push({
      event: "filter_priority",
      priority: this.value
    });

    loadTodos();
  });

document.getElementById("sortPriority")
  .addEventListener("change", function () {

    dataLayer.push({
      event: "sort_priority",
      sort_order: this.value
    });

    loadTodos();
  });

loadTodos();
