const sequelize = require("./utils/database");

const Customer = require("./models/customer");
const Order = require("./models/order");

//defining that customer has a one to many relationship with order table.
//the below line automatically defines this relationship and also creates a foregin key of customer_id in order table.
Customer.hasMany(Order);

let customerId = null;
sequelize
    .sync({force:true})         //{force:true} is used if there exists already created tables, it will drop those tables first and then recreate those tables with the new information
    .then(result=>{
        return Customer.create({name:"Devanshi", email: "abc@gmail.com"})
        // console.log(result);
    })
    .then((customer)=>{
        customerId=customer.id;
        console.log("First Customer created :" ,customer);
        return customer.createOrder({total:49});             
                                 //such methods are already provided by sequelize...makes it so much easier for us
        // return Order.create({total:45});
    })
    .then(order=>{
        console.log("Order is: ",order );
        return Order.findAll({where: customerId});
    })
    .then(orders=>{
        console.log("All orders by the customer:", orders);
    } )
    .catch((err)=>{
        console.log(err);
    });