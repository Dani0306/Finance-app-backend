import mongoose from "mongoose"
import cron from "node-cron"
import Transaction from "./Transaction.js"

const monthlyReportSchema = new mongoose.Schema({
    month: { type: String, required: true },
    transactions: { type: Array, default: [] }, 
    totalExpenses: { type: Number, default: 0 },
    totalSaved: { type: Number, default: 0 }, 
    totalSpentByCategory: { type: Array, default: [] }, 
    totalSpentByPaymentMethod: { type: Array, default: [] },
    alert: { type: Boolean, default: false },
    comparison: { type: Object }
}, {
    versionKey: false
})

const MonthlyReport = mongoose.model("MonthlyReport", monthlyReportSchema)

export default MonthlyReport