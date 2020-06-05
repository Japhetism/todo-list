const express = require('express');
const router = express.Router();
const todo = require('../models/to-do')

//ROUTE TO GET ALL TODO DATA FROM THE DATABASE
router.get('/', (req, res, next) => {
    todo.find((err, docs) => {
        res.send({todos: docs});
    })
    .catch(err => {
        next("Something went wrong")
        console.log("Something went wrong");
    })
})

//ROUTE TO ADD A TODO DATA TO THE DATABASE
router.post('/create', (req, res, next) => {
    const { name, description, startDate, endDate, duration } = req.body
    
    const newTodo = new todo({ name, description, startDate, endDate, duration});

    newTodo.save(err => {
        if(err) {
            console.log("Something went wrong");
        }else{
            console.log("Todo saved successfully");
        }
    })
})

//ROUTE TO GET TODO DATA FROM THE DATABASE
router.get('/:id', (req, res, next) => {
    todo.findById((req.params.id), (err, docs) => {
        if(err) {
            const err = new Error("Unable to retrieve data")
            err.status = 400
            next(err)
            console.log("can't retrieve data beacuse of some database problem")
        }else{
            res.send({todo: docs})
        }
    })
})

//ROUTE TO UPDATE TODO DATA IN THE DATABASE
router.put('/:id', (req, res, next) => {
    todo.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, (err, docs) => {
        if(err) {
            console.log("can't update data beacuse of some database problem")
        }else{
            res.send({todo: docs})
        }
    })
})


//ROUTE TO DELETE TODO DATA FROM THE DATABASE
router.delete('/:id', (req, res, next) => {
    todo.findByIdAndDelete({_id: req.params.id}, (err, docs) => {
        if(err) {
            console.log("Something went wrog to delete date")
        }else{
            console.log("Deleted successfully")
        }
    })
})

module.exports = router