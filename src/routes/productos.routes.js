import { Router } from 'express';
import { check } from 'express-validator';
import {
    crearProveedor,
    obtenerProveedores,
    actualizarCalificacion
} from '../controllers/proveedor.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRolAdmin } from '../middlewares/rol.middleware.js';
import { validarCampos } from '../middlewares/validarCampos.middleware.js';

const router = Router();

const checksProveedor = [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un email válido').isEmail(),
    check('telefono', 'El teléfono debe ser numérico').optional().isNumeric(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty(),
];

// Crear proveedor (solo ADMIN)
router.post('/', [
    verificarToken,
    verificarRolAdmin,
    ...checksProveedor,
    validarCampos
], crearProveedor);

// Obtener proveedores (solo autenticados)
router.get('/', verificarToken, obtenerProveedores);

// Actualizar calificación de proveedor
router.patch('/:id/calificacion', [
    verificarToken,
    check('calificacion', 'La calificación debe ser un número entre 1 y 5').isInt({ min: 1, max: 5 }),
    validarCampos
], actualizarCalificacion);

export default router;
