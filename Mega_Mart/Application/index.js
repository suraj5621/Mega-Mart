const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const seedDB = require('./seed')
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy =  require('passport-local')
const User = require('./models/User')



const productRoutes = require('./routes/product')
const reviewRoutes = require('./routes/review')
const authRoutes = require('./routes/auth')
const cartRoutes = require('./routes/cart')
const wishlistRoutes = require('./routes/wishlist')


mongoose.connect('mongodb://127.0.0.1:27017/my_appy')
.then(()=>{
    console.log("DB connected successfully")
})
.catch((err)=>{
    console.log("DB error"); 
    console.log(err)
})

let configSession = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly : true,
        expires : Date.now() + 7*24*60*60*1000,   // 7 din 24 ghante 60 min 60 sec 1000 milisec
        maxAge : 7*24*60*60*1000
    }
  };

app.engine('ejs' , ejsMate);
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views')); // views folder 
app.use(express.static(path.join(__dirname , 'public'))); // public folder
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(session(configSession))
app.use(flash())



//  Passport
app.use(passport.session())
app.use(passport.initialize());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    // console.log(req.user);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// seeding database
// seedDB()

app.use(productRoutes); //so that harr incoming request ke liye path check kiya jaae
app.use(reviewRoutes);  //so that harr incoming request ke liye path check kiya jaae
app.use(authRoutes); 
app.use(cartRoutes);
app.use(wishlistRoutes); 

app.listen(8080 , ()=>{
    console.log("server connected at port 8080")
})