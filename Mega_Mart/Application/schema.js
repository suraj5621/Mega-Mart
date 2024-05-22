
// schema for your server side validation

const Joi = require('joi');

const productSchema = Joi.object({
    name : Joi.string().required(),
    img: Joi.string().required(),
    price: Joi.string().required().min(0),    // jbb -ve value daal rha hu to accept kyu kr rha hai 
    category: Joi.string().required(),
    desc: Joi.string().required(),
    // author : Joi
})

const reviewSchema = Joi.object({
    rating: Joi.string().min(0).max(5).required(),
    comment:Joi.string().required()
})

// const userSchema = Joi.object({

// })

module.exports ={productSchema , reviewSchema};