const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const cookie=require('cookie');
const passport = require("passport");
const nodemailer = require("nodemailer");

// sending mail to reset the password
async function sendMailForResetPassword(name, email, token) {
  const transporter = await nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: process.env.USER_EMAIL_ID, 
      pass: process.env.USER_PASSWORD, 
    },
  });

  const mailOption={
    from: process.env.USER_EMAIL_ID, // sender address
    to: email,
    subject: "Reset Your Password", // Subject line
    html: `<pre> <b>hii ${name},<br><br> We received a request to reset the password for your account.<br><br> To reset your password, click on the button below:<br><button><a href=http://localhost:5000/reset-password?${token}>Reset Password</a></button></b></pre>`, // html body
  }
  // send mail
   transporter.sendMail(mailOption,(err,data)=>{
    if(err) {
      console.log('Error in sending mail',err);
      return false;
    }else{
      console.log("Email sended",data);
    }
  });
}

// sign up
module.exports.post_signUp = async (req, res) => {
  // hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  try {
    // check  email exits or not
    if (req.body.password === req.body.confirmPassword) {
      const email = await User.findOne({ email: req.body.email });
      if (email) {
        return res.status(400).json({message:"Email Already Exits , Please Go for Sign In"});
      }
      const db = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
      });
      await db.save();
      return res.status(200).render("sign_in_page", {
        title: "Sign In",
      });
    } else {
      return res.status(400).send("Mismatch password and confirm password..!")
     
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      error: err,
    });
  }
};
// sign in
module.exports.post_signIn = async (req, res) => {
  // check  email exits or not
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req;
    return res.status(400).json({
      status: false,
      message: "This user doesn't exits ,Please go for Sign Up!",
    });
  }
  // compare the password to database
  const password = await bcrypt.compare(req.body.password, user.password); // boolean value ke liye always is lagate hai jai se ki isValid /isValidPassword
  if (!password) {
    return res.status(400).json({
      status: false,
      message: "Incorrect Password,Please Enter Correct Password..!",
    });
  }
  // create token
  const token = await jwt.sign({ payLoad: user._id }, process.env.SECRETE_KEY);
  user.token = token;
  await user.save();
  // set token in cookie
  const expirationDate = new Date();
  res.cookie("token", token, {
    maxAge: 2 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  });

  // if user then go for home page
  if (user && password) {
  return  res.status(200).redirect('/home');
  }
};

// sign-out
module.exports.sign_out = async (req, res) => {
  const token = req.cookies.token;
  res.clearCookie('token');
  res.clearCookie('auth');
  req.session.destroy(function (err) {
    res.send(err); //Inside a callback… bulletproof!
});
    
  return res.status(200).redirect("/sign-in");
};

// veryfi token
module.exports.verify_token = async (req, res, next) => {
  const token = req.cookies.token;
  const user = await jwt.verify(token, process.env.SECRETE_KEY);
  return next();
};
// forget password
module.exports.forget_password = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    // sending the mail ussing  nodemailer
    if (user) {
      sendMailForResetPassword(user.name, user.email, user.token);
      return res.status(200).json({
        status: true,
        message: "A mail successfully sended to your registered email,Please check",
      });
    } else {
      return res.status(400).send({
        success: true,
        message: "This email is not registered !",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      error: err,
    });
  }
};
// reset password
module.exports.reset_password = async (req, res) => {
  try {
    let token = req.cookies.token;
    console.log(token);
    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(req.body.password,salt);
    if(req.body.password===req.body.confirmPassword){
      const user= await User.findOneAndUpdate({token:token},{$set:{
          password:hashPassword, 
          token:''
        }});
        return res.status(200).redirect("/sign-in");
    }else{
      return res.status(400).send(" Password And Confirm Password doesn't match...!")
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};
