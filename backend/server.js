const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "tasks.json");

const readTasksFromFile = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveTasksToFile = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), "utf8");
};

app.get("/", (req, res) => {
  res.send("Backend çalışıyor");
});

app.get("/api/tasks", (req, res) => {
  const tasks = readTasksFromFile();
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { title, description } = req.body;

if (!title || title.trim() === "") {
  return res.status(400).json({ message: "Görev başlığı zorunlu" });
}

if (title.trim().length < 3) {
  return res.status(400).json({ message: "Görev başlığı en az 3 karakter olmalı" });
}

if (title.trim().length > 60) {
  return res.status(400).json({ message: "Görev başlığı en fazla 60 karakter olabilir" });
}

if (description && description.length > 200) {
  return res.status(400).json({ message: "Açıklama en fazla 200 karakter olabilir" });
}

  const tasks = readTasksFromFile();

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
    title,
    description: description || "",
    completed: false,
    createdAt: new Date().toLocaleString("tr-TR")
  };

  tasks.push(newTask);
  saveTasksToFile(tasks);

  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const tasks = readTasksFromFile();

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ message: "Görev bulunamadı" });
  }

  task.completed = !task.completed;
  saveTasksToFile(tasks);

  res.json(task);
});

app.put("/api/tasks/:id/edit", (req, res) => {
  const taskId = Number(req.params.id);
  const { title, description } = req.body;

  const tasks = readTasksFromFile();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ message: "Görev bulunamadı" });
  }

 if (!title || title.trim() === "") {
  return res.status(400).json({ message: "Görev başlığı zorunlu" });
}

if (title.trim().length < 3) {
  return res.status(400).json({ message: "Görev başlığı en az 3 karakter olmalı" });
}

if (title.trim().length > 60) {
  return res.status(400).json({ message: "Görev başlığı en fazla 60 karakter olabilir" });
}

if (description && description.length > 200) {
  return res.status(400).json({ message: "Açıklama en fazla 200 karakter olabilir" });
}

  task.title = title;
  task.description = description || "";

  saveTasksToFile(tasks);

  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const tasks = readTasksFromFile();

  const filteredTasks = tasks.filter((t) => t.id !== taskId);

  if (filteredTasks.length === tasks.length) {
    return res.status(404).json({ message: "Görev bulunamadı" });
  }

  saveTasksToFile(filteredTasks);

  res.json({ message: "Görev silindi" });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});