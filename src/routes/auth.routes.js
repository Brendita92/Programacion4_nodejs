import { Router } from 'express';
import { check } from 'express-validator';
import { limitadorLogin } from '../middlewares/rateLimit.middleware.js';
import { registrarUsuario, login } from '../controllers/auth.controller.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';

const router = Router();

// Registro de usuario
router.post('/registrar', [
  check('email', 'Debe ser un email válido').isEmail(),
  check('password', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 }),
  check('rol', 'Rol no válido').isIn(['ADMIN', 'VENDEDOR']),
  validarCampos
], registrarUsuario);

// Login de usuario
router.post('/login', [
  limitadorLogin,
  check('email', 'Debe ser un email válido').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  validarCampos
], login);

export default router;

