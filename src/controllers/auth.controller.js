import { Usuario } from "../models/Usuario.js";
import jwt from "jsonwebtoken";

export const registrarUsuario = async (req, res) => {
    try {
        const usuario = new Usuario(req.body);
        await usuario.save();
        res.status(201).json({ mensaje: "Usuario Registrado" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


















export const registrarUsuario1 = async (req, res) => {
    try {

    } catch (error) {

    }
};

export const registrarUsuario2 = async (req, res) => {
    try {

    } catch (error) {

    }
};