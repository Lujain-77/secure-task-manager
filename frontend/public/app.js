// The nginx container proxies /api/* to the backend service (see nginx.conf),
// so the frontend never needs to know the backend's hostname/port directly.
const API_BASE = "/api";

const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const list = document.getElementById("task-list");

async function fetchTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  list.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;
    info.appendChild(title);

    if (task.description) {
      const desc = document.createElement("span");
      desc.className = "task-desc";
      desc.textContent = task.description;
      info.appendChild(desc);
    }

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeBtn = document.createElement("button");
    completeBtn.className = "btn-complete";
    completeBtn.textContent = task.completed ? "Undo" : "Done";
    completeBtn.onclick = () => toggleComplete(task);
    actions.appendChild(completeBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(task.id);
    actions.appendChild(deleteBtn);

    li.appendChild(info);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

async function toggleComplete(task) {
  await fetch(`${API_BASE}/tasks/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !task.completed }),
  });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
  fetchTasks();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  if (!title) return;

  await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });

  titleInput.value = "";
  descInput.value = "";
  fetchTasks();
});

fetchTasks();
