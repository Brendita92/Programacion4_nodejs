import {validationResult} from 'express-validator';

export const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) { //si errores no está vacío, significa que hay errores de validación
        return res.status(400).json({ 
            mensaje: "errores de validacion en los datos enviados",
            errores: errores.array() });
    }
    next();
};
