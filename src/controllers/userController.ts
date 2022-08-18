import { db } from '../config/db.config'
import  {Request, Response} from 'express'
import { compare, hash } from 'bcrypt'
import { sign } from "jsonwebtoken";

async function hashPassword(password: string){
    return await hash(password, 10);
}

async function validatePassword(plainPassword: string, hashedPassword: string){
    return await compare(plainPassword, hashedPassword);
}

const generateAccountNumber = async (length:number) => {
    const min = Math.pow(10, (length-1));
    const max = Math.pow(10, (length));
    return await Math.floor(Math.random() * (max - min) + min);
}


const createAccount = async (req:Request, res:Response, next:any) =>{
    try{
        if (req.body.role && (req.body.role == "admin")){
            res.status(403).json({error:"error", message:"Only an admin user can add another admin user"})
        }
        const {email, password, role, firstname, lastname} = req.body
        const hashedPassword = await hashPassword(password)
        const account_number = await generateAccountNumber(10)
        const result = await db('users').insert({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword,
            account_number:account_number
          })
        const createWallet = await db("wallets").insert({user_id:result[0]})  
        console.log(result)
        res.status(201).json({
            data: {firstname:firstname, lastname:lastname, email:email}, message:"Please login to continue"
        });
    } catch (err){
        res.send(err)
    }
}

const login =  async (req:Request, res:Response) => {
    try {
        if (!req.body.email || !req.body.password){
            res.send('Please supply the email and password')
        }
        const { email, password } = req.body;
        const user = await db('users').first().where('email', '=', email);
        
        if (!user) 
            // return next(new Error('Email does not exist'));
            return res.status(401).json({"error":"Email does not exist"});
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) 
            // return next(new Error('Password is not correct'))
            return res.status(401).json({"error":"Password is not correct"});
            const accessToken = await sign({ userId: user.id, iss: process.env.APP_URL}, process.env.PUBLIC_KEY, {
                expiresIn: "1h"
            });
    
        // console.log(accessToken)
        // user.access_token = accessToken;
        const result = await db('users').where('id', '=', user.id).update({'access_token':accessToken})
        
        return res.status(200).json({data: {firstname:user.firstname, lastname:user.lastname, email:user.email, accessToken : accessToken  }, message:"Logged in"})
    
    } catch (error) {
        return res.send(error)
    }
}


const logout = async (req:any, res:Response) => {
    const user = await db("users").where({id:req.user}).select()
    let accessToken = null
    const result = await db("users")
                    .update({
                        access_token:accessToken
                    })
                    .where({
                        id: req.user,
                    })
    
    return res.status(200).json({message:"logged out"})
}

export {createAccount, login, logout}