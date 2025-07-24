import { Router } from 'express';

import { signUp, signIn, signOut } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.validation.js';
const authRouter = Router();

authRouter.post('/register', validate(registerSchema), signUp);
authRouter.post('/login', validate(loginSchema), signIn);
authRouter.post('/logout', signOut);

export default authRouter;