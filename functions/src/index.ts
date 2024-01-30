import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const firebase = require('firebase');

admin.initializeApp();

const db = admin.firestore();

exports.creacionmantenimientos = functions.firestore
  .document('mantenimientos/{mantenimientosId}')
  .onCreate(async (snap, context) => {
    const mantenimiento = snap.data();
    const email = getEmailFromAuth();

    return db.collection('logs').add({
      accion: 'Creación',
      fecha: new Date().toISOString(),
      data: mantenimiento,
      email: email,
    });
  });

function getEmailFromAuth() {
  const auth = firebase.auth();
  const user = auth.currentUser;

  if (user) {
    return user.email;
  } else {
    return 'Usuario no autenticado';
  }
}

/* 
exports.creacionmantenimientos = functions.auth.user().onCreate(async (user) => {
  const { uid, email } = user;

  try {
    await db.collection("logs").add({
      accion: "Creación de usuario",
      fecha: new Date().toISOString(),
      usuario: email || "Usuario sin correo electrónico",
      uid: uid,
    });
  } catch (error) {
    console.error("Error al agregar registro de log:", error);
  }
}); */

/* 
exports.creacionmantenimientos = functions.firestore
  .document('mantenimientos/{mantenimientosId}')
  .onCreate(
    async (
      snap: functions.firestore.QueryDocumentSnapshot,
      context: functions.EventContext
    ) => {
      const mantenimiento = snap.data();
      const userId = mantenimiento.userId; // Asumiendo que tienes el ID del usuario en los datos del mantenimiento

      let userEmail = 'Usuario no autenticado'; // Valor predeterminado si el usuario no está autenticado

      if (userId) {
        try {
          const userRecord = await admin.auth().getUser(userId);
          userEmail = userRecord.email || userEmail;
        } catch (error) {
          console.error('Error al obtener el usuario:', error);
        }
      }

      return db.collection('logs').add({
        accion: 'Creación',
        fecha: new Date().toISOString(),
        usuario: userEmail,
        data: mantenimiento,
      });
    }
  ); */
/* 
  exports.creacionmantenimientos = functions.firestore
    .document("mantenimientos/{mantenimientosId}")
    .onCreate((snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
      const mantenimiento = snap.data();

      return db.collection("logs").add({
        accion: "Creación", 
        fecha: new Date().toISOString(),
        data: mantenimiento,
      });
    }); */
/* 
  export const creacionMantenimientos2 = functions.firestore
  .document("mantenimientos/{mantenimientosId}")
  .onCreate((snap: QueryDocumentSnapshot, context: functions.EventContext) => {
    
    const mantenimiento = snap.data();

    return db.collection("logs").add({
      accion: "Creación",
      fecha: new Date().toISOString(),
      data: mantenimiento,
    });
  }); */
/* 
exports.eliminacionProducto = functions.firestore
  .document("productos/{productoId}")
  .onDelete((snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const producto = snap.data();

    return db.collection("logs").add({
      accion: "Eliminación",
      fecha: new Date().toISOString(),
      producto: producto,
    });
  });

exports.actualizacionProducto = functions.firestore
  .document("productos/{productoId}")
  .onUpdate((change: functions.Change<functions.firestore.QueryDocumentSnapshot>, context: functions.EventContext) => {
    const productoPrevio = change.before.data();
    const productoActualizado = change.after.data();

    return db.collection("logs").add({
      accion: "Actualización",
      fecha: new Date().toISOString(),
      productoPrevio,
      productoActualizado,
    });
  }); */
