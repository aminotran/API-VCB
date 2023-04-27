const VCBRoute = require('./VCB');
const { handleError } = require('../../utiles/handleEvent');

const route = app => {
    app.use('/VCB', VCBRoute);

    app.use(handleError);
};

module.exports = route;
