const express = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');
const router = express.Router() //mini instance
const {validateProduct} = require('../middleware');
const {isLoggedin} = require('../middleware');
const {isSeller} = require('../middleware');
const {isProductAuthor} = require('../middleware');


// to show all the products
router.get('/products' , async(req,res)=>{
    try{
        let {category} = req.query;
       if( category == "All" || category == undefined){
            let products = await Product.find({});
            res.render('products/index' , {products});
       }
       else{
            let products = await Product.find({category : category});
            req.flash('success' , 'Product filtered successfully');
            res.render('products/index' , {products});
       }
    }
    catch(e){
        res.render("products/error" ,{err:e.message})
    }
   
})




// to show the form for new product
router.get('/product/new' ,isLoggedin, isSeller , (req,res)=>{
    try{
        res.render('products/new');
    }
    catch(e){
        res.render("products/error" ,{err:e.message})
    }
    
})

// to actually add the product
router.post('/products' , isLoggedin, isSeller ,validateProduct, async(req,res)=>{
    try{
        let {name , img , price , category , desc} = req.body;      // author request ki body se nhi aayega 
        await Product.create({name , img , price , category ,desc ,author : req.user._id}); // jo banda login hai wha se aayega 
        req.flash('success' , 'Product added successfully');
        res.redirect('/products');
    }
    catch(e){
        res.render("products/error" ,{err:e.message})
    }
})


// to show a particular product
router.get('/products/:id' , isLoggedin , async(req,res)=>{
    try{
        let {id} = req.params;
        let foundProduct = await Product.findById(id).populate('reviews');
        res.render('products/show' , {foundProduct})
    }
    catch(e){
        res.render("products/error" ,{err:e.message})
    }
})


// form to edit the product
router.get('/products/:id/edit' , isLoggedin , isSeller, isProductAuthor,  async(req,res)=>{
    try{
        let {id} = req.params;
        let foundProduct = await Product.findById(id);
        
        res.render('products/edit' , {foundProduct})
       
        
    }
    catch(e){
        res.render("products/error" ,{err:e.message})
    }
})

// to actually edit the data in db
router.patch('/products/:id' , isLoggedin ,isSeller, validateProduct , isProductAuthor, async(req,res)=>{
    try{
        let {id} = req.params;
        let {name , img , price , category ,desc} = req.body;
        await Product.findByIdAndUpdate( id , {name , img , price , category, desc}  )
        req.flash('success' , 'Product edited successfully');
        res.redirect(`/products/${id}`);
    }
    catch(e){
        res.render("products/error" ,{err:e.message})
    }
})


// to delete a product
router.delete('/products/:id' , isLoggedin, isSeller,isProductAuthor,  async(req,res)=>{
    try{
        let {id} = req.params;
        const product = await Product.findById(id);

        // for(let id of product.reviews){
        //     await Review.findByIdAndDelete(id);
        // }

        await Product.findByIdAndDelete(id);
        req.flash('success' , 'Product deleted successfully');
        res.redirect('/products');
    }
    catch(e){
        res.render("products/error" ,{err:e.message})
    }
})


module.exports = router;