const { Schema, model } = require('mongoose');
const { encryptData } = require('../modules/cryptData');

const VCB = new Schema(
    {
        user: {
            type: String,
            required: true,
        },
        pass: {
            type: String,
            required: true,
        },

        defaultAccount: {
            type: String,
            required: true,
        },
        sessionId: {
            type: String,
        },
        mobileId: {
            type: String,
        },
        clientId: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

VCB.pre('findOneAndUpdate', function(next) {
    this._update.pass = encryptData(this._update.pass);
    //console.log(this._update);
    next();
});

module.exports = VCB;

