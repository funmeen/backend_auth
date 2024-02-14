const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true },
    password: {type: String, required: true},
    role: [{type: Number }],
    firstName: String,
    middleName: String,
    lastName: String,
    age: Number
})

module.exports = mongoose.model('User', UserSchema);