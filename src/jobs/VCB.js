const cron = require('node-cron');
const { VCBModel, VarModel } = require('../models');
const VCBModule = require('../modules/VCB');

const TIME_CRON = 3;

const run = async() => {
    try {

        let isNext = await VarModel.findOne({
            varName: 'allow_cron_job',
        });

        if (!isNext) {
            isNext = await VarModel.create({
                varName: 'allow_cron_job',
                varValue: 'true',
            });
        }

        if (isNext.varValue !== 'true') return;

        const accounts = await VCBModel.find({}).lean();

        const listAccount = accounts.map(account => {
            const api = new VCBModule(account);
            return api.getBalance();
        });

        const runAllAccount = await Promise.allSettled(listAccount);
        
        const listAccountDelete = [];
        runAllAccount.forEach((account, position) => {
            if (account.status === 'fulfilled') return;
            const currentAccount = accounts[position];
            listAccountDelete.push(VCBModel.findByIdAndDelete(currentAccount._id));
        });

        await Promise.allSettled(listAccountDelete);


    } catch (error) {
        console.log('=== CRON JOB ===');
        console.log(error);
    }
};

const task = cron.schedule(
    `*/${TIME_CRON} * * * * *`,
    () => {
        run();
    },
    {
        scheduled: false,
    },
);

module.exports = task;
