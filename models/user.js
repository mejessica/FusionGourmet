var passportLocalMongoose = require("passport-local-mongoose")
const {mongoose} = require('../db')

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email:String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)