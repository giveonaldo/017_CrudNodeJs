require('dotenv').config();
const express = require('express')
const expressLayout = require('express-ejs-layouts')
const app = express()
const db = require("./database/db.js");
const port = process.env.PORT

app.use(expressLayout);
app.use(express.json());
// app.use('/todos', require('./routes/todos.js'))
app.use('/tododb', require('./routes/tododb.js'))
app.set('view engine', 'ejs');

// Routes to HomePage
app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/main',
        title: "HomePage"
    });
});

// Routes to Contact Us
app.get('/contact', (req, res) => {
    res.render('contact',{
        layout: 'layouts/main',
        title: "contact Page"
    });
});

app.get('/todo-view', (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', {
            layout: 'layouts/main',
            todos: todos,
            title: "Todos"
        });
    });
});

// Routes for page not found
app.get("/*",(req, res) => {
    res.status(404).send('404 - Halaman tidak ditemukan.')
})

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
})