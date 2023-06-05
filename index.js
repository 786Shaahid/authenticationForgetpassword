const env=require('dotenv').config();
const express=require('express');
const path=require('path');
const ejs=require('ejs');
const cookie=require('cookie')
const session=require('express-session');
const cookieParser=require('cookie-parser');
const passport=require('./config/google-auth');

// mongoose connection
const mongoose=require('./config/mongoose');
const port=  5000 || process.env.PORT_NO ;
const app=express();
// this is for front data
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 2,
      sameSite: 'lax',
       secure: false }
  }))

// set view engine
app.set('view engine','ejs');


// read static file
app.use(express.static(path.join(__dirname,"assets")))
 
// connect routes
app.use('/',require('./routes/router'));

app.listen(port,(err)=>{
    if(err){console.log('Server is not running port',port);}
   return console.log(`Server is Connected successfully!,on port:${port}`);
})