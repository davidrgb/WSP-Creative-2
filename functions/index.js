const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const Constant = require('./constant.js')
//const Thread = require('../public/model/thread.js')

exports.cf_deleteThread = functions.https.onCall(deleteThread);
exports.cf_updateThread = functions.https.onCall(updateThread);

async function deleteThread(docId, context) {
    try {
        await admin.firestore()
                .collection(Constant.collectionNames.THREADS)
                .doc(docId)
                .delete();
        return;

        /*const uid = thread.uid;
        const title = 'deleted';
        const content = 'deleted';
        const email = thread.email;
        const timestamp = Date.now();
        const keywordsArray = null;

        const deletedThread = new Thread({
            uid, title, content, email, timestamp, keywordsArray,
        });

        deletedThread.docId = docId;

        await updateThread(deletedThread, null);

        return deletedThread;*/
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