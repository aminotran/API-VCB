require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');

const API_KEY = process.env.KEY_CAPTCHA;

const instance = axios.create({
    baseURL: 'http://azcaptcha.com',
    responseType: 'json',
});

class AzCaptcha {

    static createTask(file) {
        return new Promise(async (resolve, reject) => {
            try {
                const formData = new FormData();
                formData.append('method', 'post');
                formData.append('key', API_KEY);
                formData.append('file', file);
                formData.append('json', 1);

                const { data } = await instance({
                    method: 'post',
                    url: '/in.php',
                    headers: {
                        ...formData.getHeaders(),
                    },
                    data: formData,
                });
                resolve(data.request);
            } catch (error) {
                reject(error);
            }
        });
    }

    static getResult(requestId) {
        return new Promise(async (resolve, reject) => {
            try {
                const {
                    data: { status, request },
                } = await instance.get(
                    `/res.php?key=${API_KEY}&action=get&id=${requestId}&json=1`,
                );

                if (status === 1) return resolve(request);
                reject(false);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

    static async solveCaptcha(dataImg) {
        try {
            const requestId = await AzCaptcha.createTask(dataImg);
  
            await this.sleep(5);

            const res = await AzCaptcha.getResult(requestId);

            return Promise.resolve(res);
        } catch (error) {
            console.error({ error });
            return Promise.reject(error);
        }
    }

    static sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time * 1000));
    }
}

module.exports = AzCaptcha;
