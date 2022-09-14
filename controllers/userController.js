const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

module.exports = {

    //Adding  user // Register


    addUser: async function (req, res) {
        const query = ({$or: [{ email: req.body.email},{mobileNumber: req.body.mobileNumber}] })
        const document = await userModel.findOne(query);

        if(!req.body.email && !req.body.mobileNumber) {
            return res.status(404).json({status: false, msg: "email & mobile Number not define"})
        }
        else if(document !=null && (document.email == req.body.email)) {
            return res.status(400).json({status: false, msg: "email already exists"});
        } 
        else if(document != null && (document.mobileNumber == req.body.mobileNumber)) {
            return res.status(400).json({status: false, msg: "mobile number is already exists."})
        }
        else {
           
            var userVariable = {

                "mobileNumber": req.body.mobileNumber,
                "email" : req.body.email,
                "name" : req.body.name
            }
             if(req.body.password) {
                userVariable.password =  bcrypt.hashSync(req.body.password, salt)
             }

            console.log(userVariable, "userVariable");
            var user = new userModel(userVariable);

            user.save().then(function (doc) {
                 console.log("line no 35",doc);                
                if(doc) {
                    res.status(200).json({status: true, msg: "registration successfully.", data: doc})
                } else {
                    res.status(200).json({status: false, msg: "something went wrong", data: doc})
                }
            }).catch(err => {
                res.status(200).json({ status: false, msg: "Something went wrong", data: null})
            })
        }
    },
    //get User Details..............................................................................................................
    
    userDetail: (req, res) => {
        userModel.find({ status: "ACTIVE" }, (err, result) => {

            if (err) {
                return res.send({ responseCode: 500, responseMessage: "Internal server error." });

            }
            else if (!result) {
                return res.send({ responseCode: 404, responseMessage: "Data not found.", data: [] });
            }
            else {
                return res.send({ responseCode: 200, responseMessage: " User details have been fetched successfully.", responseResult: result });
            }
        })
    },

    // log API using JSON WEB token...........................................................................
    
  login: (req, res) => {
    try {
        console.log("11111")
      const query = {$eq: [{ email: req.body.email }]}
      
      userModel.findOne(query, (error, result) => {
        console.log(result);
        if (error) {
          return res.send({
            status: "error",
            message: "Internal server error.",
            data: error,
          });
        } else if (!result) {
          return res.send({
            status: "error",
            message: " Incorrect email.",
            data: [],
          });
        } else {
          // const password =  bcrypt.hashSync(req.body.password, salt);
          // console.log(req.body.password, password);
          var check = bcrypt.compareSync(req.body.password, result.password);
          //  console.log(result.password, password);
          console.log(check);
          if (check) {
            var token = jwt.sign(
              {
                _id: result._id,
                email: result.email,
                mobileNumber: result.mobileNumber,
              },
              "secretKey",
              { expiresIn: "30d" }
            );
            var data = {
              token: token,
              _id: result._id,
              email: result.email,
            };
            console.log("line no 67", data);
            return res.send({
              status: "success",
              message: "login successfully.",
              data: data,
            });
          } else {
            return res.send({
              status: "error",
              message: "Error inquired during login.",
            });
          }
        }
      });
    } catch (error) {
      return res.send({ status: "error", message: "Something went wrong!" });
    }
  }

    }

