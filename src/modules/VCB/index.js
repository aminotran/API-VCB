const { v4: uuid } = require('uuid');
const axios = require('./axiosConfig');
const TwoCaptcha = require('../OCR/2captcha');

const listBank = require('./listBankCode');

class VCB {
    constructor(account) {
        this.user = account.user;
        this.pass = account.pass;
        this.defaultAccount = account.defaultAccount;
        this.captchaId = null;
        this.sessionId = account.sessionId;
        this.clientId = account.clientId;
        this.mobileId = account.mobileId;
    }

    static getListBank() {
        return listBank;
    }

    genNewCaptchaId() {
        this.captchaId = uuid();
        return this.captchaId;
    }


    async getCaptcha(responseType = 'stream') {
        const { data } = await axios({
            method: 'get',
            url: `/utility-service/v1/captcha/${this.captchaId}`,
            responseType,
        });

        return data;
    }

    async solveCaptcha() {
        this.genNewCaptchaId();
        const captchaImg = await this.getCaptcha('arraybuffer');
        return await TwoCaptcha.solveCaptcha(captchaImg);
    }

    async login({ user, pass }) {
        const captchaValue = await this.solveCaptcha();
        return await axios.post('/authen-service/v1/login', {
            user,
            password: pass,
            captchaToken: this.captchaId,
            captchaValue,
            checkAcctPkg: 1,
        });
    }

    async getAllTransactions(time, limit = 10) {
        const transactions = [];
        let pageIndex = 0;
        while (transactions.length < limit) {
            const getTransactionResp = await this.getTransaction(time, pageIndex);
            transactions.push(...getTransactionResp.transactions);
            if (getTransactionResp.nextIndex === '-1') {
                break;
            }
            pageIndex++;
        }

        return transactions;
    }

    async getTransaction(time, pageIndex = 0) {
        const { from, to } = time;
        const {
            data,
        } = await axios({
            url: '/bank-service/v1/transaction-history',
            method: 'POST',
            data: {
                user: this.user,
                accountNo: this.defaultAccount,
                accountType: 'D',
                cif: '',
                fromDate: from,
                lang: 'vi',
                lengthInPage: 10,
                pageIndex,
                stmtDate: '',
                stmtType: '',
                toDate: to,
                sessionId: this.sessionId,
                mobileId: this.mobileId,
                clientId: this.clientId,
            },
        });

        return data;
    }

    async getBalance() {
        const {
            data: { accountDetail },
        } = await axios({
            url: '/bank-service/v1/get-account-detail',
            method: 'POST',
            data: {
                user: this.user,
                accountNo: this.defaultAccount,
                accountType: 'D',
                cif: '',
                lang: 'vi',
                sessionId: this.sessionId,
                mobileId: this.mobileId,
                clientId: this.clientId,
            },
        });

        return accountDetail;
    }

    async getInquiryHolderName({ accountNo, bankCode }) {
        const {
            data,
        } = await axios({
            url: '/napas-service/v1/inquiry-holdername',
            method: 'POST',
            data: {
                user: this.user,
                accountNo,
                bankCode,
                cif: '',
                lang: 'vi',
                sessionId: this.sessionId,
                mobileId: this.mobileId,
                clientId: this.clientId,
            },
        });

        return data;
    }

    // initFastTransferViaAccountNo inits transfer
    // amount: 1000, content: "Tuan vo", creditAccountNo: 49020201, creditBankCode: 970432
    async initFastTransferViaAccountNo({ amount, content, creditAccountNo, creditBankCode }) {
        const {
            data: { transaction },
        } = await axios({
            url: '/napas-service/v1/init-fast-transfer-via-accountno',
            method: 'POST',
            data: {
                user: this.user,
                debitAccountNo: this.defaultAccount,
                amount, content, creditAccountNo, creditBankCode,
                feeType: '1',
                ccyType: '1',
                cif: '',
                mid: 62,
                lang: 'vi',
                sessionId: this.sessionId,
                mobileId: this.mobileId,
                clientId: this.clientId,
            },
        });

        return transaction;
    }

    async transferGenOTP(tranId, type) {
        const {
            data: { challenge },
        } = await axios({
            url: '/napas-service/v1/transfer-gen-otp',
            method: 'POST',
            data: {
                user: this.user,
                tranId, type,
                cif: '',
                lang: 'vi',
                mid: 17,
                sessionId: this.sessionId,
                captchaToken: '',
                captchaValue: '',
                mobileId: this.mobileId,
                clientId: this.clientId,
            },
        });

        return challenge;
    }


    async transferConfirmOTP({ tranId, otp, challenge }) {
        const {
            data,
        } = await axios({
            url: '/napas-service/v1/transfer-confirm-otp',
            method: 'POST',
            data: {
                user: this.user,
                tranId, otp, challenge,
                cif: '',
                lang: 'vi',
                sessionId: this.sessionId,
                mobileId: this.mobileId,
                clientId: this.clientId,
            },
        });

        return data;
    }

    async initTransferInternal({ amount, content, creditAccountNo }) {
        const {
            data: { transaction },
        } = await axios({
            url: '/transfer-service/v1/init-internal-transfer',
            method: 'POST',
            data: {
                user: this.user,
                debitAccountNo: this.defaultAccount,
                amount, content, creditAccountNo,
                feeType: '1',
                ccyType: '',
                cif: '',
                mid: 62,
                lang: 'vi',
                sessionId: this.sessionId,
                mobileId: this.mobileId,
                clientId: this.clientId,
            },
        });

        return transaction;
    }

    async transferGenOTPInternal(tranId, type) {
        const {
            data: { challenge },
        } = await axios({
            url: '/transfer-service/v1/transfer-gen-otp',
            method: 'POST',
            data: {
                user: this.user,
                tranId, type,
                cif: '',
                lang: 'vi',
                mid: 17,
                sessionId: this.sessionId,
                captchaToken: '',
                captchaValue: '',
                mobileId: this.mobileId,
                clientId: this.clientId,
            },
        });

        return challenge;
    }

    async transferConfirmOTPInternal({ tranId, otp, challenge }) {
        const {
            data,
        } = await axios({
            url: '/transfer-service/v1/transfer-confirm-otp',
            method: 'POST',
            data: {
                user: this.user,
                tranId, otp, challenge,
                cif: '',
                mid: 18,
                lang: 'vi',
                sessionId: this.sessionId,
                mobileId: this.mobileId,
                clientId: this.clientId,
            },
        });

        return data;
    }

}

module.exports = VCB;
