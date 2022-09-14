const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/assignment", { useNewUrlParser: true, useUnifiedTopology: true }, (err, result) => {
    if (err) {
        console.log("Database connection failed");
    }
    else {
        console.log("Database connection successful!");
    }
})