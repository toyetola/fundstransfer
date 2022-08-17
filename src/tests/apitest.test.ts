import express, {Express, Request, Response} from 'express'
import supertest from "supertest";
import { config } from "dotenv";
import db from '../config/testdb.config';
import { sign } from "jsonwebtoken";
import { hash } from "bcrypt";
import { router } from '../routes/api'


config();

const app = express();

app.use(express.json())
app.use('/', router);

let order;
let usertoken : string;

beforeAll((done) => {
    done();
})

afterAll( (done) => {
    // db.raw('SET FOREIGN_KEY_CHECKS = 0;')
    db('transactions').del()
    db('wallets').del()
    db('users').del()
    db.migrate.rollback()
    db.destroy()
    // db.raw('SET FOREIGN_KEY_CHECKS = 1;')
    done();
});



const generateAccountNumber = async (length: number) => {
    const min = Math.pow(10, (length-1));
    const max = Math.pow(10, (length));
    return await Math.floor(Math.random() * (max - min) + min);
}

const version = process.env.APP_VERSION

describe('Customer Endpoints', () => {
    it('should create an account and display details', async () => {
        const hashPass = await hash("1234567", 10)
        const account_number = await generateAccountNumber(10)
        const result = await db('users').insert({
            firstname: 'Bola',
            lastname: 'Jendor',
            email: 'test@email.com',
            password: hashPass,
            account_number:account_number
        })
        const createWallet = await db("wallets").insert({user_id:result[0]})
        const userPayload = {
            userId: result[0]
        }    
        
        const jwtToken = await sign(userPayload, process.env.PUBLIC_KEY);
        usertoken = jwtToken

        const res = await supertest(app)
        .get(`/api/${version}/getAccountDetails`)
        .set('Authorization', `Bearer ${jwtToken}`)
        
        expect(res.statusCode).toEqual(200)
        expect(res.body.data).toBeTruthy();
        expect(res.body.data).toHaveProperty("email");
        return;
    })

    it('should fund wallet', async () => {
        try {
            const res = await supertest(app)
            .post(`/api/${version}/fundWallet`)
            .set('Authorization', `Bearer ${usertoken}`)
            .send({
                "amount":500.00
            })
            console.log(res)
            expect(res.statusCode).toEqual(200)
            expect(res.body.data).toBeTruthy();
            expect(res.body.data).toHaveProperty("balance");
            return;
        } catch (error) {
            console.log(error)
        }
        
    })

    it('should withdraw from account', async () => {
        try {
            const res = await supertest(app)
            .post(`/api/${version}/withdraw`)
            .set('Authorization', `Bearer ${usertoken}`)
            .send({
                "amount_to_withdraw":200.00
            })
            console.log(res)
            expect(res.statusCode).toEqual(200)
            expect(res.body).toBeTruthy();
            expect(res.body).toHaveProperty("balance");
            return;
        } catch (error) {
            console.log(error)
        }
        
    })
})