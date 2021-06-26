export class Reply {
    constructor(data) {
        this.threadId = data.threadId;
        this.uid = data.uid;
        this.email = data.email;
        this.timestamp = data.timestamp;
        this.content = data.content;
    }

    serialize() {
        return {
            threadId: this.threadId,
            uid: this.uid,
            email: this.email,
            timestamp: this.timestamp,
            content: this.content,
        }
    }

    serializeForUpdate() {
        const r = {};
        if (this.threadId) r.threadId = this.threadId
        if (this.uid) r.uid = this.uid;
        if (this.email) r.email = this.email;
        if (this.timestamp) r.timestamp = this.timestamp;
        if (this.content) r.content = this.content;
        return r;
    }
}