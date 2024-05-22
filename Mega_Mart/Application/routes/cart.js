const express = require('express');
const router = express.Router() //mini instance
const Product = require('../models/Product')
const User = require('../models/User')
const {isLoggedin} = require('../middleware');




router.get('/user/cart' ,isLoggedin , async(req,res)=>{
    let user = await User.findById(req.user._id).populate('cart');
    res.render('cart/cart' ,  {user})
})

router.post('/user/:productId/add', isLoggedin  , async(req,res) => {
    let {productId} = req.params;
    let  userId = req.user._id;
    let foundProduct = await Product.findById(productId);
    let found_user = await User.findById(userId);
    let isinclude = req.user.cart.includes(productId);
    if(isinclude){
        res.redirect('/user/cart');
    }
    else{
        await found_user.cart.push(foundProduct);
        await found_user.save() ;
        
        res.redirect('/user/cart');
    }

    
}) 


router.post('/user/cart/:productId/remove', isLoggedin  , async(req,res) => {
    let {productId} = req.params;
    let  user = req.user;
    let isinclude = user.cart.includes(productId);
    

    const option = isinclude? '$pull' : '$addToSet';

    req.user = await User.findByIdAndUpdate(req.user._id , {[option]:{cart:productId}} , {new:true} )

    res.redirect('/user/cart');

    
}) 






module.exports = router;