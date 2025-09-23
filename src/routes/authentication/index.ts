import { Router } from 'express';
import { authenticationController } from "../../controllers/index.js";

const router = Router();

router.post('/register', authenticationController.register);
router.post('/login', authenticationController.login);
router.post('/logout', authenticationController.logout);

export default router;

