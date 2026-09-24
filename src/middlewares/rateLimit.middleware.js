import rateLimit from 'express-rate-limit';
export const limitadorGlobal = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos representa el tiempo en milisegundos
    max: 100, // número máximo de solicitudes permitidas en el período de tiempo 
    message:{
        mensaje:'Demasiadas solicitudes desde esta IP, por favor intente nuevamente después de 15 minutos' }// mensaje de error cuando se excede el límite
});

export const limitadorLogin = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora representa el tiempo en milisegundos
    max: 5, // número máximo de solicitudes permitidas en el período de tiempo
    message:{
        mensaje:'Demasiadas solicitudes desde esta IP, por favor intente nuevamente después de 1 hora' }
});

