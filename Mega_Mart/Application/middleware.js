const {productSchema} = require('./schema');
const {reviewSchema} = require('./schema');
const Product =require('./models/Product')

const validateProduct = (req,res,next)=>{
    
    let {name , img , price, category ,desc} = req.body;
    let {error} =productSchema.validate({name ,img , price, category ,desc});
    if( error ){
        res.render('products/error');
    }
    else{
        next();
    }
    
}

const validateReview = (req,res,next) => {
    let {rating , comment} = req.body;
    let {error} =reviewSchema.validate({rating , comment});
    if( error ){
        res.render('products/error');
    }
    else{
        next();
    }
}

const isLoggedin =(req,res,next) =>{
    if(!req.isAuthenticated()){
        req.flash('error' ,'please login first');
        res.redirect('/login');
    }
    else{
        next();
    }
}

const isSeller = (req,res,next)=>{
    if(!req.user.role){
        req.flash('error' , 'You donot have the permission to do that');
        return res.redirect('/products');
    }
    else if(req.user.role !== 'seller'){
        req.flash('error' , 'You donot have the permission to do that');
        return res.redirect('/products');
    }
    next();
}


const isProductAuthor = async(req,res,next)=>{
    let {id} = req.params; //product id
    let product = await Product.findById(id); //entire product
    if(!product.author.equals(req.user._id)){
        req.flash('error' , 'You are not the authorised user');
        return res.redirect('/products');
    }
    next();
}


module.exports = {isProductAuthor,isSeller, isLoggedin ,validateProduct ,validateReview};