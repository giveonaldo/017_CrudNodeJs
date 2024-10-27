const express = require('express')
const router = express.Router()

const todos = [
    {
        id: 1,
        task: "Belajar ExpressJs",
        completed: true
    },
    {
        id: 2,
        task: "Belajar ReactJs",
        completed: false
    },
    {
        id: 3,
        task: "Implementasi Back-end",
        completed: false
    },
    {
        id: 4,
        task: "Implementasi Front-End",
        completed: true
    },
];

// Get method
router.get('/api', (req, res) => {
    res.json(todos)
});

// Post method
router.post('/api/add', (req, res) => {
    const newTodo = {
        id: todos.length + 1,
        task: req.body.task,
        completed: false
    }
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Delete method
router.delete('/api/delete/:id', (req, res) => {
    const todoIndex = todos.findIndex(i => i.id === parseInt(req.params.id));
    if (todoIndex === 1) {
        return res.status(404).json({message: "Task not found!"});
    }

    const deleteTodo = todos.splice(todoIndex, -1)[0];
    res.status(200).json({message: `Tugas ${deleteTodo.task} telah dihapus`})
});

// Put Method
router.put('/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) {
        return res.status(404).json({message: "Tugas tidak ditemukan"});
    }

    todo.task = req.body.task || todo.task;

    res.status(200).json({
        message: `Tugas dengan ID ${todo.id} telah diperbarui`,
        updatedTodo: todo
    })
})

module.exports = router;