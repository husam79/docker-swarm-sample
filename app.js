import Express from 'express';
import dotenv from 'dotenv';
import { createPool, terminatePool } from './pg-utilities.js';

dotenv.config()

let pool = createPool(process.env.DB_NAME)
const app = Express()


app.get('/api/current-counter/', async (req, res) => {
  return res.send({value: (await getCurrentCounter())})
})

app.put('/api/current-counter/increase', async (req, res) => {
  return res.send({value: (await increaseCounter())})
})

app.put('/api/current-counter/decrease', async (req, res) => {
    return res.send({value: (await decreaseCounter())})
})


const seedDBIfRequired = async () => {
    try{
        const client = await pool.connect()
        await client.query('select * from counter_tbl')
        client.release()
    } catch(err){
        console.log(JSON.stringify(err))
        terminatePool(pool)
        pool = createPool('postgres')
        let client = await pool.connect()
        await client.query(`CREATE DATABASE counter_db;`)
        client.release()
        terminatePool(pool)

        pool = createPool(process.env.DB_NAME)
        client = await pool.connect()
        await client.query(`
        CREATE TABLE counter_tbl (
            current_value INTEGER
        ); 
        `)
        await client.query(`INSERT INTO counter_tbl(current_value) VALUES(0)`)
        client.release()
    }
}

const getCurrentCounter = async () => {
    const client = await pool.connect()
    const r = await client.query('select * from counter_tbl')
    client.release()
    return r.rows[0]['current_value']
    }

const increaseCounter = async () => {
    const client = await pool.connect()
    const r = await client.query('update counter_tbl set current_value = (select current_value from counter_tbl) + 1 RETURNING *')
    client.release()
    return r.rows[0]['current_value']
}

const decreaseCounter = async () => {
    const client = await pool.connect()
    const r = await client.query('update counter_tbl set current_value = (select current_value from counter_tbl) - 1 RETURNING *')
    client.release()
    return r.rows[0]['current_value']
}

seedDBIfRequired().then(() => {
    console.log('DB connected.')
})

app.listen(process.env.LISTEN_PORT, () => console.log(`Listening on port ${process.env.LISTEN_PORT}`))