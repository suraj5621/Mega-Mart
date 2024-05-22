const express = require('express');
const router = express.Router() //mini instance
const Product = require('../models/Product')
const User = require('../models/User')
const {isLoggedin} = require('../middleware');


router.get('/user/wishlist' ,isLoggedin , async(req,res)=>{
    let user = await User.findById(req.user._id).populate('wishlist');
    res.render('cart/wishlist' ,  {user})
})

router.post('/user/:productId/addwishlist', isLoggedin  , async(req,res) => {
    let {productId} = req.params;
    let  userId = req.user._id;
    let foundProduct = await Product.findById(productId);
    let found_user = await User.findById(userId);
    let isinclude = req.user.wishlist.includes(productId);
    if(isinclude){
        res.redirect('/user/wishlist');
    }
    else{
        await found_user.wishlist.push(foundProduct);
        await found_user.save() ;
        res.redirect('/user/wishlist');
    }
    

    
}) 


router.post('/user/wishlist/:productId/remove', isLoggedin  , async(req,res) => {
    let {productId} = req.params;
    let  user = req.user;
    let isinclude = user.wishlist.includes(productId);
    

    const option = isinclude? '$pull' : '$addToSet';

    req.user = await User.findByIdAndUpdate(req.user._id , {[option]:{wishlist:productId}} , {new:true} )

    res.redirect('/user/wishlist');

    
}) 


module.exports = router;