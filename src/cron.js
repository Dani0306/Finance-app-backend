import cron from "node-cron"
import Transaction from "./models/Transaction.js"
import MonthlyReport from "./models/MonthlyReport.js"
import Total from "./models/Total.js"


export default () => cron.schedule("00 00 1 * *", async () => {

    console.log("Report generated!")
    const now = new Date()
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const firstDayPreLastMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const lastDayPreLastMonth = new Date(now.getFullYear(), now.getMonth() -1,0, 23, 59, 59)

    const total = await Total.findOne({ name: "total" })
    
    const expensesprevmonth = await Transaction.find({
        date: { $gte: firstDayLastMonth, $lte: lastDayLastMonth }  
    })

    const preLastMonthsExpenses = await Transaction.find({
        date: { $gte: firstDayPreLastMonth, $lte: lastDayPreLastMonth }
    })

    // last month

    const totalExpensesPrevMonth = expensesprevmonth.reduce((acc, transaction) => acc + (transaction.type !== "incoming" ? transaction.amount : 0), 0);
    const totalRevenueLastMonth = expensesprevmonth.reduce((acc, transaction) => acc + (transaction.type === "incoming" ? transaction.amount : 0), 0);


    // pre last month

    const totalExpensesPreLastMonth = preLastMonthsExpenses.reduce((acc, transaction) => acc + (transaction.type !== "incoming" ? transaction.amount : 0), 0);
    const totalRevenuePrelastMonth = preLastMonthsExpenses.reduce((acc, transaction) => acc + (transaction.type === "incoming" ? transaction.amount : 0), 0);

    
    let comparison = {
        percentage: 0,
        direction: false
    };

    if(totalExpensesPrevMonth > totalExpensesPreLastMonth){
        comparison.percentage = (totalExpensesPreLastMonth / totalExpensesPrevMonth) * 100,
        comparison.direction = true
    } else {
        comparison = (totalExpensesPrevMonth / totalExpensesPreLastMonth) * 100;
    }




    let  totalSpentByCategory = [
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

    let totalSpentByPaymentMethod = [
        {
            name: "bancolombia debit",
            total: 0
        }, 
        {
            name: "nu debit", 
            total: 0
        }, 
        {
            name: "bancolombia transaction", 
            total: 0
        }, 
        {
            name: "nu transaction", 
            total: 0
        }, 
        {
            name: "cash", 
            total: 0
        }
    ]

    for (let i = 0; i < expensesprevmonth.length; i++){
        for (let j = 0; j < totalSpentByPaymentMethod.length; j++){
            if(expensesprevmonth[i].payment_method === totalSpentByPaymentMethod[j].name && expensesprevmonth[i].category !== "incoming"){
                totalSpentByPaymentMethod[j].total += expensesprevmonth[i].amount
            }
        }
    }



    for (let i  = 0; i < expensesprevmonth.length; i++){
        for (let j = 0; j < totalSpentByCategory.length; j++){
            if(expensesprevmonth[i].category === totalSpentByCategory[j].name) totalSpentByCategory[j].totalSpent += expensesprevmonth[i].amount
            if(!totalSpentByCategory[j].alert){
                if(totalSpentByCategory[j].totalSpent > totalSpentByCategory[j].goal) totalSpentByCategory[j].alert = true
            }
        }
    }





    const savedReport = await MonthlyReport.create({
        month: `${firstDayLastMonth.getFullYear()}-${(firstDayLastMonth.getMonth() + 1).toString().padStart(2, "0")}`,
        totalExpenses: totalExpensesPrevMonth, 
        transactions: expensesprevmonth.map(({ amount, title, category, category_image, payment_method, payment_method_image, date, type, _id }) => ({
            amount, 
            title, 
            category, 
            category_image, 
            payment_method, 
            payment_method_image,
            date, 
            type, 
            _id
        })).reverse(), 
        totalSaved: totalRevenueLastMonth - totalExpensesPrevMonth, 
        totalSpentByCategory,
        totalSpentByPaymentMethod,
        alert: totalRevenueLastMonth < total.monthly_goal, 
        comparison
    })



    return savedReport
})