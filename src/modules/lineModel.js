const https = require('https');

class LineModel {
    constructor() {
        this.token = null;
        this.message = null;
        this.response = null;
        this.stickerPackageId = null;
        this.stickerId = null;
        this.img = null;
        this.api = 'https://notify-api.line.me/api/notify';
    }

    setToken(token) {
        this.token = token;
    }

    setError(response) {
        this.response = {
            status: response.status,
            message: response.message
        };
    }

    setMsg(msg) {
        this.message = `\n${msg}`;
    }

    setSPId(spid) {
        this.stickerPackageId = spid;
    }

    setSId(sid) {
        this.stickerId = sid;
    }

    setImg(img) {
        if (this.isImg(img)) {
            this.img = img;
        }
    }

    addMsg(msg) {
        this.message += `\n${msg}`;
    }

    isImg(img) {
        // you will need to use a library like 'request' or 'axios' to check the header of the image url.
    }

    getError() {
        return this.response;
    }

    getData() {
        return {
            message: this.message,
            stickerPackageId: this.stickerPackageId,
            stickerId: this.stickerId,
            imageThumbnail: this.img,
            imageFullsize: this.img
        };
    }

    getHeader() {
        return {
            Authorization: `Bearer ${this.token}`,
            'Cache-Control': 'no-cache',
            'Content-type': 'multipart/form-data'
        };
    }

    sendNotify() {
        const options = {
            method: 'POST',
            headers: this.getHeader(),
            json: this.getData()
        };
        return new Promise((resolve, reject) => {
            https.request(this.api, options, (res) => {
                res.on('data', (data) => {
                    resolve(JSON.parse(data));
                });
                res.on('error', (error) => {
                    reject(error);
                });
            }).end();
        });
    }
}

module.exports = LineModel;