const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport=require('passport');
const env=require('dotenv').config();

const User=require('../models/user');
const crypto=require('crypto');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const { log } = require('console');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGEL_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
 async function(accessToken, refreshToken, profile, done) {
      const createRandomPass=crypto.randomBytes(10).toString('hex');
      // hashing the password
      const salt=await bcrypt.genSalt(10);
      const hashPassword=await bcrypt.hash(createRandomPass,salt);

      const email= profile.emails[0].value
       const token= await jwt.sign({payLoad:email},process.env.SECRETE_KEY,{expiresIn:"1h"})


      const user= await User.findOne({email:email});
      if(user){
       return done(null,user);
      }else{
   const newUser=  User.create({
             name:profile.displayName,
             email:email,
             password:hashPassword,
             token:token
        });
      
     return done(null,newUser);
      }
}
))

passport.serializeUser=(user,done)=>{
    return done(null,user);
}
passport.deserializeUser= async(data,done )=>{
   User.findById({_id:id},(err,user)=>{
        if(err){console.log('Error in finding the user'); return done(err);}
        return done(null,user);
    })
}
module.exports=passport;