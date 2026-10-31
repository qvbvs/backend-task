const express = require("express");
const todos = require("./routes");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use("/api/todos", todos);

app.use((req, res) => {
  res.status(404).json({ error: "not found" });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? "internal server error" : err.message });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
