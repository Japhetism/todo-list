const mongoose = require('mongoose');
const schema = mongoose.Schema;

let todoSchema = new schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: false
    },
    startDate: {
        type: Date,
        require: true
    },
    endDate: {
        type: Date,
        require: true
    },
    duration: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model('todo', todoSchema);