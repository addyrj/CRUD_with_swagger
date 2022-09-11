var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userKey = new schema({
    userName: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    address:{
        type: String,
        required: true
    },
   status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE", "DELETE"],
        default: "ACTIVE"
    },     
},
    {
        timeStamps: true
    })
     

module.exports = mongoose.model("User", userKey)