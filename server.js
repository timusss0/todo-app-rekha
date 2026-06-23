const express = require("express");
const path = require("path");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static("public"));

app.use(express.static(path.join(__dirname, "public")));

let todos = [];

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const newTodo = {
    id: Date.now(),
    task: req.body.task,
    priority: req.body.priority || "Medium",
    dueDate: req.body.dueDate || "",
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);

  todos = todos.map(todo =>
    todo.id === id
      ? { ...todo, completed: !todo.completed }
      : todo
  );

  res.json({ message: "updated" });
});

app.patch("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);

  const {
    task,
    priority,
    dueDate
  } = req.body;

  todos = todos.map(todo =>
    todo.id === id
      ? {
          ...todo,
          task: task || todo.task,
          priority: priority || todo.priority,
          dueDate: dueDate || todo.dueDate
        }
      : todo
  );

  res.json({ message: "edited" });
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);

  todos = todos.filter(todo => todo.id !== id);

  res.json({ message: "deleted" });
});

// 3. Modifikasi bagian app.listen agar tidak mengganggu sistem serverless Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// 4. WAJIB: Export module app di bagian paling bawah
module.exports = app;
