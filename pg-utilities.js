import pg from 'pg'
import dotenv from 'dotenv';
dotenv.config()

export function createPool(
    db_name,
    user_name=process.env.DB_USER,
    password=process.env.DB_PASSWORD,
    host=process.env.DB_HOST,
    port=process.env.DB_PORT
){
    let connectionString = ''

    if(port > 0){
        connectionString = `postgresql://${user_name}:${password}@${host}:${port}/${db_name}`
    } else {
        connectionString = `postgresql://${user_name}:${password}@${host}/${db_name}`
    }

    const pool = new pg.Pool({
        connectionString: connectionString
    })

    return pool
}

export async function terminatePool(pool){
    if(pool){
        await pool.end()
    }
}