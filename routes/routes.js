const router=require('express').Router();
const userController = require('../controllers/userController');


router.post('/addUser',userController.addUser);
router.get('/userDetail',userController.userDetail);
router.put('/login', userController.login);

module.exports=router;