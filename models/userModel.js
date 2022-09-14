var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userKey = new schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required: [true, "please enter a valid password"],
        minLength: [8, "password should be greater than 8 character"]
    },
    mobileNumber:{
        type: String,
        required: [true, "please enter a valid mobileNumber"],
        minLength: [10, "mobileNumber should be  10 character"]
    },
   status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE", "DELETE"],
        default: "ACTIVE"
    },     
   role: {
        type: String,
        enum: ["ADMIN", "MEMBER", "TRAINER"],
        default: "ADMIN"
    },     
},
    {
        timeStamps: true
    })
     

module.exports = mongoose.model("User", userKey)