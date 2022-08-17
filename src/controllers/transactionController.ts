import { db } from '../config/db.config'
import  {Request, Response} from 'express'
import { sign } from "jsonwebtoken";
import { NEWDATE } from 'mysql/lib/protocol/constants/types';

const fundWallet = async (req:any, res:Response) => {
    try {
        if(!req.body.amount)
            res.send('Please provide a valid amount')
        if(typeof req.body.amount != 'number')
        res.send('Please provide a number as amount')
        const  { amount } = req.body

        const userExist = await db('wallets').where('user_id', '=', req.user).first()
        
        let _balance = userExist.balance

        if (userExist) {
            _balance  += parseFloat(amount)
            const newBalance  = await db('wallets').update({"balance":_balance, 'updated_at': new Date()})
            return res.status(200).json({data:{balance:_balance}, message: "Balance updated"})
        }
        res.status(403).send('Wallet missing')

    } catch (error) {
        res.send(error)
    }
}

const sendMoney = async (req:Request, res:Response) => {
    try {
        if (!req.body.to_account || !req.body.from_account) {
            return res.status(403).send("'to_account' and 'from_account' should be set")
        }

        if (req.body.to_account == req.body.from_account)
            return res.status(403).send("You canoot perform transaction with same account")
        
        let {from_account, to_account, amount} = req.body
        if (typeof amount != 'number')
            return res.status(403).json({error:"This amount should be a number type"})

        if (typeof req.body.to_account === 'number' || typeof req.body.to_account === 'number')
            from_account = String(from_account)
            to_account = String(to_account)

        const sender = await db('users').select('users.id', 'firstname', 'lastname', 'account_number', 'balance').where('account_number', '=', from_account).leftJoin('wallets', 'users.id', 'wallets.user_id').first();
        const receiver = await db('users').where('account_number', '=', to_account).leftJoin('wallets', 'users.id', 'wallets.user_id').first('users.id', 'firstname', 'lastname', 'account_number', 'balance')
            
        if (sender && receiver) {
            let _sender_balance =sender.balance

            if (amount > _sender_balance)
                return res.status(403).json({"error":"there is no sufficient funds for this"}) 
 
            _sender_balance -= amount

            let _receiver_balance = receiver.balance == null ? 0 : receiver.balance
            
            _receiver_balance += amount

            await db('wallets').where({"user_id":sender.id})
            .update({"updated_at":new Date(), "balance":_sender_balance})

            await db('wallets').where({"user_id":receiver.id})
            .update({"updated_at":new Date(), "balance":_receiver_balance})


            return res.status(200).json(
                {
                    sender_account_name: sender.firstname+' '+sender.lastname, 
                    sender_account:sender.account_number,
                    receiver_account_name: receiver.firstname+' '+receiver.lastname,
                    receiver_account: receiver.account_number,
                    amount: amount
                }
            )
        }
        return res.status(403).send("Either of the sender or the receiver account is not valid")
    } catch (error) {
        res.send(error)
    }
}

const withdrawMoney = async (req:any, res:Response) => {
    try {

        if (typeof req.body.amount_to_withdraw != 'number')
            return res.status(403).send("The input has to be a number")

        const  { amount_to_withdraw } = req.body

        const accontToDebit = await db('wallets').select('balance').where('user_id', '=', req.user).first();
    
        let _balance;
        _balance = parseFloat(accontToDebit.balance)
        
        if (amount_to_withdraw > _balance)
            return res.status(403).json({"error":"there is no sufficient funds for this transaction"}) 

        _balance -= amount_to_withdraw
       const new_balance_record = await db('wallets').where({"user_id":req.user})
            .returning('balance', 'updated_at')
            .update({"updated_at":new Date(), "balance":_balance})
            

        return res.status(200).json({balance:_balance, amount_withdrawn:amount_to_withdraw, message:"Withdraw successful", date_and_time:new Date()})

    } catch (error) {
        res.send(error)
    }
}

const getAccountDetails =  async (req:any, res:Response) => {
    try {
        const user = await db.select('users.id','firstname', 'lastname', 'email', 'account_number', 'wallets.balance').from('users').where('users.id', '=', req.user).leftJoin("wallets", "users.id", "wallets.user_id").first()
        if (user) {
            return res.status(200).json({data:user, message:"Details successfully fetched"})    
        }
        return res.status(403).send("An error occured fetching your details")
    } catch (error) {
        res.send(error)
    }
    
}

const getMyAccountBalance =  async (req:any, res:Response) => {
    try {
        const user = await db.select('balance').from('wallets').where('user_id', '=', req.user).first()
        if (user) {
            return res.status(200).json({data:user, message:"Balance successfully fetched"})    
        }
        return res.status(403).send("An error occured fetching your details")
    } catch (error) {
        res.send(error)
    }
    
}

export { fundWallet, sendMoney, withdrawMoney, getAccountDetails, getMyAccountBalance }