import { Router } from 'express';
import {
    registrarUsuario
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/', registrarUsuario);

export default router;
