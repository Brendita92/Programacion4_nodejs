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

usuarioSchema.pre('save', async function(next) {

    if (!this.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(10);

        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

usuarioSchema.methods.compararPassword = async function(passwordIgresado) {
    return await bcrypt.compare(passwordIgresado, this.password);
};


export const Usuario = mongoose.model('Usuario', usuarioSchema);