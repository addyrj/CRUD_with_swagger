const router=require('express').Router();
const userController = require('../controllers/userController');




router.post('/addUser',userController.addUser);
router.get('/userDetail',userController.userDetail);
router.put('/edit',userController.edit);
router.put('/login', userController.login);
router.put('/forgotPassword', userController.forgotPassword);

module.exports=router;