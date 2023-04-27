const { VCBModel } = require('../../models');
const VCBModule = require('../../modules/VCB');
const appError = require('../../utiles/appError');
const catchAsync = require('../../utiles/catchAsync');


const setToken = catchAsync(async(req, res, next) => {
    const { user, pass, accountNumber } = req.body;
    if (!user || !pass) {
        throw new appError('Please enter your user and password !');
    }

    const infoAccount = await VCBModel.findOne({ user });

    let api = null;
    if (!infoAccount) {
        api = new VCBModule({});
        const { data } = await api.login({
            user,
            pass,
        });

        const {
            sessionId, userInfo: { defaultAccount, clientId, mobileId },
        } = data;

        await VCBModel.findOneAndUpdate(
            { user },
            { pass, defaultAccount, sessionId, clientId, mobileId },
            { upsert: true, new: true, setDefaultsOnInsert: true },
        );

        const newBody = {
            user,
            pass,
            defaultAccount: accountNumber || defaultAccount,
            sessionId,
            clientId, mobileId,
        };

        api = new VCBModule(newBody);

    } else {
        infoAccount.defaultAccount = accountNumber || infoAccount.defaultAccount;
        api = new VCBModule(infoAccount);
    }

    res.locals.api = api;
    next();
});

module.exports = { setToken };
