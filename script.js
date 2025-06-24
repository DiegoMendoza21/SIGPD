let projects = JSON.parse(localStorage.getItem("projects")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || { name: "Invitado", role: "guest" };

const form = document.getElementById('project-form');
const titleInput = document.getElementById('title');
const coordinatorInput = document.getElementById('coordinator');
const objectiveInput = document.getElementById('objective');
const statusInput = document.getElementById('status');
const progressInput = document.getElementById('progress');
const projectList = document.getElementById('project-list');
const activeUserDisplay = document.getElementById('active-user');

function login() {
  const username = document.getElementById('username').value || "Anónimo";
  const role = document.getElementById('role').value;
  currentUser = { name: username, role };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  activeUserDisplay.textContent = username + " (" + role + ")";
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById("logout-btn").classList.remove("hidden");
  if (role === "docente" || role === "admin") {
    form.classList.remove('hidden');
  }
  renderProjects();
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const fileInput = document.getElementById('projectFile');
  const fileName = fileInput && fileInput.files.length > 0 ? fileInput.files[0].name : "Sin documento";

  const newProject = {
    title: titleInput.value,
    coordinator: coordinatorInput.value,
    objective: objectiveInput.value,
    progress: progressInput.value,
    status: statusInput.value,
    state: "Pendiente",
    author: currentUser.name,
    documento: fileName
  };

  if (editingIndex !== null) {
    projects[editingIndex] = newProject;
    editingIndex = null;
    form.querySelector('button').textContent = 'Agregar Proyecto';
  } else {
    projects.push(newProject);
  }

  saveProjects();
  form.reset();
  renderProjects();
});

function renderProjects() {
  projectList.innerHTML = '';
  projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = 'project-card';

    if (project.state === "Aprobado") {
      card.classList.add('status-approved');
    } else if (project.state === "Rechazado") {
      card.classList.add('status-rejected');
    } else {
      card.classList.add('status-pending');
    }

    card.innerHTML = `
      <h2>${project.title}</h2>
      <p><strong>Coordinador:</strong> ${project.coordinator}</p>
      <p><strong>Objetivo:</strong> ${project.objective}</p>
      <p><strong>Avance:</strong> ${project.progress || 0}%</p>
      <p><strong>Estado:</strong> ${project.status}</p>
      <p><strong>Estado de aprobación:</strong> ${project.state}</p>
      <p><strong>Autor:</strong> ${project.author}</p>
      <p><strong>Documento:</strong> ${project.documento}</p>
      <div class="actions">
        ${(currentUser.role === "docente" || currentUser.role === "admin") ?
          `<button onclick="editProject(${index})">Editar</button>
           <button class="delete" onclick="deleteProject(${index})">Eliminar</button>` : ""}
        ${(currentUser.role === "coordinador" || currentUser.role === "admin") ?
          `<button onclick="approveProject(${index})">Aprobar</button>
           <button onclick="rejectProject(${index})">Rechazar</button>` : ""}
      </div>
    `;
    projectList.appendChild(card);
  });
}

function logout() {
  currentUser = { name: "Invitado", role: "guest" };
  localStorage.removeItem("currentUser");
  activeUserDisplay.textContent = "Invitado";
  document.getElementById("login-form").classList.remove("hidden");
  form.classList.add("hidden");
  document.getElementById("logout-btn").classList.add("hidden");
  projectList.innerHTML = '';
}

function editProject(index) {
  const project = projects[index];
  titleInput.value = project.title;
  coordinatorInput.value = project.coordinator;
  objectiveInput.value = project.objective;
  progressInput.value = project.progress;
  statusInput.value = project.status;
  editingIndex = index;
  form.querySelector('button').textContent = 'Actualizar Proyecto';
}

function deleteProject(index) {
  projects.splice(index, 1);
  saveProjects();
  renderProjects();
}

function approveProject(index) {
  projects[index].state = "Aprobado";
  saveProjects();
  renderProjects();
}

function rejectProject(index) {
  projects[index].state = "Rechazado";
  saveProjects();
  renderProjects();
}

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

let editingIndex = null;
renderProjects();
