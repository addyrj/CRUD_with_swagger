const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

module.exports = {

    //Adding Active & InACTIVE users


    addUser: async function (req, res) {
        const query = ({$or: [{ email: req.body.email},{userName: req.body.userName}] })
        const document = await userModel.findOne(query);

        if(!req.body.email && !req.body.userName) {
            return res.status(404).json({status: false, msg: "email & mobile Number not define"})
        }
        else if(document !=null && (document.email == req.body.email)) {
            return res.status(400).json({status: false, msg: "email already exists"});
        } 
        else if(document != null && (document.userName == req.body.userName)) {
            return res.status(400).json({status: false, msg: "mobile number is already exists."})
        }
        else {
           
            var userVariable = {

                "userName": req.body.userName,
                "email" : req.body.email,
                "address" : req.body.address
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
//edit user details .....................................................................................
    edit: async function (req, res) {
        try {
            console.log("working ")
            var userVariable = {
                userName: req.body.userName,
            }

            var getUser = await userModel.findOne({ _id: mongoose.Types.ObjectId(req.body.userId) }).exec();
            console.log(getUser, "getUser");
            if (getUser != null) {

                var editUserData = await userModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.userId) }, userVariable, { new: true });
                res.status(200).json({ status: 'success', message: 'User data updated Successfully', data: editUserData });
            }
            else {
                return res.send({ status: 'error', message: "User data not found", data: [] });
            }
        } catch (error) {
            return res.status(500).json({ status: "error", msg: 'Something Went Wrong', data: null });
        }
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
                userName: result.userName,
              },
              "secretKey",
              { expiresIn: "1h" }
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
  },
  // API for ForgotPassword
    forgotPassword: (req, res) => {
        try {
            
            const query = { $and: [{ email: req.body.email },{ status: { $ne: "DELETE" } }] }
            userModel.findOne(query, (error, result) => {
                console.log("result", result)
                if (error) {
                    return res.send({ responseCode: 500, responseMessage: "Internal server error.", responseResult: error });
                }
                else if (!result) {

                    return res.send({ responseCode: 409, responseMessage: "Email or mobileNumber not found", responseResult: [] });
                }
                else {
                    var fullName = `${req.body.firstName} ${req.body.lastName}`;
                    req.body.otp = commonFunction.getOtp();
                    req.body.otpTime = new Date().getTime();

                    commonFunction.sendEmail(req.body.email, fullName, req.body.otp, (emailErr, emailRes) => {
                        if (emailErr) {
                            return res.send({ responseCode: 500, responseMessage: "Internal server error.", responseResult: emailErr });
                        } else {
                            console.log(result._id);
                            userModel.findByIdAndUpdate({ _id: result._id }, { $set: { otp: req.body.otp, otpTime: req.body.otpTime } }, (updateErr, updateRes) => {
                                if (updateErr) {
                                    res.send({ responseCode: 500, responseMessage: "intenel error", responseResult: updateErr });
                                }
                                else {
                                    res.send({ responseCode: 200, responseMessage: "resend otp sucess", responseResult: updateRes });
                                }
                            })
                        }
                    })
                }
            })
        } catch (error) {
            return res.send({ responseCode: 501, responseMessage: "Something went wrong!" })
        }
    }

}