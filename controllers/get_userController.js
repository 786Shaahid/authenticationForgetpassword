const User=require('../models/user');
const passport=require('passport');
const jwt=require('jsonwebtoken');
module.exports.get_signUpPage= (req,res)=>{
     return res.status(200).render('sign_up_page',{
          title:"Sign Up"
     });
}
module.exports.get_homePage= (req,res)=>{
     return res.status(200).render('home_page',{
          title:"Home"
     });
}
module.exports.get_signInPage= (req,res)=>{
     // console.log(req.body.email);  
     return res.status(200).render('sign_in_page',{
          title:"Sign In"
     });
}
module.exports.google_auth= (req, res, next) => {
     passport.authenticate("google", {session: false},(err, user, info) => {
         if (err || !user) {
             console.dir(err);
             return res.status(400).json({
               message:"There was an error logging you in. Please try another login method.",
                error:err
             });
         }
         req.login(user, {session: false}, (err) => {
             if (err) {
                 console.dir(err);
                 return res.status(400).json({
                    status:false,
                    message: "Invalid User. Please try another account or register a new account.",
                     error:err
                 }
                     
                 );
             }
             const payload = {
                 sub: user.id,
             };
             const token = jwt.sign(payload, process.env.SECRETE_KEY, {
                 expiresIn: '1h',
             });
             res.clearCookie("auth");
             res.cookie("auth", token);
             res.render('home_page',{
               title:"home"
             });
         });
     })(req, res, next);
}
// isko delete karna hai
module.exports.forget_password= (req,res)=>{
     return res.status(200).render('forget-password',{
          title:'forget password'
     });
}
// isko delete karna hai
module.exports.reset_password= (req,res)=>{
     return res.status(200).render('reset-password',{
          title:'reset password'
     });
}