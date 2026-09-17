import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String, 
        required: true
    },
    rol: {
        type: String,
        enum: ['ADMIN', 'VENDEDOR'],
        default: 'VENDEDOR'
    }
}, {
    timestamps: true
});

export const Usuario = mongoose.model('Usuario', usuarioSchema);