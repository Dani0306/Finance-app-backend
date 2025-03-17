import mongoose from "mongoose"

const { Schema } = mongoose;


const totalSchema = new Schema({
    name: { type: String, default: "total" },
    total: { type: Number }, 
    bancolombia: { type: Number }, 
    nu: { type: Number }, 
    monthly_goal: { type: Number, default: 0 }
}, {
    versionKey: false
})


const Total = mongoose.model("Total", totalSchema)

export default Total