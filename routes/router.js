const router=require('express').Router();
const postUserController=require('../controllers/post_userController')
const getUserController=require('../controllers/get_userController');
const passport=require('passport');

router.get('/sign-in',getUserController.get_signInPage);
router.get('/home',postUserController.verify_token,getUserController.get_homePage);
router.get('/sign-out/',postUserController.sign_out);
router.get('/forgetpass',getUserController.forget_password);
router.get('/reset-password',getUserController.reset_password);
 
// router.get('/',getUserController.get_homePage);// for home page
// for google authentication
router.get('/auth/google',passport.authenticate('google',{scope:["profile","email"],session:false}));
router.get('/auth/google/callback',getUserController.google_auth);

router.post('/sign-up',postUserController.post_signUp);
router.post('/sign-in',postUserController.post_signIn);
router.post('/forgetpass',postUserController.forget_password);
router.post('/reset-password/',postUserController.reset_password);
// router.get('/reset-password?token',postUserController.reset_password);

module.exports=router;