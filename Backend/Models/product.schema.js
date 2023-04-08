import mongoose from "mongoose";
 
const productSchema = new mongoose.Schema({
   name: {
    type: String, 
    required: [true, "Please provide a product name"],
    trime: true, 
    maxLength: [120, "Product name should be a max of 120 characters"], 
   }, 
   price: {
    type: Number, 
    required: [true, "Please provide a product price"], 
    maxLength: [5, "Product price should be max of 5 characters"]
   },
   description: {
    type: String,
    // use some form of editor - personal assignment
   },
   photos: [
    {
        secure_url: {
            type: String, 
            required: true 
        }
    }
   ],

   stock:{
    type: Number,
    default: 0,
   },
   
   sold: {
    type: Number,
    default:0
   }, 

   collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection"
   }

}, 
{
    timestamps: true,
}

)

export default mongoose.model("Product", productSchema); 