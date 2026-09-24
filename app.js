import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { conectarDB } from './src/config/db.js';
import 'dotenv/config';
import { limitadorGlobal } from './src/middlewares/rateLimit.middleware.js';
import authRoutes from './src/routes/auth.routes.js'
import proveedoresRoutes from './src/routes/proveedores.routes.js';
import productosRoutes from './src/routes/productos.routes.js';
import usuariosRoutes from './src/routes/usuarios.routes.js';


const app = express();


//Middlewares globales

//oculta información sensible de la cabecera HTTP
app.use(helmet());

//whitelist de paginas que pueden hacer solicitudes a la API
const origenesPermitidos =['http://localhost:5173', 'https://mi-pagina.com'];//los orígenes permitidos para las solicitudes CORS

//configurando cors para permitir solicitudes desde ciertos orígenes
app.use(cors({
    origin: function (origen, callback) {
        if (!origen || origenesPermitidos.includes(origen)) {
            callback(null, true);
        } else {
            callback(new Error('Bloqueado por politicas CORS'));
        }
    }
}));


app.use(morgan('dev'));
app.use(limitadorGlobal); //aplica el limitador global a todas las rutas
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/productos', productosRoutes);
app.use( '/api/usuarios', usuariosRoutes); //ruta para usuarios
try {
    await conectarDB();
    app.listen(PORT, () => {
        console.log(`Servidor Express listo en http://localhost:${PORT}`);
    });
} catch (error) {
    process.exitCode = 1;
}

export default app;
