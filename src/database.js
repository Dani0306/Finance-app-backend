import mongoose from "mongoose"
import { config } from "dotenv"

config()

export default () => mongoose.connect(process.env.DATABASE_URI)

