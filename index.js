require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const app = express();
const db = require("./database/db.js");
const port = process.env.PORT;

const session = require(`express-session`);
const authRoutes = require("./routes/authRoutes");
const { isAuthenticated } = require("./middlewares/middleware.js");

app.use(expressLayout);
app.use(express.json());
// app.use('/todos', require('./routes/todos.js'))
app.use("/tododb", require("./routes/tododb.js"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'hello',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set ke true jika menggunakan HTTPS
  })
);

app.use("/", authRoutes);

// Routes to HomePage
app.get("/", isAuthenticated, (req, res) => {
  res.render("index", {
    layout: "layouts/main",
    title: "HomePage",
    auth: isAuthenticated
  });
});

// Routes to Contact Us
app.get("/contact", isAuthenticated, (req, res) => {
  res.render("contact", {
    layout: "layouts/main",
    title: "contact Page",
    auth: isAuthenticated
  });
});

app.get("/todo-view", isAuthenticated, (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.render("todo", {
      layout: "layouts/main",
      todos: todos,
      title: "Todos",
      auth: isAuthenticated
    });
  });
});

// Routes for page not found
app.get("/*", (req, res) => {
  res.status(404).send("404 - Halaman tidak ditemukan.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
