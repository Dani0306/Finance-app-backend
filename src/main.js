import express from "express"
import morgan from "morgan"
import cors from "cors"
import connect from "./database.js"
import MovementsRouter from "./routes/Movements.js"
import TotalRouter from "./routes/totalRoutes.js"
import { config } from "dotenv"


config()

import cronFn from "./cron.js"
import ReportRouter from "./routes/ReportRoutes.js"

const app = express()


// MIDDLEWARES

app.use(cors({ origin: "https://finance-app-beta-three.vercel.app" }))
app.use(express.json())
app.use(morgan("common"))


// ROUTES PREFIX

app.use("/total", TotalRouter)
app.use("/movements", MovementsRouter)
app.use("/report", ReportRouter)

// CONNECTING DATABASE

connect().then(() => {
    console.log("Databse up and running")
    app.listen(process.env.PORT || 4000, () => console.log("App running"))
})

cronFn()