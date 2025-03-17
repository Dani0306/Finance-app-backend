import { Router } from "express"
import MonthlyReport from "../models/MonthlyReport.js"

const ReportRouter = Router()


ReportRouter.get("/:year/:month", async (req, res) => {
    const { year, month } = req.params

    const report = await MonthlyReport.findOne({ month: `${year}-${month}` })

    return res.status(200).json({ report })
})


ReportRouter.delete("/all", async (req, res) => {
    const deleted = await MonthlyReport.deleteMany();

    return res.status(200).json(deleted)
})

export default ReportRouter