import Stripe from 'stripe'
import {v4 as uuidV4 } from 'uuid'
import Cart from '../../models/Cart'
import jwt from 'jsonwebtoken'
import Order from '../../models/Order'
import initDb from '../../helpers/initDB'
initDb()

export default async (req,res)=>{
    console.log("dserrg")
    const { email, apartment, street, city, pincode, state } = req.body
    const shippingAddress = `${apartment} ${street}, ${city}, ${pincode}, ${state}`
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error:"you must logged in"})
    }
    try{
          const {userId} = jwt.verify(authorization,process.env.JWT_SECRET)    
          console.log(userId, "userid", req.body)
          const cart = await Cart.findOne({user:userId}).populate("products.product")
          let price  = 0
          cart.products.forEach(item=>{
            price = price + item.quantity * item.product.price
          })
          await new Order({
              user:userId,
              email: email,
              total: price,
              products: cart.products,
              shippingAddress: shippingAddress,
              status: "progress"
          }).save()
          await Cart.findOneAndUpdate(
              {_id:cart._id},
              {$set:{products:[]}}
          )
          res.status(200).json({message:"order success"})
    }catch(err){
        console.log(err)
        return res.status(401).json({error:"error processing order"})
    }
}


// const stripe = Stripe(process.env.STRIPE_SECRET)
// export default async (req,res)=>{
//     const {paymentInfo} = req.body
//     const {authorization} = req.headers
//     if(!authorization){
//         return res.status(401).json({error:"you must logged in"})
//     }
   
//     try{
//           const {userId} = jwt.verify(authorization,process.env.JWT_SECRET)    
//           const cart = await Cart.findOne({user:userId}).populate("products.product")
//           let price  = 0
//           cart.products.forEach(item=>{
//             price = price + item.quantity * item.product.price
//           })
//           const prevCustomer = await stripe.customers.list({
//               email:paymentInfo.email
//           })
//           const isExistingCustomer  = prevCustomer.data.length > 0
//           let newCustomer
//           if(!isExistingCustomer){
//                newCustomer =  await stripe.customers.create({
//                   email:paymentInfo.email,
//                   source:paymentInfo.id
//               })
//           }

//          await stripe.charges.create(
//               {
//                   currency:"INR",
//                   amount: price * 100,
//                   receipt_email:paymentInfo.email,
//                   customer: isExistingCustomer ? prevCustomer.data[0].id : newCustomer.id,
//                   description:`you purchased a product | ${paymentInfo.email}`
//               },{
//                 idempotencyKey:uuidV4()  
//               }
//           )
//           await new Order({
//               user:userId,
//               email:paymentInfo.email,
//               total:price,
//               products:cart.products
//           }).save()
//           await Cart.findOneAndUpdate(
//               {_id:cart._id},
//               {$set:{products:[]}}
//           )
//           res.status(200).json({message:"payment was successful"})





         
//     }catch(err){
//         console.log(err)
//         return res.status(401).json({error:"error processing payment"})
//     }
   

// }