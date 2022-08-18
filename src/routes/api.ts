import { createAccount, login, logout } from '../controllers/userController';
import { fundWallet, sendMoney, withdrawMoney, getAccountDetails, getMyAccountBalance } from '../controllers/transactionController';
import { Router } from 'express';
import { config } from 'dotenv';
import { verifyToken } from "../middlewares/authMiddleware";

config()

const router = Router()

const version = process.env.APP_VERSION || "v1";

router.get('/', (req, res) => {
    res.setHeader('content-type', 'text/html');
    res.send(`
        Welcome to Money Transfer API! <br/> <br/>
        
        Here are the uris you can test out: <br/> <br/>

        Create Account  - /api/v1/signup  <br/> <br/>

        Login to your Account /api/v1/login <br/> <br/>

        Fund your wallet /api/v1/fundWallet <br/> <br/>
        
        Withdraw /api/v1/withdraw  <br/> <br/>

        Send Funds to another account /api/v1/sendMoney <br/> <br/>

        Get your account details /api/v1/getAccountDetails <br/> <br/>

        Get your account Balnce /api/v1/getMyAccountBalance 

    `)
})

router.post(`/api/${version}/signup`, createAccount)

router.post(`/api/${version}/login`, login)

/* 
 * Protected routes - Needs Authentication
*/
router.use(verifyToken);

// Log user out
router.get(`/api/${version}/logout`, logout)

router.post(`/api/${version}/fundWallet`, fundWallet)
router.post(`/api/${version}/sendMoney`, sendMoney)
router.post(`/api/${version}/withdraw`, withdrawMoney)
router.get(`/api/${version}/getAccountDetails`, getAccountDetails)
router.get(`/api/${version}/getMyAccountBalance`, getMyAccountBalance)

export { router }

