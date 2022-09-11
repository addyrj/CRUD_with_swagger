const express =require("express");
const app = express();

const router=require('./routes/routes');
var db = require('./Connectivity/dbConnectivity');

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express');
const { schema } = require("./models/userModel");

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const options = {
    definition:{
        openapi : '3.0.0',
        info : {
            title: 'Node js api project for mongodb ',
            version:'1.0.0'
        },
        servers:[
            {
               url: 'http:/localhost:4000/'
            }
        ]
    },
    apis: ['./index.js']
}
const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 @swagger
 * /:
 *    get:
 *     summary: This api is used to check get method is working or not
 *     description: hi This is responce
 *     responses:
 *        200:
 *             description: To test Get method
 */

app.get('/',(req,res)  => 
 {
    return res.send({reponseCode:200,reponseMessage:"Ok It's working"})
})

// ====================================schema=================================================
/**
 * @swagger
 *  components:
 *     schema:
 *        userDetail:
 *              type: object
 *              properties:
 *                _id:
 *                   type: string
 *                userName:
 *                   type: string
 *                email:
 *                   type: string
 *                password: 
 *                   type: string
 *                address:
 *                   type: string
 *           
 * 
 */

// =================================================get User =======================================================
/** 
 @swagger
 * /userDetail:
 *    get:
 *     summary: This api is used to check get method is working or not
 *     description:  This api is use to fatch user details of all users
 *     responses:
 *        200:
 *             description: To test Get method
 *             content:
 *               application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                          $ref: "#components/schema/userDetail"
 */
// ========================================add user post================================================ 
/**
 @swagger
 * userDetail/addUser:
 *    post:
 *     summary: This is User Registration Method in mongoDB data base 
 *     description: This api fatch data from MongoDB
 *     requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                     schema:
 *     responses:
 *         200:
 *             description: User register successfully
 *             content:
 *                  application/json:
 * 
 */

// =========================================edit =put=================================================================

/**
 @swagger
 * /edit:
 *    put:
 *     summary: This api is used to check get method is working or not
 *     description: hi This is responce
 *     responses:
 *        200:
 *             description: To test Get method
 */
/**
 @swagger
 * /login:
 *    put:
 *     summary: This api is used to check get method is working or not
 *     description: hi This is responce
 *     responses:
 *        200:
 *             description: To test Get method
 */

app.use('',router);

app.listen(4000, (err, result) => {
    if (err) {
        console.log("server error", err)
    }
    else {
        console.log(`Server is started at ${4000}`);
    }
})