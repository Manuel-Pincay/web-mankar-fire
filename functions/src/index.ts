 

 
import  * as functions  from "firebase-functions";
import * as admin from "firebase-admin";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
/* import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { EventContext } from "firebase-functions"; */
admin.initializeApp();

const db = admin.firestore();

exports.creacionmantenimientos = functions.firestore
  .document("mantenimientos/{mantenimientosId}")
  .onCreate((snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const mantenimiento = snap.data();

    return db.collection("logs").add({
      accion: "Creación", 
      fecha: new Date().toISOString(),
      data: mantenimiento,
    });
  });

  export const creacionMantenimientos2 = functions.firestore
  .document("mantenimientos/{mantenimientosId}")
  .onCreate((snap: QueryDocumentSnapshot, context: functions.EventContext) => {
    
    const mantenimiento = snap.data();

    return db.collection("logs").add({
      accion: "Creación",
      fecha: new Date().toISOString(),
      data: mantenimiento,
    });
  });
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