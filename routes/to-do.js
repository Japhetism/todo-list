const express = require('express');
const router = express.Router();
const todo = require('../models/to-do')

router.get('/', (req, res, next) => {
    todo.find((err, docs) => {
        res.send({todos: docs});
    })
    .catch(err => {
        console.log("Something went wrong");
    })
})

router.post('/create', (req, res, next) => {
    const { name, description, startDate, endDate, duration } = req.body
    
    const newTodo = new todo({
        name,
        description,
        startDate,
        endDate,
        duration
    });

    newTodo.save(err => {
        if(err) {
            console.log("Something went wrong");
        }else{
            console.log("Todo saved successfully");
        }
    })
})

module.exports = router