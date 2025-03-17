import mongoose from "mongoose"

const { Schema } = mongoose;

const transactionSchema = new Schema({
    amount: { type: Number }, 
    title: { type: String }, 
    category: { type: String }, 
    category_image: { type: String }, 
    payment_method: { type: String }, 
    payment_method_image: { type: String },
    type: { type: String },
    date: { type: Date, default: Date.now() }, 
}, {
    versionKey: false
})


const Transaction = mongoose.model("Transaction", transactionSchema)

export default Transaction