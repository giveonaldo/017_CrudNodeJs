const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use('/todos', require('./routes/todos.js'))
app.set('view engine', 'ejs');

// Routes to HomePage
app.get('/', (req, res) => {
    res.render('index');
});

// Routes to Contact Us
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Routes for page not found
app.get("/*",(req, res) => {
    res.status(404).send('404 - Halaman tidak ditemukan.')
})

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
})