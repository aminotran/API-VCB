const VCBModel = require('./VCB.model');
const VarModel = require('./var.model');
const mongoose = require('mongoose');

const reloadRecord = function reloadRecord(schema) {
    schema.methods.reload = async function() {
        const record = await this.constructor.findById(this);
        Object.assign(this, record);
        return record;
    };
};

mongoose.plugin(reloadRecord);

module.exports = {
    VarModel: mongoose.model('Var', VarModel),
    VCBModel: mongoose.model('VCB', VCBModel),
};
