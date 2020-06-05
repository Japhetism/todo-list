const mongoose = require('mongoose');
const schema = mongoose.Schema;

let userSchema = new schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: false
    },
    email: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('user', userSchema);