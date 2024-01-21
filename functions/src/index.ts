/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/* import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
 */
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

 
import  * as functions  from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
admin.initializeApp();

const db = admin.firestore();

exports.creacionProducto = functions.Firestore
  .document("productos/{productoId}")
  .onCreate((snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const producto = snap.data();

    return db.collection("logs").add({
      accion: "Creación",
      fecha: new Date().toISOString(),
      producto: producto,
    });
  });

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
  });