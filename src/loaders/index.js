const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');
const VCBJob = require('./VCB');

module.exports = async app => {
    await mongooseLoader();
    VCBJob();
    expressLoader(app);
};