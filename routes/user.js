const router=require('express').Router();
const getUserController=require('../controllers/get_userController');
router.get('/',getUserController.get_signUpPage);

module.exports=router