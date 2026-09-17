import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ mensaje: "Acceso denegado. Token no valido" });
        }

        const token = authHeader.split(' ')[1];

        const payloadDecodificado = jwt.verify(token, process.env.JWT_SECRET);// que el token sea valido y no haya expirado

        req.usuario = payloadDecodificado;// recibe la req antes de que sea enviada al controlador,
        // para que el controlador pueda acceder a la informacion del usuario que hizo la peticion

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensaje: "El token ha expirado. Inicie sesión nuevamente" });
        }
        return res.status(401).json({ mensaje: "Acceso denegado. Token no valido" });
    }
};