const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const Constant = require('./constant.js')

exports.cf_deleteThread = functions.https.onCall(deleteThread);
exports.cf_updateThread = functions.https.onCall(updateThread);
exports.cf_deleteReply = functions.https.onCall(deleteReply);
exports.cf_isAdmin = functions.https.onCall(isAdmin);

async function isAdmin(email) {
    return Constant.adminEmails.includes(email);
}

async function deleteThread(docId, context) {
    try {
        await admin.firestore()
                .collection(Constant.collectionNames.THREADS)
                .doc(docId)
                .delete();
        return;
    }
    catch (e) {
        if (Constant.DEV) console.log(e);
        throw new functions.https.HttpsError('internal', 'deleteThread failed');
    }

}

async function updateThread(info, context) {
    try {
        await admin.firestore().collection(Constant.collectionNames.THREADS)
                .doc(info.docId).update(info.data);
    }
    catch (e) {
        if (Constant.DEV) console.log(e);
        throw new functions.https.HttpsError('internal', 'updateThread failed');
    }
}

async function deleteReply(docId, context) {
    try {
        await admin.firestore().collection(Constant.collectionNames.REPLIES)
                .doc(docId)
                .delete();
        return;
    }
    catch (e) {
        if (Constant.DEV) console.log(e);
        throw new functions.https.HttpsError('internal', 'deleteReply failed');
    }
}