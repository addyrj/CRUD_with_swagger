const express =require("express");
const app = express();

const router=require('./routes/routes');
var db = require('./Connectivity/dbConnectivity');


app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.get('/',(req,res)  => 
 {
    return res.send({reponseCode:200,reponseMessage:"Ok It's working"})
})



app.use('',router);

app.listen(4000, (err, result) => {
    if (err) {
        console.log("server error", err)
    }
    else {
        console.log(`Server is started at ${4000}`);
    }
})