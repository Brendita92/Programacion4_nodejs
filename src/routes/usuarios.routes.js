import { Router } from 'express';
import { check } from 'express-validator';
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    borrarUsuario
} from '../controllers/usuario.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRolAdmin } from '../middlewares/rol.middleware.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';

const router = Router();

// Validaciones comunes para usuario
const checksUsuario = [
    check('email', 'Debe ser un email válido').optional().isEmail(),
    check('password', 'La contraseña debe tener al menos 8 caracteres').optional().isLength({ min: 8 }),
    check('rol', 'Rol no válido').optional().isIn(['ADMIN', 'VENDEDOR']),
];

// Obtener todos los usuarios (solo ADMIN)
router.get('/', [
    verificarToken,
    verificarRolAdmin
], obtenerUsuarios);

// Obtener usuario por ID (solo autenticados)
router.get('/:id', verificarToken, obtenerUsuarioPorId);

// Actualizar usuario (solo ADMIN)
router.put('/:id', [
    verificarToken,
    verificarRolAdmin,
    ...checksUsuario,
    validarCampos
], actualizarUsuario);

// Borrar usuario (solo ADMIN)
router.delete('/:id', [
    verificarToken,
    verificarRolAdmin
], borrarUsuario);

export default router;
