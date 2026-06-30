const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mealkitSchema = new Schema({
    title: { type: String, required: true },
    includes: { type: String },
    description: { type: String },
    category: { type: String },
    price: { type: Number },
    cookingTime: { type: Number }, 
    servings: { type: Number },    
    imageUrl: { type: String },   
    featuredMealKit: { type: Boolean, default: false } 
});

module.exports = mongoose.model("mealkits", mealkitSchema);