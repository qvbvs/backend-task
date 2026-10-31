const express = require("express");
const store = require("./store");

const MAX_TITLE_LENGTH = 200;

const router = express.Router();

function parseTitle(value) {
  if (typeof value !== "string") return null;
  const title = value.trim();
  if (!title || title.length > MAX_TITLE_LENGTH) return null;
  return title;
}

const invalidTitle = {
  error: `title must be a non-empty string of at most ${MAX_TITLE_LENGTH} characters`,
};

router.get("/", (req, res) => {
  res.json(store.list());
});

router.post("/", (req, res) => {
  const title = parseTitle(req.body?.title);
  if (!title) return res.status(400).json(invalidTitle);

  res.status(201).json(store.create(title));
});

router.patch("/:id", (req, res) => {
  const body = req.body ?? {};
  const changes = {};

  if (body.title !== undefined) {
    const title = parseTitle(body.title);
    if (!title) return res.status(400).json(invalidTitle);
    changes.title = title;
  }

  if (body.done !== undefined) {
    if (typeof body.done !== "boolean") {
      return res.status(400).json({ error: "done must be a boolean" });
    }
    changes.done = body.done;
  }

  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ error: "nothing to update" });
  }

  const todo = store.update(req.params.id, changes);
  if (!todo) return res.status(404).json({ error: "todo not found" });

  res.json(todo);
});

router.delete("/:id", (req, res) => {
  if (!store.remove(req.params.id)) {
    return res.status(404).json({ error: "todo not found" });
  }
  res.status(204).end();
});

module.exports = router;
