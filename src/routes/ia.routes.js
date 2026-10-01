import { Router } from "express";
import { generarTexto, generarProductoConIA } from "../controllers/ia.controller.js";

// Instanciamos Router correctamente
const router = Router();

// Definimos las rutas
router.post("/generar-texto", generarTexto);
router.post("/cargar-producto", generarProductoConIA);

export default router;

