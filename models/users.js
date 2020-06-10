const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')

const { Schema } = mongoose;

//Set JWT app details
const appInfo = {
    name: 'Todo',
    description: 'To create a list of daily Todo list. Improvements and suggestions are welcome',
    owner: {
        firstName: 'Babatunde',
        lastName: 'Ojo',
        email: 'babatundeojo30@gmail.com',
        phoneNumber: '2347053579784'
    }
}

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    hash: {
        type: String
    },
    salt: {
        type: String
    }
});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
}

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const expiration = new Date(today);
    expiration.setDate(today.getDate() + 1);

    return jwt.sign({
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        email: this.email,
        id: this._id,
        exp: parseInt(expiration.getTime() / 1000, 10),
        app: appInfo
    }, 'secret');
}

UserSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        email: this.email,
        token: this.generateJWT()
    }
}

mongoose.model('users', UserSchema);