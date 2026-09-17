
export const verificarRolAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(500).json({ mensaje: "Error interno: se intento verifiacar el rol , pero no se consigio el usuario" });
    }
    if (req.usuario.rol !== "admin") {
        return res.status(403).json({ mensaje: "Acceso denegado. Solo los administradores pueden realizar esta accion" });
    }
    next();
};