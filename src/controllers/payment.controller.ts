import axios from "axios";
import { Request, Response } from "express";
import { configDotenv } from "dotenv";
configDotenv()

class PayStackController {
    private PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
    private PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY
    constructor() {

    }

    public initializePayment = async(req:Request, res:Response) =>{
        try {

            const {amount, email} = req.body;
            const response:any = await axios.post('https://api.paystack.co/transaction/initialize',
            {
                amount,
                email,
                callback_url: 'http://localhost:3000/dashboard'
            },
            {
                headers: { 
                    Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
    
            res.json({
                authorization_url: response.data.data.authorization_url,
                reference: response.data.data.reference
            })
        } catch (error:any) {
            res.status(500).json({
                status: false,
                error: error.message
            })
        }
    }

    public verifyPayment = async(req: Request, res: Response) => {
        try {
            const {reference} = req.params

            const response:any = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`
                }
            });
            const paymentData = response.data.data 

            if(paymentData.status === 'success' && paymentData.gateway_response === 'success'){
                // Save Payment to your database 
                // update user Subscription status 
                res.status(200).send({
                    status: false,
                    amount: paymentData.amount/100,
                    reference: paymentData.reference
                })
            }else{
                res.status(400).json({
                    status: false,
                    message: 'Payment Verification Failed'
                })
            }
        } catch (error:any) {
            res.status(500).json({
                error: error.message
            })
        }
    }
}

export default PayStackController