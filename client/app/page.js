"use client";

import { useEffect, useState } from "react";

async function request(path, options) {
  const res = await fetch(`/api/todos${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [error, setError] = useState("");

  async function run(action) {
    setError("");
    try {
      await action();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  useEffect(() => {
    run(async () => setTodos(await request("")));
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    const added = await run(async () => {
      const todo = await request("", {
        method: "POST",
        body: JSON.stringify({ title: newTitle }),
      });
      setTodos((current) => [...current, todo]);
    });
    if (added) setNewTitle("");
  }

  async function updateTodo(id, changes) {
    return run(async () => {
      const updated = await request(`/${id}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      setTodos((current) => current.map((t) => (t.id === id ? updated : t)));
    });
  }

  async function deleteTodo(id) {
    await run(async () => {
      await request(`/${id}`, { method: "DELETE" });
      setTodos((current) => current.filter((t) => t.id !== id));
    });
  }

  function startEditing(todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  }

  async function saveEdit(e) {
    e.preventDefault();
    const saved = await updateTodo(editingId, { title: editTitle });
    if (saved) setEditingId(null);
  }

  return (
    <main>
      <h1>Todo list</h1>

      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <form onSubmit={saveEdit}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={(e) => updateTodo(todo.id, { done: e.target.checked })}
                />
                <span className={todo.done ? "title done" : "title"}>{todo.title}</span>
                <button onClick={() => startEditing(todo)}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {todos.length === 0 && !error && <p>Nothing here yet.</p>}
    </main>
  );
}
