require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');

const API_KEY = require('../../config').CLIENT_KEY_TWO_CAPTCHA;

const instance = axios.create({
    baseURL: 'https://captcha69.com',
    responseType: 'json',
});

class Captcha69 {

    static createTask(file) {
        return new Promise(async(resolve, reject) => {
            try {
                const formData = new FormData();
                formData.append('method', 'base64');
                formData.append('key', API_KEY);
                formData.append('body', Buffer.from(file, 'binary').toString('base64'));
                // formData.append('numeric', 1);
                formData.append('json', 1);

                const { data } = await instance({
                    method: 'post',
                    url: '/in.php',
                    headers: {
                        ...formData.getHeaders(),
                    },
                    data: formData,
                });
                console.log(data.request);
                resolve(data.request);
            } catch (error) {
                reject(error);
            }
        });
    }
    // https://captcha69.com/res.php?key=point_0c7f80b68ffb6bb2b0800300ced0e8e0&action=get&id=600b79db289ac9c3d691c5a5
    static async getResult(requestId) {
        const {
            data: { status, request },
        } = await instance.get(
            `/res.php?key=${API_KEY}&action=get&id=${requestId}&json=1`,
        );
        if (status === 1) return request;
        throw new Error('cannot get solve captcha resolve');
    }

    static async solveCaptcha(dataImg) {
        let count = 0;
        let err;
        const requestId = await Captcha69.createTask(dataImg);
        while (count++ < 20) {
            try {
                // console.log(requestId)
                await this.sleep(1);
                return await Captcha69.getResult(requestId);
            } catch (e) {
                err = e;
            }
        }

        throw err;
    }

    static sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time * 1000));
    }
}

module.exports = Captcha69;
