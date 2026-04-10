import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

let newPool;

if (process.env.NODE_ENV === 'development') {
    // Local development configuration
    newPool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
    });
} else {
    // Production configuration (using connection string + SSL)
    newPool = new Pool({
        connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}?options=project=${process.env.ENDPOINT_ID}`,
        ssl: {
            rejectUnauthorized: false,
        },
    });
}

// Export the pool instance
export const pool = newPool;

// CRITICAL: Keep this helper so index.js can still call query()
export const query = (text, params) => pool.query(text, params);

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export default pool;