import { dbFirestore } from '../config/firebase.js';
import { io } from '../../app.js';

export const initFirebaseListener = () => {
  console.log("Node.js está escuchando Firestore en tiempo real");

  dbFirestore.collection('alertas').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((cambio) => {
      if (cambio.type === 'added') {
        const nuevaAlerta = cambio.doc.data();
        console.log('Nueva alerta recibida:', nuevaAlerta);

        // Emitir evento a todos los clientes conectados vía WebSocket
        io.emit('nueva_alerta', nuevaAlerta);
      }
    });
  });
};
