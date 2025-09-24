import { Router } from 'express';
import { authenticationController } from "../../controllers/index.js";

const express = Router();

express.post('/register', authenticationController.register);
express.post('/login', authenticationController.login);
express.post('/logout', authenticationController.logout);

export default express;

