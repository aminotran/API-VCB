const { CLIENT_KEY_ANTI_CAPTCHA } = require('../../config/index');
const axios = require('axios');

const CLIENT_KEY = CLIENT_KEY_ANTI_CAPTCHA;

const createTask = binImage => {

    const data = JSON.stringify({
        'clientKey': CLIENT_KEY,
        'task': {
            'type': 'ImageToTextTask',
            'body': Buffer.from(binImage, 'binary').toString('base64'),
            'phrase': false,
            'case': false,
            'numeric': 0,
            'math': false,
            'minLength': 0,
            'maxLength': 0,
        },
    });
    const config = {
        method: 'post',
        url: 'https://api.anti-captcha.com/createTask',
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    };
    return axios(config);
};

const getResult = async taskId => {
    const data = JSON.stringify({
        clientKey: CLIENT_KEY,
        taskId,
    });

    const config = {
        method: 'post',
        url: 'https://api.anti-captcha.com/getTaskResult',
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    };
    return axios(config);
};

const wait = time => {
    return new Promise(resolve => setTimeout(resolve, time * 1000));
};

const solveCaptcha = async base64Image => {
    try {
        const { data: { errorId, taskId } } = await createTask(base64Image);
        if (errorId !== 0) return Promise.reject('Invalid captcha');

        let count = 0;
        while (count < 20) {
            const { data } = await getResult(taskId);
            
            if (data.errorId !== 0) return Promise.reject(data.errorDescription);
            if (data.status === 'ready') {
                return Promise.resolve(data.solution.text);
            }
            await wait(1);
            count++;
        }

        return Promise.reject('AntiCaptcha timeout');

    } catch (e) {
        return Promise.reject(e);
    }
};

module.exports = solveCaptcha;
