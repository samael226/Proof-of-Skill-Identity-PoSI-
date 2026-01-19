import { Router } from 'express';
import { registerUser, loginUser } from './auth.service.js';


const router = Router();


router.post('/register', async (req, res) => {
try {
const user = await registerUser(req.body);
res.status(201).json(user);
} catch (err: any) {
res.status(400).json({ message: err.message });
}
});


router.post('/login', async (req, res) => {
try {
const result = await loginUser(req.body);
res.json(result);
} catch (err: any) {
res.status(400).json({ message: err.message });
}
});


export default router;