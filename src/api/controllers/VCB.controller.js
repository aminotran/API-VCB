const VCBModule = require('../../modules/VCB');
const appError = require('../../utiles/appError');
const catchAsync = require('../../utiles/catchAsync');

const PIN_VCB = 970436;

const getListBank = (req, res, next) => {
    const listBank = VCBModule.getListBank();
    res.json({
        status: 'success',
        list_bank: listBank,
    });
};

// [POST] /get-balance
const postGetBalance = catchAsync(async(req, res, next) => {
    const { api } = res.locals;
    const { currentBalance } = await api.getBalance();
    res.json({
        status: 'success',
        current_balance: currentBalance,
    });
});

// [POST] /get-transaction
const postGetTransaction = catchAsync(async(req, res, next) => {
    const { api } = res.locals;
    const { time, limit } = req.body;
    const transactions = await api.getAllTransactions(time, limit);

    res.json({
        status: 'success',
        transactions,
    });
});

const postInitTransferMoney = catchAsync(async(req, res, next) => {
    const { api } = res.locals;
    const { account } = req.body;
    const { account_number, bank_code, amount, content } = account;
    let accountName = '';
    let challenge;
    let transferId;

    if (bank_code === PIN_VCB) {
        const initTransferInternalResp = await api.initTransferInternal({
            amount,
            content,
            creditAccountNo: account_number,
        });

        const { tranId, otpMethod, creditAccountName } = initTransferInternalResp;
        transferId = tranId;
        accountName = creditAccountName;
        challenge = await api.transferGenOTPInternal(tranId, otpMethod);
    } else {
        const { cardHolderName } = await api.getInquiryHolderName({
            accountNo: account_number,
            bankCode: bank_code,
        });
        accountName = cardHolderName;
        const { tranId, otpMethod } = await api.initFastTransferViaAccountNo({
            amount,
            content,
            creditAccountNo: account_number,
            creditBankCode: bank_code,
        });
        transferId = tranId;
        challenge = await api.transferGenOTP(tranId, otpMethod);
    }

    res.json({
        status: 'success',
        accountName,
        challenge: challenge,
        tranId: transferId,
    });
});

const postTransferMoneyConfirm = catchAsync(async(req, res) => {
    const { api } = res.locals;
    const { challenge, tranId, otp, bank_code } = req.body;
    if (bank_code === PIN_VCB) {
        await api.transferConfirmOTPInternal({ tranId, otp, challenge });
    } else {
        await api.transferConfirmOTP({ tranId, otp, challenge });
    }

    res.json({
        status: 'success',
        message: 'Chuyển khoảng thành công',
    });
});


module.exports = { postTransferMoneyConfirm, postInitTransferMoney, postGetBalance, postGetTransaction, getListBank };
