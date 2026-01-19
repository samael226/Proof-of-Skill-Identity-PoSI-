import { pool } from '../../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../config/jwt.js';


interface RegisterInput {
username: string;
email: string;
password: string;
}


interface LoginInput {
email: string;
password: string;
}


export async function registerUser({ username, email, password }: RegisterInput) {
const hashed = await bcrypt.hash(password, 10);
const res = await pool.query(
'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, role',
[username, email, hashed]
);
return res.rows[0];
}


export async function loginUser({ email, password }: LoginInput) {
const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
if (res.rows.length === 0) throw new Error('User not found');


const user = res.rows[0];
const valid = await bcrypt.compare(password, user.password_hash);
if (!valid) throw new Error('Invalid password');


const token = jwt.sign(
{ id: user.id, username: user.username, role: user.role },
JWT_SECRET,
{ expiresIn: JWT_EXPIRES_IN }
);


return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
}