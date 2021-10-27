const express = require("express");
const server = express();
server.use(express.json());

const projects = [];

let numberOfReqs = 0;

// middleware global
server.use((req, res, next) => {
  numberOfReqs++;
  console.log(`Numero de requisicoes: ${numberOfReqs}`);
  return next();
});

// middleware local
function checkProjectIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find((project) => project.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  req.index = projects.findIndex((project) => project.id == id);
  return next();
}

// Adicionar Projeto
server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({ id, title, tasks });

  return res.json({ id, title, tasks });
});

// Adicionar Tarefa em um projeto
server.post("/projects/:id/tasks", checkProjectIdExists, (req, res) => {
  const { title } = req.body;

  projects[req.index].tasks.push(title);

  return res.json(projects[req.index]);
});

// Listar todos os Projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Alterar o titulo dos projetos
server.put("/projects/:id", checkProjectIdExists, (req, res) => {
  const { title } = req.body;

  projects[req.index] = { ...projects[req.index], title };

  return res.json(projects[req.index]);
});

// Deletar um projeto
server.delete("/projects/:id", checkProjectIdExists, (req, res) => {
  projects.splice(req.index, 1);

  return res.json({ msg: `Project removed` });
});

server.listen(3000);
