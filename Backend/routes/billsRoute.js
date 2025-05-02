const express = require('express');
const BillModel = require('../models/billModel');
const  sendEmail  = require('../mailer');
const Razorpay=require('razorpay');
const { payment, verfiy } = require('../paymentController');
const router = express.Router();


router.post('/payments',payment)
router.post('/verify',verfiy)









router.post("/charge-bill", async(req, res) => {
    
    try {
        const newbill = new BillModel(req.body)
        console.log(newbill)
        await sendEmail(newbill)
        await newbill.save()
        res.send('Bill charged successfully')
    } catch (error) {
        res.status(400).json(error);
    }
});

router.get("/get-all-bills", async(req, res) => {
    
    try {
        const bills = await BillModel.find()
        res.send(bills)
    } catch (error) {
        res.status(400).json(error);
    }
});





module.exports = router
 