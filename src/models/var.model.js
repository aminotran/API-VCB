const { Schema, model } = require('mongoose');

const Var = new Schema({
    varName: {
        type: String,
        required: true,
    },
    varValue: {
        type: String,
        required: true,
    },
    varDescription: {
        type: String,
    },
}, {
    timestamps: true,
});

Var.statics.findOneAndCreate = async function(condition, doc) {
    const one = await this.findOne(condition);
    return one || this.create(condition);
};

module.exports = Var;
