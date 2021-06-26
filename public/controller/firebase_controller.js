import * as Constant from '../model/constant.js'
import { Reply } from '../model/reply.js';
import { Thread } from '../model/thread.js';
import * as Element from '../viewpage/element.js'
import * as ThreadPage from '../viewpage/thread_page.js';

export async function signIn(email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function signOut() {
    await firebase.auth().signOut();
}

export async function addThread(thread) {
    const ref = await firebase.firestore()
            .collection(Constant.collectionNames.THREADS)
            .add(thread.serialize());
    return ref.id;
}

export async function getThreadList() {
    let threadList = []
    const snapShot = await firebase.firestore()
        .collection(Constant.collectionNames.THREADS)
        .orderBy('timestamp', 'desc')
        .get();

    snapShot.forEach(doc => {
        const t = new Thread(doc.data());
        t.docId = doc.id
        threadList.push(t);
    });
    return threadList;
}

export async function getOneThread(threadId) {
    const ref = await firebase.firestore()
            .collection(Constant.collectionNames.THREADS)
            .doc(threadId)
            .get();
    if (!ref.exists) return null;
    const t = new Thread(ref.data());
    t.docId = threadId;
    return t;
}

export async function addReply(reply) {
    const ref = await firebase.firestore()
                .collection(Constant.collectionNames.REPLIES)
                .add(reply.serialize());
    return ref.id;
}

export async function getReplyList(threadId) {
    const snapShot = await firebase.firestore()
        .collection(Constant.collectionNames.REPLIES)
        .where('threadId', '==', threadId)
        .orderBy('timestamp')
        .get();
    const replies = [];
    snapShot.forEach(doc => {
        const r = new Reply(doc.data())
        r.docId = doc.id
        replies.push(r);
    });
    
    return replies;
}

export async function searchThreads(keywordsArray) {
    const threadList = []
    const snapShot = await firebase.firestore()
        .collection(Constant.collectionNames.THREADS)
        .where('keywordsArray', 'array-contains-any', keywordsArray)
        .orderBy('timestamp', 'desc')
        .get();
    snapShot.forEach(doc => {
        const t = new Thread(doc.data());
        t.docId = doc.id;
        threadList.push(t)
    });
    return threadList;
}

export async function createAccount(email, password) {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
}

const cf_deleteThread = firebase.functions().httpsCallable('cf_deleteThread');
const cf_updateThread = firebase.functions().httpsCallable('cf_updateThread');
export async function deleteThread(thread) {
    const replyList = await getReplyList(thread.docId);

    if (replyList.length == 0) {
        await cf_deleteThread(thread.docId);
        Element.root.innerHTML = "Thread has been deleted."
        return;
    }

    else {
        const uid = null;
        const title = 'deleted';
        const content = 'deleted';
        const email = null;
        const timestamp = Date.now();
        const keywordsArray = null;

        const deletedThread = new Thread({
            uid, title, content, email, timestamp, keywordsArray,
        });

        const docId = thread.docId;
        const data = deletedThread.serializeForUpdate();

        await cf_updateThread(({docId, data}));

        await ThreadPage.updateOriginalThreadBody(deletedThread);
    }
}

export async function updateThread(thread, threadUpdate) {
    const docId = thread.docId;
    const data = threadUpdate.serializeForUpdate();

    await cf_updateThread({docId, data});
}