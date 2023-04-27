const axios = require('axios');
const VCBCrypt = require('./VCBCrypt');
const AppError = require('../../utiles/appError');

const instance = axios.create({
    baseURL: 'https://digiapp.vietcombank.com.vn',
    responseType: 'json',
    headers: {
        'X-Channel': 'Web',
        'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    },
});

instance.interceptors.request.use(
    function(config) {

        const { data } = config;
        if (!config.url.includes('/utility-service/v1/captcha')) {

            const newData = {
                ...data,
                DT: 'Mac OS X',
                OV: '10_15_7',
                PM: 'Chrome 104.0.0.0',
                lang: 'vi',
            };

            config.data = VCBCrypt.encryptRequest(newData);
        }

        return config;
    },
    function(error) {
        return Promise.reject(error);
    },
);

// Add a response interceptor
instance.interceptors.response.use(
    function(response) {
        const { data, headers, config } = response;
        let cookie = '';
        if (headers['set-cookie']) {
            cookie = headers['set-cookie'][0].split(';')[0];
        }

        if (!config.url.includes('/utility-service/v1/captcha')) {
            const decryptData = JSON.parse(VCBCrypt.decryptResponse(data));
            if (decryptData?.code !== '00') throw new AppError(decryptData, decryptData.des, 500);

            return { data: decryptData, cookie };
        }

        return { data, cookie };
    },
    function(error) {
        return Promise.reject(error);
    },
);

module.exports = instance;
