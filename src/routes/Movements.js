import { Router } from "express"
import Total from "../models/Total.js"
import Transaction from "../models/Transaction.js"

const MovementsRouter = Router();

MovementsRouter.post("/create", async (req, res) => {
    try {
        const { amount, title, category, category_image, payment_method, payment_method_image, type } = req.body;
        const total = await Total.findOne({ name: "total" });

        if (!total) return res.status(404).json({ message: "Total record not found" });

        const newTransaction = new Transaction({ amount, title, category, category_image, payment_method, payment_method_image, type });

        const isBancolombia = payment_method.includes("bancolombia");
        const updateFields = {
            total: Number(total.total) + (type === "outgoing" ? Number(-amount) : Number(amount)),
            [isBancolombia ? "bancolombia" : "nu"]: Number(total[isBancolombia ? "bancolombia" : "nu"]) + (type === "outgoing" ? Number(-amount): Number(amount))
        };

        await Total.findByIdAndUpdate(total._id, updateFields, { new: true });

        const transaction = await newTransaction.save();
        return res.status(200).json(transaction);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});


MovementsRouter.get("/getCurrentMonthTransactions", async (req, res) => {
    
    const now = new Date()
    const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const transactions = await Transaction.find({
        date: { $gte: firstDayMonth, $lte: lastDayMonth }
    });

    const totalOutcome = transactions.reduce((acc, transaction) => acc + (transaction.type !== "incoming" ? transaction.amount : 0), 0);
    // const totalIncome = transactions.reduce((acc, transaction) => acc + (transaction.type === "incoming" ? transaction.amount : 0), 0)
    

    let  transactionsArray = [
        {
            name: "Transport",
            totalSpent: 0, 
            goal: 250000,
            alert: false
        }, 
        {
            name: "House hold", 
            totalSpent: 0,
            goal: 650000,
            alert: false
        }, 
        {
            name: "Personal spents", 
            totalSpent: 0, 
            goal: 200000,
            alert: false
        }, 
        {
            name: "Food", 
            totalSpent: 0, 
            goal: 200000,
            alert: false
        },
    ]

    for (let i = 0; i < transactions.length; i++){
        for (let j = 0; j < transactionsArray.length; j++){
            if(transactions[i].category === transactionsArray[j].name) transactionsArray[j].totalSpent += transactions[i].amount
            if(!transactionsArray[j].alert){
                if(transactionsArray[j].totalSpent > transactionsArray[j].goal){
                    transactionsArray[j].alert = true
                }
            }
        }
    }

    return res.status(200).json({ transactions, transactionsArray, totalSpent: totalOutcome })
})


MovementsRouter.delete("/all", async (req, res) => {
    const deleted = await Transaction.deleteMany();
    return res.status(200).json(deleted)
})


MovementsRouter.delete("/transaction/:id", async (req, res) => {

    const { id } = req.params;
    const deleted = await Transaction.findByIdAndDelete(id)

    return res.status(200).json(deleted)

})


MovementsRouter.get("/filterTransactions/:year/:month", async (req, res) => {

    const { month, year } = req.params
    const firstDayMonth = new Date(Number(year), Number(month), 1);
    const lastDayMonth = new Date(Number(year), Number(month) + 1, 0, 23, 59, 59 );


    const transactions = await Transaction.find({
        date: { $gte: firstDayMonth, $lte: lastDayMonth }
    })


    return res.status(200).json({ transactions })
})


export default MovementsRouter

