import {Router} from 'express';
import { signUp, signIn, signOut, verifyEmail ,resendVerificationEmail ,forgotPassword, resetPassword} from '../controllers/auth.js';

const authRouter = Router();

authRouter.post('/sign-up',signUp);

authRouter.post('/sign-in',signIn);

authRouter.post('/sign-out',signOut);

authRouter.post('/forgot-password', forgotPassword);

authRouter.post('/reset-password/:token', resetPassword);

authRouter.post('/verify-email',verifyEmail);

authRouter.post('/resend-verification', resendVerificationEmail);

export default authRouter;