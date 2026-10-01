import { Router } from 'express';
import { buscarPersonaje } from '../controllers/swapi.controller.js';

const router = Router();

router.get('/', buscarPersonaje);

export default router;