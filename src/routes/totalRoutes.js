import { Router } from "express"
import Total from "../models/Total.js"

const TotalRouter = Router();

TotalRouter.post("/create", async (req, res) => {
    const { total, bancolombia, nu, monthly_goal } = req.body;

    const newTotal = new Total({
        name: "total", 
        total, 
        bancolombia, 
        nu, 
        monthly_goal
    })

    const newTotalSaved = await newTotal.save();

    return res.status(200).json(newTotalSaved)

})

export default TotalRouter


TotalRouter.get("/get", async (req, res) => {
    const total = await Total.findOne({ name: "total" });
    return res.status(200).json(total)
})

TotalRouter.delete("/all", async (req, res) => {
    const deleted = await Total.deleteMany();

    return res.status(200).json(deleted)
})

TotalRouter.put("/modify/:id", async (req, res) => {
    const { id } = req.params
    const { total, nu, bancolombia, monthly_goal } = req.body;

    const modified = await Total.findByIdAndUpdate(id, { total: Number(total), nu: Number(nu), bancolombia: Number(bancolombia), monthly_goal: Number(monthly_goal) }, { new: true });

    return res.status(200).json({ total: modified })
})