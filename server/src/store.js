const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

const dataFile = process.env.DATA_FILE || path.join(__dirname, "..", "data", "todos.json");

function load() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

function save() {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  const tmpFile = `${dataFile}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(todos, null, 2));
  fs.renameSync(tmpFile, dataFile);
}

const todos = load();

function list() {
  return todos;
}

function create(title) {
  const todo = {
    id: randomUUID(),
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  save();
  return todo;
}

function update(id, changes) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;
  Object.assign(todo, changes);
  save();
  return todo;
}

function remove(id) {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  save();
  return true;
}

module.exports = { list, create, update, remove };
