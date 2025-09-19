import { json } from "express";
import { User } from "../models/User.js";
import { Webhook } from "svix";
export const clerkWebhooks = () =>{
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        const headers = {
            "svix-id":request.headers["svix-id"],
            "svix-timestamp":request.headers["svix-timestamp"],
            "svix-signature":request.headers["svix-signature"],

        }

        await whook.verify(json.stringfy(req.body), headers)

        const { data, type} = req.body
        const userData = {
            _id:data.id,
            email:data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,

        }

        //switch cases for different events
        switch (key) {
            case "user.created":{
                await userData.create(userData)
                break;
            }
            case "user.updated":{
                await userData.findByIdAndUpdate(data.id, userData)
                break;
            }
             case "user.deleted":{
                await userData.findByIdAndDelete(data.id)
                break;
            }
        
            default:
                break;
        }
        res.json({success:true, message:"Webhook Received"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}