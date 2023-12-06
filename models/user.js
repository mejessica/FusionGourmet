var passportLocalMongoose = require("passport-local-mongoose")
const {mongoose} = require('../db')

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        unique: true,
    },
    name:{
        type: String,
        required:true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)